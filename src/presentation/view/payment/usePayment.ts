'use client';

import { useEffect, useState } from 'react';
import { useAccount, useSwitchChain, useSendTransaction, useChainId, usePublicClient } from 'wagmi';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, TransactionInstruction, VersionedTransaction } from '@solana/web3.js';
import { useTranslation } from '@/presentation/hooks';
import { usePartnerPaymentSessionQuery, useTokensQuery } from '@/data/usecase';
import type { PartnerPaymentSessionResponse } from '@/data/model/response';

const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');

export function usePayment(requestId: string) {
  const { t } = useTranslation();

  const sessionQuery = usePartnerPaymentSessionQuery(requestId, !!requestId);
  const paymentRequest = normalizePaymentRequest(sessionQuery.data, requestId);
  const tokensQuery = useTokensQuery();
  const isLoading = sessionQuery.isLoading;
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  // EVM Hooks
  const { isConnected: isEvmConnected } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { sendTransactionAsync } = useSendTransaction();
  const currentChainId = useChainId();
  const publicClient = usePublicClient({ chainId: currentChainId });

  // Solana Hooks
  const { connection } = useConnection();
  const { publicKey, sendTransaction: sendSolTransaction } = useWallet();

  const needsEvm = paymentRequest?.dest_chain?.startsWith('eip155:') ?? false;
  const needsSvm = paymentRequest?.dest_chain?.startsWith('solana:') ?? false;
  const isWalletReady = needsEvm ? isEvmConnected : needsSvm ? Boolean(publicKey) : false;
  const isTerminal = paymentRequest?.status === 'COMPLETED' || paymentRequest?.status === 'EXPIRED' || paymentRequest?.status === 'CANCELLED' || paymentRequest?.status === 'FAILED';
  const isCompleted = paymentRequest?.status === 'COMPLETED';
  const paymentTokenSymbol = resolvePaymentTokenSymbol(paymentRequest, tokensQuery.data);

  useEffect(() => {
    if (sessionQuery.error) {
      setError(sessionQuery.error.message || t('pay_page.load_failed'));
      return;
    }
    if (sessionQuery.isLoading) {
      return;
    }
    if (!paymentRequest) {
      setError(t('pay_page.load_failed'));
      return;
    }
    if (paymentRequest.status === 'EXPIRED') {
      setError(t('pay_page.expired_error'));
      return;
    }
    if (paymentRequest.status === 'COMPLETED') {
      setError('');
      return;
    }
    setError('');
  }, [paymentRequest, sessionQuery.error, sessionQuery.isLoading, t]);

  useEffect(() => {
    if (!paymentRequest) return;

    const expiresAtRaw = paymentRequest.expires_at;
    const expiresAt = Number.isNaN(Date.parse(expiresAtRaw)) ? 0 : new Date(expiresAtRaw).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const left = Math.max(0, Math.floor((expiresAt - now) / 1000));
      setTimeLeft(left);

      if (left <= 0 && paymentRequest.status === 'PENDING') {
        setError(t('pay_page.expired_error'));
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [paymentRequest, t]);

  const formatTimeLeft = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds < 0) return '--:--';
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      const remMins = Math.floor((seconds % 3600) / 60);
      return `${hours.toString().padStart(2, '0')}:${remMins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatAmount = (amount: string, decimals: number) => {
    const amountNum = Number(amount);
    const decimalsNum = Number(decimals);
    if (!Number.isFinite(amountNum) || !Number.isFinite(decimalsNum) || decimalsNum < 0) {
      return '--';
    }
    const value = amountNum / Math.pow(10, decimalsNum);
    if (!Number.isFinite(value)) return '--';
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
    const instruction = paymentRequest.payment_instruction;
    const data = instruction?.data || instruction?.data_base58 || instruction?.data_base64 || '';
    navigator.clipboard.writeText(data);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handlePay = async () => {
    if (!paymentRequest) return;
    setError('');
    setIsPaying(true);

    try {
      const instruction = paymentRequest.payment_instruction;
      if (paymentRequest.dest_chain.startsWith('eip155:')) {
        // EVM Handling
        if (!isEvmConnected) {
          setError(t('payments.connect_wallet_notice'));
          setIsPaying(false);
          return;
        }

        const targetChainId = parseInt(paymentRequest.dest_chain.split(':')[1]);
        if (!Number.isFinite(targetChainId)) {
          throw new Error('Invalid destination chain');
        }
        if (currentChainId !== targetChainId) {
          await switchChainAsync({ chainId: targetChainId });
        }

        if (instruction?.approval_to && instruction?.approval_hex_data) {
          try {
            console.log('Sending Approval Transaction...');
            const approvalHash = await sendTransactionAsync({
              to: instruction.approval_to as `0x${string}`,
              data: instruction.approval_hex_data as `0x${string}`,
              value: BigInt(0),
            });
            console.log('Approval sent:', approvalHash);
            
            if (publicClient) {
              // Wait for receipt to ensure allowance is updated
              await publicClient.waitForTransactionReceipt({ hash: approvalHash });
              console.log('Approval confirmed');
            }
          } catch (approvalErr) {
            console.error('Approval failed:', approvalErr);
            throw approvalErr;
          }
        }

        if (instruction?.data && instruction?.to) {
          const hash = await sendTransactionAsync({
            to: instruction.to as `0x${string}`,
            data: instruction.data as `0x${string}`,
            value: BigInt(instruction.value || '0'),
          });
          console.log('EVM Payment sent:', hash);
          await sessionQuery.refetch();
          return;
        }
        throw new Error(t('pay_page.process_failed'));
      } else if (paymentRequest.dest_chain.startsWith('solana:')) {
        // Solana Handling
        if (!publicKey || !sendSolTransaction) {
          setError(t('pay_page.connect_solana'));
          setIsPaying(false);
          return;
        }

        const encoded = instruction?.data_base58 || instruction?.data_base64;
        if (!encoded) throw new Error(t('pay_page.process_failed'));

        // 1) Try legacy/full serialized transaction path first.
        try {
          const txBuffer = instruction?.data_base58
            ? Buffer.from(decodeBase58(encoded))
            : Buffer.from(encoded, 'base64');
          const versioned = VersionedTransaction.deserialize(txBuffer);
          const signature = await sendSolTransaction(versioned, connection);
          console.log('Solana Payment sent:', signature);
          await sessionQuery.refetch();
          return;
        } catch (_) {
          // Continue with instruction-data flow.
        }

        // 2) New path: backend sends Anchor instruction bytes (base58) and FE composes transaction.
        if (!instruction?.data_base58 || !instruction?.program_id) {
          throw new Error(t('pay_page.process_failed'));
        }
        const programId = new PublicKey(instruction.program_id);
        const instructionData = decodeBase58(instruction.data_base58);
        const requestIdBytes32 = uuidToBytes32(paymentRequest.payment_id);
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
        await sessionQuery.refetch();
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
    isCompleted,
    isTerminal,
    timeLeft,
    isCopied,
    isPaying,
    isWalletReady,
    needsEvm,
    needsSvm,
    handlePay,
    copyTxData,
    formatTimeLeft,
    formatAmount,
    getChainName,
    paymentTokenSymbol,
    t
  };
}

// Helpers
function normalizePaymentRequest(raw: unknown, requestId: string): PartnerPaymentSessionResponse | null {
  if (!raw || typeof raw !== 'object') return null;

  const candidate = raw as Record<string, unknown>;
  const legacyPayRaw = asRecord(candidate.legacy_pay_data);
  const legacyTxDataRaw = asRecord(candidate.txData) ?? asRecord(legacyPayRaw?.txData) ?? {};
  const paymentInstructionRaw =
    asRecord(candidate.payment_instruction)
    ?? asRecord(candidate.paymentInstruction)
    ?? asRecord(legacyPayRaw?.payment_instruction)
    ?? legacyTxDataRaw;
  const statusRaw = typeof candidate.status === 'string' ? candidate.status.toUpperCase() : 'PENDING';
  const status: PartnerPaymentSessionResponse['status'] =
    statusRaw === 'COMPLETED' || statusRaw === 'EXPIRED' || statusRaw === 'CANCELLED' || statusRaw === 'FAILED'
      ? statusRaw
      : 'PENDING';

  const rawAmount = stringifyFirst(
    candidate.quoted_token_amount_atomic,
    candidate.amount,
    candidate.quoted_token_amount,
    legacyPayRaw?.quoted_token_amount_atomic,
    legacyPayRaw?.amount,
    legacyPayRaw?.quoted_token_amount,
    '0'
  );
  const amount = normalizeAtomicCompatibleAmount(rawAmount);
  const amountDecimalsRaw = numberFirst(
    candidate.amount_decimals,
    candidate.quoted_token_decimals,
    legacyPayRaw?.amount_decimals,
    legacyPayRaw?.quoted_token_decimals,
    candidate.decimals,
    legacyPayRaw?.decimals,
    6
  );
  const amountDecimals = resolveAmountDecimals(rawAmount, amountDecimalsRaw);
  const destChain = stringifyFirst(
    candidate.payer_selected_chain,
    candidate.source_chain,
    candidate.sourceChain,
    paymentInstructionRaw.chain_id,
    candidate.dest_chain,
    candidate.destChain,
    candidate.chainId,
    legacyPayRaw?.payer_selected_chain,
    legacyPayRaw?.source_chain,
    legacyPayRaw?.sourceChain,
    asRecord(legacyPayRaw?.payment_instruction)?.chain_id,
    legacyPayRaw?.dest_chain,
    legacyPayRaw?.destChain,
    legacyPayRaw?.chainId,
    ''
  );
  const destToken = stringifyFirst(
    candidate.payer_selected_token,
    candidate.source_token,
    candidate.sourceToken,
    candidate.dest_token,
    candidate.destToken,
    candidate.contractAddress,
    legacyPayRaw?.payer_selected_token,
    legacyPayRaw?.source_token,
    legacyPayRaw?.sourceToken,
    legacyPayRaw?.dest_token,
    legacyPayRaw?.destToken,
    legacyPayRaw?.contractAddress,
    ''
  );
  const destWallet = stringifyFirst(
    candidate.dest_wallet,
    candidate.destWallet,
    candidate.settlement_dest_wallet,
    candidate.walletAddress,
    legacyPayRaw?.dest_wallet,
    legacyPayRaw?.destWallet,
    legacyPayRaw?.settlement_dest_wallet,
    legacyPayRaw?.walletAddress,
    ''
  );
  const expiresAt = stringifyFirst(
    candidate.expires_at,
    candidate.expiresAt,
    candidate.expire_time,
    candidate.quote_expires_at,
    legacyPayRaw?.expires_at,
    legacyPayRaw?.expiresAt,
    legacyPayRaw?.expire_time,
    legacyPayRaw?.quote_expires_at,
    new Date().toISOString()
  );
  const paymentId = stringifyFirst(candidate.payment_id, candidate.paymentId, candidate.requestId, legacyPayRaw?.payment_id, legacyPayRaw?.paymentId, legacyPayRaw?.requestId, requestId);
  const paymentUrl = stringifyFirst(candidate.payment_url, candidate.paymentUrl, legacyPayRaw?.payment_url, legacyPayRaw?.paymentUrl, '');
  const paymentCode = stringifyFirst(
    candidate.payment_code,
    candidate.paymentCode,
    paymentInstructionRaw.qr_data,
    paymentInstructionRaw.qrData,
    legacyPayRaw?.payment_code,
    legacyPayRaw?.paymentCode,
    ''
  );
  const paymentTokenSymbol = stringifyFirst(
    candidate.payment_token_symbol,
    candidate.paymentTokenSymbol,
    candidate.payer_selected_token_symbol,
    candidate.source_token_symbol,
    candidate.sourceTokenSymbol,
    candidate.quoted_token_symbol,
    candidate.bridge_token_symbol,
    candidate.tokenSymbol,
    legacyPayRaw?.payment_token_symbol,
    legacyPayRaw?.paymentTokenSymbol,
    legacyPayRaw?.payer_selected_token_symbol,
    legacyPayRaw?.source_token_symbol,
    legacyPayRaw?.sourceTokenSymbol,
    legacyPayRaw?.quoted_token_symbol,
    legacyPayRaw?.bridge_token_symbol,
    legacyPayRaw?.tokenSymbol,
    'TOKEN'
  );

  return {
    payment_id: paymentId,
    status,
    amount,
    amount_decimals: amountDecimals,
    payment_token_symbol: paymentTokenSymbol,
    dest_chain: destChain,
    dest_token: destToken,
    dest_wallet: destWallet,
    expires_at: expiresAt,
    payment_url: paymentUrl,
    payment_code: paymentCode,
    payment_instruction: {
      chain_id: stringifyFirst(paymentInstructionRaw.chain_id, destChain),
      to: optionalString(paymentInstructionRaw.to),
      value: optionalString(paymentInstructionRaw.value),
      data: optionalString(paymentInstructionRaw.data, paymentInstructionRaw.hex),
      program_id: optionalString(paymentInstructionRaw.program_id, paymentInstructionRaw.programId),
      data_base58: optionalString(paymentInstructionRaw.data_base58, paymentInstructionRaw.base58),
      data_base64: optionalString(paymentInstructionRaw.data_base64, paymentInstructionRaw.base64),
      approval_to: optionalString(paymentInstructionRaw.approval_to, paymentInstructionRaw.approvalTo),
      approval_hex_data: optionalString(paymentInstructionRaw.approval_hex_data, paymentInstructionRaw.approvalHexData),
    },
  };
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== 'object') return undefined;
  return value as Record<string, unknown>;
}

function stringifyFirst(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === 'string' && value.trim() !== '') return value;
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  }
  return '';
}

function numberFirst(...values: unknown[]): number {
  for (const value of values) {
    const parsed = typeof value === 'number' ? value : Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return 0;
}

function optionalString(...values: unknown[]): string | undefined {
  for (const value of values) {
    if (typeof value === 'string' && value.trim() !== '') return value;
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  }
  return undefined;
}

function normalizeAtomicCompatibleAmount(rawAmount: string): string {
  const trimmed = rawAmount.trim();
  if (!trimmed.includes('.')) return trimmed;

  const [whole, fraction = ''] = trimmed.split('.');
  if (/^0+$/.test(fraction)) return whole;
  return trimmed;
}

function resolveAmountDecimals(rawAmount: string, fallbackDecimals: number): number {
  const trimmed = rawAmount.trim();
  if (!trimmed.includes('.')) return fallbackDecimals;

  const [, fraction = ''] = trimmed.split('.');
  if (/^0+$/.test(fraction)) return fallbackDecimals;
  return 0;
}

function resolvePaymentTokenSymbol(paymentRequest: PartnerPaymentSessionResponse | null, tokensPayload: unknown): string {
  const direct = paymentRequest?.payment_token_symbol?.trim() || '';
  if (direct && direct.toUpperCase() !== 'TOKEN') return direct;

  const tokens = extractTokenItems(tokensPayload);
  const sourceTokenAddress = paymentRequest?.payment_instruction?.approval_to?.toLowerCase();
  if (sourceTokenAddress) {
    const sourceMatched = tokens.find((token) => token.contractAddress.toLowerCase() === sourceTokenAddress);
    if (sourceMatched?.symbol) return sourceMatched.symbol;
  }

  const destTokenAddress = paymentRequest?.dest_token?.toLowerCase();
  if (destTokenAddress) {
    const destMatched = tokens.find((token) => token.contractAddress.toLowerCase() === destTokenAddress);
    if (destMatched?.symbol) return destMatched.symbol;
  }

  return direct || 'TOKEN';
}

function extractTokenItems(payload: unknown): Array<{ contractAddress: string; symbol: string; decimals?: number }> {
  if (!payload || typeof payload !== 'object') return [];
  const items = (payload as { items?: unknown }).items;
  if (!Array.isArray(items)) return [];

  const out: Array<{ contractAddress: string; symbol: string; decimals?: number }> = [];
  for (const item of items) {
    if (!item || typeof item !== 'object') continue;
    const row = item as Record<string, unknown>;
    const contractAddress = typeof row.contractAddress === 'string' ? row.contractAddress : '';
    const symbol = typeof row.symbol === 'string' ? row.symbol : '';
    const decimals = typeof row.decimals === 'number' ? row.decimals : Number(row.decimals);
    if (!contractAddress || !symbol) continue;
    out.push({
      contractAddress,
      symbol,
      decimals: Number.isFinite(decimals) ? decimals : undefined,
    });
  }
  return out;
}

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
