import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAccount, useSwitchChain, useSendTransaction } from 'wagmi';
import { useCreatePaymentAppMutation, useChainsQuery, useTokensQuery } from '@/data/usecase';
import type { CreatePaymentAppRequest } from '@/data/model/request';
import { parseUnits } from 'viem';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js';
import { signedProxyHttpClient } from '@/core/network';
import { ChainItemData } from '@/presentation/components/molecules/ChainListItem';
import { TokenItemData } from '@/presentation/components/molecules/TokenListItem';
import { useTranslation } from '@/presentation/hooks';

const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

export interface UseAppReturn {
  isConnected: boolean;
  address: string | undefined;
  chains: ChainItemData[];
  tokens: TokenItemData[];
  sourceChainId: string;
  setSourceChainId: (id: string) => void;
  destChainId: string;
  setDestChainId: (id: string) => void;
  amount: string;
  setAmount: (val: string) => void;
  tokenAddress: string;
  setTokenAddress: (addr: string) => void;
  receiver: string;
  setReceiver: (addr: string) => void;
  decimals: number;
  setDecimals: (d: number) => void;
  filteredTokens: TokenItemData[];
  selectedToken: TokenItemData | undefined;
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
  txHash: string | null;
  currentChain: any | undefined;
  handlePay: () => void;
}

export interface CreatePaymentAppParams {
  sourceChainId: string;
  destChainId: string;
  sourceTokenAddress: string;
  destTokenAddress: string;
  amount: string;
  decimals: number;
  receiverAddress: string;
}

