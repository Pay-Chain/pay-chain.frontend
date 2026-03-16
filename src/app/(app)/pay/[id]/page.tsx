'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAccount, useSwitchChain, useSendTransaction, useChainId } from 'wagmi';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, TransactionInstruction, VersionedTransaction } from '@solana/web3.js';
import { Button } from '@/presentation/components/atoms';
import { WalletConnectButton } from '@/presentation/components/molecules';
import { Loader2, Copy, Check, AlertCircle, Clock } from 'lucide-react';
import { httpClient } from '@/core/network';
import { useTranslation } from '@/presentation/hooks';
import { QRDisplay } from '@/presentation/components/organisms/checkout/QRDisplay';
import { MethodSelector, MethodType } from '@/presentation/components/organisms/checkout/MethodSelector';

// Extended PaymentRequest for this page (server response includes txData)
interface PaymentRequestResponse {
  requestId: string;
  chainId: string;
  contractAddress: string;
  amount: string;
  decimals: number;
  walletAddress?: string;
  description?: string;
  status: 'PENDING' | 'COMPLETED' | 'EXPIRED' | 'CANCELLED';
  expiresAt: string;
  txData: {
    to?: string;
    programId?: string;
    hex?: string;
    base58?: string;
    base64?: string;
  };
}

const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');

