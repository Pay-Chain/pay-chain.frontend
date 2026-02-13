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
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-6 text-white">
      <div className="w-full max-w-md">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="animate-spin h-10 w-10 text-blue-500 mb-4" />
            <p className="text-gray-400">{t('pay_page.loading')}</p>
          </div>
        ) : error ? (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 text-center">
            <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">{t('pay_page.error_title')}</h2>
            <p className="text-gray-400">{error}</p>
          </div>
        ) : (
          paymentRequest && (
            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="bg-linear-to-r from-blue-600 to-blue-500 p-6 text-center">
                <div className="flex items-center justify-center gap-2 text-white/80 text-sm mb-2">
                  <Clock className="w-4 h-4" />
                  {t('pay_page.expires_in')} {formatTimeLeft(timeLeft)}
                </div>
                <h1 className="text-3xl font-bold text-white">
                  {formatAmount(paymentRequest.amount, paymentRequest.decimals)}
                </h1>
                <p className="text-white/80 mt-1">{getChainName(paymentRequest.chainId)}</p>
              </div>

              {/* Details */}
              <div className="p-6 space-y-4">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
                    {t('pay_page.contract_address')}
                  </h3>
                  <div className="flex items-center gap-2">
                    <code className="text-blue-400 text-sm flex-1 truncate">
                      {paymentRequest.contractAddress}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(paymentRequest.contractAddress);
                      }}
                      className="p-1.5 text-gray-400 hover:text-white transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
                    {t('pay_page.transaction_data')} ({paymentRequest.txData.hex ? 'HEX' : paymentRequest.txData.base58 ? 'BASE58' : 'BASE64'})
                  </h3>
                  <div className="relative">
                    <pre className="text-xs text-gray-300 bg-gray-900 rounded p-3 overflow-x-auto max-h-32 font-mono scrollbar-thin">
                      {paymentRequest.txData.hex || paymentRequest.txData.base58 || paymentRequest.txData.base64}
                    </pre>
                    <button
                      onClick={copyTxData}
                      className="absolute top-2 right-2 px-2 py-1 bg-gray-700 hover:bg-gray-600 text-xs text-white rounded transition-colors flex items-center gap-1"
                    >
                      {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {isCopied ? t('pay_page.tx_data_copy_success') : t('pay_page.tx_data_copy')}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                      {t('pay_page.chain_id')}
                    </h3>
                    <p className="text-white font-medium truncate">{paymentRequest.chainId}</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                      {t('pay_page.decimals')}
                    </h3>
                    <p className="text-white font-medium">{paymentRequest.decimals}</p>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="border-t border-gray-800 p-6">
                <h3 className="font-medium text-white mb-3">{t('pay_page.how_to_pay')}</h3>
                <ol className="space-y-3 text-sm text-gray-400">
                  <li className="flex gap-3">
                    <span className="shrink-0 w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-medium">
                      1
                    </span>
                    <span>
                      {t('pay_page.step_1')}{' '}
                      <strong className="text-white">{getChainName(paymentRequest.chainId)}</strong>
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="shrink-0 w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-medium">
                      2
                    </span>
                    <span>{t('pay_page.step_2')}</span>
                  </li>
                </ol>

                <Button
                  onClick={handlePay}
                  disabled={isPaying || timeLeft <= 0 || !isWalletReady}
                  loading={isPaying}
                  className="w-full mt-6 py-6 text-lg font-bold shadow-lg shadow-blue-500/20"
                >
                  {isPaying ? t('pay_page.processing') : t('pay_page.pay_now')}
                </Button>
                {!isWalletReady && (
                  <div className="mt-3">
                    <WalletConnectButton size="default" className="w-full" connectLabel={t('common.connect')} />
                  </div>
                )}
              </div>

              <div className="border-t border-gray-800 p-4 text-center">
                <p className="text-xs text-gray-500">{t('pay_page.powered_by')}</p>
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
