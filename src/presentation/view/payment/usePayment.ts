'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAccount, useSwitchChain, useSendTransaction, useChainId } from 'wagmi';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, TransactionInstruction, VersionedTransaction } from '@solana/web3.js';
import { httpClient } from '@/core/network';
import { useTranslation } from '@/presentation/hooks';
import type { MethodType } from '@/presentation/components/organisms/checkout/MethodSelector';

// Extended PaymentRequest for this page (server response includes txData)
export interface PaymentRequestResponse {
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

export function usePayment(requestId: string) {
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

  const loadPaymentRequest = useCallback(async () => {
    if (!requestId) return;
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
  }, [requestId, t]);

  useEffect(() => {
    loadPaymentRequest();
  }, [loadPaymentRequest]);

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

  return {
    paymentRequest,
    isLoading,
    error,
    timeLeft,
    isCopied,
    isPaying,
    activeMethod,
    setActiveMethod,
    isWalletReady,
    needsEvm,
    needsSvm,
    handlePay,
    copyTxData,
    formatTimeLeft,
    formatAmount,
    getChainName,
    t
  };
}

// Helpers
function decodeOnchainPaymentRequest(data: Uint8Array): { receiver: PublicKey; tokenMint: PublicKey } {
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