export default function PayPage() {
  const params = useParams();
  const requestId = params.id as string;
  const { t } = useTranslation();

  const [paymentRequest, setPaymentRequest] = useState<PaymentRequestResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [activeMethod, setActiveMethod] = useState<MethodType>('dompetku');

  // EVM Hooks
  const { address: evmAddress, isConnected: isEvmConnected } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { sendTransactionAsync } = useSendTransaction();
  const currentChainId = useChainId();

  // Solana Hooks
  const { connection } = useConnection();
  const { publicKey, sendTransaction: sendSolTransaction } = useWallet();
  const needsEvm = paymentRequest?.chainId?.startsWith('eip155:') ?? false;
  const needsSvm = paymentRequest?.chainId?.startsWith('solana:') ?? false;
  const isWalletReady = needsEvm ? isEvmConnected : needsSvm ? Boolean(publicKey) : false;

  useEffect(() => {
    loadPaymentRequest();
  }, [requestId]);

  useEffect(() => {
    if (!paymentRequest) return;

    const expiresAt = new Date(paymentRequest.expiresAt).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const left = Math.max(0, Math.floor((expiresAt - now) / 1000));
      setTimeLeft(left);

      if (left <= 0) {
        setError(t('pay_page.expired_error'));
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [paymentRequest, t]);

  async function loadPaymentRequest() {
    setIsLoading(true);
    try {
      const result = await httpClient.get<PaymentRequestResponse>(`/v1/pay/${requestId}`);
      if (result.error) {
        setError(result.error || t('pay_page.load_failed'));
      } else if (result.data) {
        setPaymentRequest(result.data);
      }
    } catch (err) {
      setError(t('pay_page.network_error'));
    } finally {
      setIsLoading(false);
    }
  }

  const formatTimeLeft = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatAmount = (amount: string, decimals: number) => {
    const value = parseInt(amount) / Math.pow(10, decimals);
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    });
  };

  const getChainName = (chainId: string) => {
    const chainMap: Record<string, string> = {
      'eip155:1': t('pay_page.chain_names.ethereum'),
      'eip155:137': t('pay_page.chain_names.polygon'),
      'eip155:42161': t('pay_page.chain_names.arbitrum'),
      'eip155:8453': t('pay_page.chain_names.base'),
      'eip155:84532': t('pay_page.chain_names.base_sepolia'),
      'solana:mainnet-beta': t('pay_page.chain_names.solana'),
      'solana:devnet': t('pay_page.chain_names.solana_devnet'),
    };
    return chainMap[chainId] || chainId;
  };

  const copyTxData = () => {
    if (!paymentRequest) return;
    const data = paymentRequest.txData.hex || paymentRequest.txData.base58 || paymentRequest.txData.base64 || '';
    navigator.clipboard.writeText(data);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handlePay = async () => {
    if (!paymentRequest) return;
    setError('');
    setIsPaying(true);

    try {
      if (paymentRequest.chainId.startsWith('eip155:')) {
        // EVM Handling
        if (!isEvmConnected) {
          setError(t('payments.connect_wallet_notice'));
          setIsPaying(false);
          return;
        }

        const targetChainId = parseInt(paymentRequest.chainId.split(':')[1]);
        if (currentChainId !== targetChainId) {
          await switchChainAsync({ chainId: targetChainId });
        }

        if (paymentRequest.txData.hex && paymentRequest.txData.to) {
          const hash = await sendTransactionAsync({
            to: paymentRequest.txData.to as `0x${string}`,
            data: paymentRequest.txData.hex as `0x${string}`,
            value: BigInt(0),
          });
          console.log('EVM Payment sent:', hash);
          window.location.reload();
        }
      } else if (paymentRequest.chainId.startsWith('solana:')) {
        // Solana Handling
        if (!publicKey || !sendSolTransaction) {
          setError(t('pay_page.connect_solana'));
          setIsPaying(false);
          return;
        }

        const encoded = paymentRequest.txData.base58 || paymentRequest.txData.base64;
        if (!encoded) throw new Error(t('pay_page.process_failed'));

        // 1) Try legacy/full serialized transaction path first.
        try {
          const txBuffer = paymentRequest.txData.base58
            ? Buffer.from(decodeBase58(encoded))
            : Buffer.from(encoded, 'base64');
          const versioned = VersionedTransaction.deserialize(txBuffer);
          const signature = await sendSolTransaction(versioned, connection);
          console.log('Solana Payment sent:', signature);
          window.location.reload();
          return;
        } catch (_) {
          // Continue with instruction-data flow.
        }

        // 2) New path: backend sends Anchor instruction bytes (base58) and FE composes transaction.
        if (!paymentRequest.txData.base58 || !paymentRequest.txData.programId) {
          throw new Error(t('pay_page.process_failed'));
        }
        const programId = new PublicKey(paymentRequest.txData.programId);
        const instructionData = decodeBase58(paymentRequest.txData.base58);
        const requestIdBytes32 = uuidToBytes32(paymentRequest.requestId);
        const [paymentRequestPda] = PublicKey.findProgramAddressSync(
          [utf8('payment_request'), requestIdBytes32],
          programId
        );

        const paymentRequestAccount = await connection.getAccountInfo(paymentRequestPda);
        if (!paymentRequestAccount?.data) {
          throw new Error(t('pay_page.process_failed'));
        }
        const decoded = decodeOnchainPaymentRequest(paymentRequestAccount.data);
        const payerTokenAccount = deriveAssociatedTokenAddress(publicKey, decoded.tokenMint);
        const merchantTokenAccount = deriveAssociatedTokenAddress(decoded.receiver, decoded.tokenMint);

        const ix = new TransactionInstruction({
          programId,
          keys: [
            { pubkey: publicKey, isSigner: true, isWritable: true },
            { pubkey: paymentRequestPda, isSigner: false, isWritable: true },
            { pubkey: payerTokenAccount, isSigner: false, isWritable: true },
            { pubkey: merchantTokenAccount, isSigner: false, isWritable: true },
            { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
          ],
          data: Buffer.from(instructionData),
        });
        const { blockhash } = await connection.getLatestBlockhash();
        const tx = new Transaction();
        tx.feePayer = publicKey;
        tx.recentBlockhash = blockhash;
        tx.add(ix);
        const signature = await sendSolTransaction(tx, connection);
        console.log('Solana Payment sent:', signature);
        window.location.reload();
      }
    } catch (e: unknown) {
      console.error(e);
      setError(t('pay_page.process_failed'));
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-pk-bg flex items-center justify-center p-6 text-white overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-pk-brand rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-900 rounded-full blur-[100px]" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="animate-spin h-10 w-10 text-pk-brand mb-4" />
            <p className="text-pk-text-secondary">{t('pay_page.loading')}</p>
          </div>
        ) : error ? (
          <div className="pk-card p-8 text-center">
            <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-2xl flex items-center justify-center mb-6">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">{t('pay_page.error_title')}</h2>
            <p className="text-pk-text-secondary">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-6 w-full px-6 py-3">
              Retry Load
            </Button>
          </div>
        ) : (
          paymentRequest && (
            <div className="space-y-6">
              <div className="pk-card overflow-hidden">
                {/* Header Section */}
                <div className="p-8 text-center bg-white/5 border-b border-white/5">
                  <div className="flex items-center justify-center gap-2 text-pk-text-secondary text-sm mb-4 bg-white/5 w-fit mx-auto px-4 py-1.5 rounded-full border border-white/5">
                    <Clock className="w-4 h-4 text-pk-brand" />
                    <span className="font-mono">{formatTimeLeft(timeLeft)}</span>
                  </div>
                  <div className="text-4xl font-extrabold text-white tracking-tight mb-1">
                    {formatAmount(paymentRequest.amount, paymentRequest.decimals)}
                  </div>
                  <div className="text-pk-text-secondary font-medium tracking-wide uppercase text-xs">
                    {getChainName(paymentRequest.chainId)}
                  </div>
                </div>

                {/* Method Selector */}
                <div className="p-8">
                  <MethodSelector activeMethod={activeMethod} onChange={setActiveMethod} />
                  
                  <div className="mt-8 transition-all duration-500 transform">
                    {activeMethod === 'dompetku' && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <QRDisplay value={`paymentkita://pay/${requestId}`} />
                        <div className="text-center">
                          <p className="text-sm text-pk-text-secondary">
                            Scan with DompetKu app for instant confirmation.
                          </p>
                        </div>
                      </div>
                    )}

                    {activeMethod === 'wallet' && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                           <h3 className="text-sm font-semibold text-white mb-4">Direct Wallet Payment</h3>
                           <ol className="space-y-4 text-sm text-pk-text-secondary">
                             <li className="flex gap-3 items-center">
                               <div className="w-6 h-6 rounded-full bg-pk-brand/20 text-pk-brand flex items-center justify-center text-xs font-bold">1</div>
                               Connect your {needsEvm ? 'EVM' : 'Solana'} wallet
                             </li>
                             <li className="flex gap-3 items-center">
                               <div className="w-6 h-6 rounded-full bg-pk-brand/20 text-pk-brand flex items-center justify-center text-xs font-bold">2</div>
                               Approve the transaction
                             </li>
                           </ol>
                        </div>
                        
                        <Button
                          onClick={handlePay}
                          disabled={isPaying || timeLeft <= 0 || !isWalletReady}
                          loading={isPaying}
                          className="pk-button-primary w-full py-6 text-lg font-extrabold"
                        >
                          {isPaying ? t('pay_page.processing') : t('pay_page.pay_now')}
                        </Button>
                        
                        {!isWalletReady && (
                          <WalletConnectButton size="lg" className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl py-6" connectLabel={t('common.connect')} />
                        )}
                      </div>
                    )}

                    {activeMethod === 'manual' && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <div className="bg-white/5 rounded-2xl p-6 border border-white/5 space-y-6">
                          <div>
                            <label className="text-[10px] font-bold text-pk-text-secondary uppercase tracking-widest mb-2 block">Destination Token Address</label>
                            <div className="flex items-center gap-3">
                              <code className="text-pk-brand text-xs font-mono flex-1 truncate bg-black/20 p-2 rounded">
                                {paymentRequest.contractAddress}
                              </code>
                              <button onClick={() => navigator.clipboard.writeText(paymentRequest.contractAddress)} className="p-2 text-pk-text-secondary hover:text-white transition-colors">
                                <Copy className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          
                          <div>
                            <label className="text-[10px] font-bold text-pk-text-secondary uppercase tracking-widest mb-2 block">Hex Data</label>
                            <div className="relative">
                              <pre className="text-[10px] text-gray-300 bg-black/30 rounded-xl p-4 overflow-x-auto max-h-32 font-mono scrollbar-hide border border-white/5">
                                {paymentRequest.txData.hex || paymentRequest.txData.base58 || paymentRequest.txData.base64}
                              </pre>
                              <button
                                onClick={copyTxData}
                                className="absolute top-2 right-2 p-2 bg-pk-brand/20 hover:bg-pk-brand/40 text-pk-brand rounded-lg transition-all"
                              >
                                {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 text-center border-t border-white/5 bg-black/20">
                  <p className="text-[10px] text-pk-text-secondary font-bold tracking-widest uppercase">Powered by PaymentKita Gateway</p>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

function decodeOnchainPaymentRequest(data: Uint8Array): { receiver: PublicKey; tokenMint: PublicKey } {
  // Anchor account layout:
  // 0..7 discriminator
  // 8..39 merchant
  // 40..71 receiver
  // 72..103 token mint
  if (data.length < 104) {
    throw new Error('Invalid payment request account data');
  }
  const receiver = new PublicKey(data.slice(40, 72));
  const tokenMint = new PublicKey(data.slice(72, 104));
  return { receiver, tokenMint };
}

function deriveAssociatedTokenAddress(owner: PublicKey, mint: PublicKey): PublicKey {
  const [ata] = PublicKey.findProgramAddressSync(
    [owner.toBytes(), TOKEN_PROGRAM_ID.toBytes(), mint.toBytes()],
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  return ata;
}

function utf8(value: string): Uint8Array {
  return new TextEncoder().encode(value);
}

function uuidToBytes32(value: string): Uint8Array {
  const hex = value.replace(/-/g, '');
  if (hex.length !== 32) throw new Error('invalid uuid');
  const out = new Uint8Array(32);
  for (let i = 0; i < 16; i += 1) {
    out[16 + i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

const decodeBase58 = (input: string): Uint8Array => {
  const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  const base = BigInt(58);
  let value = BigInt(0);

  for (const c of input) {
    const idx = alphabet.indexOf(c);
    if (idx < 0) throw new Error('invalid base58');
    value = value * base + BigInt(idx);
  }

  const out: number[] = [];
  while (value > 0) {
    out.push(Number(value % BigInt(256)));
    value /= BigInt(256);
  }
  out.reverse();

  let leading = 0;
  while (leading < input.length && input[leading] === '1') {
    leading += 1;
  }
  return new Uint8Array([...new Array(leading).fill(0), ...out]);
};