export function useApp(): UseAppReturn {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const { address: evmAddress, isConnected: isEvmConnected, chainId } = useAccount();
  const { publicKey, sendTransaction: sendSolTransaction } = useWallet();
  const isSvmConnected = Boolean(publicKey);
  const isConnected = isEvmConnected || isSvmConnected;
  const address = isEvmConnected ? evmAddress : publicKey?.toBase58();
  
  const { data: chainsData } = useChainsQuery();
  const { data: tokensData } = useTokensQuery();
  const { switchChain } = useSwitchChain();
  const { sendTransactionAsync } = useSendTransaction();
  const createPaymentMutation = useCreatePaymentAppMutation();
  const { connection } = useConnection();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [sourceChainId, setSourceChainId] = useState('');
  const [destChainId, setDestChainId] = useState('');
  const [amount, setAmount] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');
  const [receiver, setReceiver] = useState('');
  const [decimals, setDecimals] = useState(18);
  const [initializedFromQuery, setInitializedFromQuery] = useState(false);

  // Derived Data
  const chainItems = useMemo<ChainItemData[]>(() => 
    (chainsData?.items || []).map((chain) => ({
      id: String(chain.id),
      networkId: String(chain.networkId || chain.id),
      name: chain.name,
      logoUrl: chain.logoUrl,
      chainType: chain.chainType,
      explorerUrl: chain.explorerUrl,
    })), [chainsData]);

  const tokenItems = useMemo<TokenItemData[]>(() => 
    ((tokensData?.items as any[]) || []).map((token: any) => ({
      id: token.id,
      symbol: token.symbol,
      name: token.name,
      logoUrl: token.logoUrl,
      address: token.contractAddress,
      isNative: token.isNative,
      chainId: String(token.chainId),
      decimals: token.decimals,
    })), [tokensData]);

  const filteredTokens = useMemo(() => 
    tokenItems.filter((token) => token.chainId === sourceChainId),
    [tokenItems, sourceChainId]
  );

  const selectedToken = useMemo(() => 
    filteredTokens.find(
      (token) =>
        token.address === tokenAddress ||
        (token.isNative && tokenAddress === '0x0000000000000000000000000000000000000000')
    ), [filteredTokens, tokenAddress]);

  const resolveChainSelectorId = (value: string) => {
    if (!value) return '';
    const found = (chainsData?.items || []).find((chain) =>
      String(chain.id) === value ||
      String(chain.networkId) === value ||
      chain.caip2 === value ||
      `${chain.namespace}:${chain.networkId}` === value
    );
    return found ? String(found.id) : '';
  };

  const caip2ToEvmChainId = (value: string): number => {
    if (!value) return NaN;
    if (value.startsWith('eip155:')) return Number(value.split(':')[1]);
    return Number(value);
  };

  // Initialization Logic
  useEffect(() => {
    if (!searchParams || initializedFromQuery || !chainsData?.items?.length) return;

    const amountParam = searchParams.get('amount') || '';
    const tokenParam = searchParams.get('tokenAddress') || '';
    const chainParam = searchParams.get('chainId') || '';
    const receiverParam = searchParams.get('receiver') || '';
    const decimalsParam = searchParams.get('decimals');

    const resolvedChainId = resolveChainSelectorId(chainParam);

    setAmount(amountParam);
    setTokenAddress(tokenParam);
    setReceiver(receiverParam);
    setSourceChainId(resolvedChainId);
    setDestChainId(resolvedChainId);

    if (decimalsParam) {
      const parsed = Number.parseInt(decimalsParam, 10);
      if (Number.isFinite(parsed)) setDecimals(parsed);
    }

    const apiKey = searchParams.get('apiKey');
    const secretKey = searchParams.get('secretKey');
    if (apiKey && secretKey) {
      signedProxyHttpClient.setCredentials(apiKey, secretKey);
    }

    setInitializedFromQuery(true);
  }, [searchParams, chainsData, initializedFromQuery]);

  useEffect(() => {
    if (selectedToken?.decimals) setDecimals(selectedToken.decimals);
  }, [selectedToken]);

  const handlePay = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!isEvmConnected || !evmAddress) {
        throw new Error(t('payments.connect_wallet_notice'));
      }

      if (!sourceChainId || !destChainId || !tokenAddress || !amount || !receiver) {
        throw new Error(t('app_view.complete_fields_error'));
      }

      const selectedSourceChain = (chainsData?.items || []).find((chain) => String(chain.id) === sourceChainId);
      const selectedDestChain = (chainsData?.items || []).find((chain) => String(chain.id) === destChainId);

      // 1. Create Payment Record on Backend
      const request: CreatePaymentAppRequest = {
        senderWalletAddress: isEvmConnected ? evmAddress! : publicKey!.toBase58(),
        sourceChainId: selectedSourceChain?.caip2 || sourceChainId,
        destChainId: selectedDestChain?.caip2 || destChainId,
        sourceTokenAddress: tokenAddress,
        destTokenAddress: tokenAddress,
        amount,
        decimals,
        receiverAddress: receiver,
      };
      
      const payment = await createPaymentMutation.mutateAsync(request);
      if (!payment) throw new Error(t('pay_page.process_failed'));

      const sourceChain = payment.sourceChainId || selectedSourceChain?.caip2 || '';
      if (!sourceChain) throw new Error(t('common.error'));

      if (sourceChain.startsWith('eip155:')) {
        if (!isEvmConnected || !evmAddress) throw new Error(t('payments.connect_wallet_notice'));
        const targetChainIdNum = caip2ToEvmChainId(sourceChain);
        if (chainId !== targetChainIdNum) {
          await switchChain({ chainId: targetChainIdNum });
        }
        const hash = await sendTransactionAsync({
          to: payment.signatureData?.to as `0x${string}`,
          data: payment.signatureData?.data as `0x${string}`,
          value: parseUnits('0', 0),
        });
        setTxHash(hash);
      } else if (sourceChain.startsWith('solana:')) {
        if (!publicKey || !sendSolTransaction) throw new Error(t('pay_page.connect_solana'));
        if (!payment.signatureData?.programId || !payment.signatureData?.data) {
          throw new Error(t('common.error'));
        }
        if (!tokenAddress || tokenAddress.startsWith('0x')) {
          throw new Error(t('common.error'));
        }

        const programId = new PublicKey(payment.signatureData.programId);
        const instructionData = decodeBase58(payment.signatureData.data);
        const paymentIdBytes32 = uuidToBytes32(payment.paymentId);
        const sourceMint = new PublicKey(tokenAddress);

        const [configPda] = PublicKey.findProgramAddressSync([utf8('config')], programId);
        const [paymentPda] = PublicKey.findProgramAddressSync([utf8('payment'), paymentIdBytes32], programId);
        const [vaultTokenPda] = PublicKey.findProgramAddressSync([utf8('vault'), configPda.toBytes()], programId);
        const senderTokenAccount = deriveAssociatedTokenAddress(publicKey, sourceMint);

        const ix = new TransactionInstruction({
          programId,
          keys: [
            { pubkey: publicKey, isSigner: true, isWritable: true },
            { pubkey: configPda, isSigner: false, isWritable: false },
            { pubkey: paymentPda, isSigner: false, isWritable: true },
            { pubkey: senderTokenAccount, isSigner: false, isWritable: true },
            { pubkey: vaultTokenPda, isSigner: false, isWritable: true },
            { pubkey: sourceMint, isSigner: false, isWritable: false },
            { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
          ],
          data: Buffer.from(instructionData),
        });

        const { blockhash } = await connection.getLatestBlockhash();
        const tx = new Transaction();
        tx.feePayer = publicKey;
        tx.recentBlockhash = blockhash;
        tx.add(ix);

        const sig = await sendSolTransaction(tx, connection);
        setTxHash(sig);
      } else {
        throw new Error(`Unsupported source chain: ${sourceChain}`);
      }
      setIsSuccess(true);

    } catch (e: any) {
      console.error(e);
      setError(t('pay_page.process_failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isConnected,
    address,
    chains: chainItems,
    tokens: tokenItems,
    sourceChainId,
    setSourceChainId,
    destChainId,
    setDestChainId,
    amount,
    setAmount,
    tokenAddress,
    setTokenAddress,
    receiver,
    setReceiver,
    decimals,
    setDecimals,
    filteredTokens,
    selectedToken,
    isLoading,
    isSuccess,
    error,
    txHash,
    currentChain: chainsData?.items?.find(c => String(c.networkId) === String(chainId) || c.id === chainId),
    handlePay,
  };
}

const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');

function deriveAssociatedTokenAddress(owner: PublicKey, mint: PublicKey): PublicKey {
  const [ata] = PublicKey.findProgramAddressSync(
    [owner.toBytes(), TOKEN_PROGRAM_ID.toBytes(), mint.toBytes()],
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  return ata;
}

function decodeBase58(input: string): Uint8Array {
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
  while (leading < input.length && input[leading] === '1') leading += 1;
  return new Uint8Array([...new Array(leading).fill(0), ...out]);
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
