'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAccount, useSwitchChain, useSendTransaction, useChainId } from 'wagmi';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Transaction, VersionedTransaction } from '@solana/web3.js';
import { Button } from '@/presentation/components/atoms';
import { Loader2, Copy, Check, AlertCircle, Clock } from 'lucide-react';
import { useAppKit } from '@reown/appkit/react';
import { httpClient } from '@/core/network';
import { useTranslation } from '@/presentation/hooks';

// Extended PaymentRequest for this page (server response includes txData)
interface PaymentRequestResponse {
  id: string;
  merchantId: string;
  walletId: string;
  chainId: string;
  tokenAddress: string;
  contractAddress: string;
  amount: string;
  decimals: number;
  description?: string;
  status: 'pending' | 'completed' | 'expired' | 'cancelled';
  expiresAt: string;
  txHash?: string;
  txData: {
    hex?: string;
    base64?: string;
    to?: string;
  };
  createdAt: string;
  updatedAt: string;
}

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
  const { open: openAppKit } = useAppKit();

  // Solana Hooks
  const { connection } = useConnection();
  const { publicKey, sendTransaction: sendSolTransaction, signTransaction } = useWallet();

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
      const result = await httpClient.get<PaymentRequestResponse>(`/payment-requests/${requestId}`);
      if (result.error) {
        setError(result.error || 'Failed to load payment request');
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
      'eip155:1': 'Ethereum',
      'eip155:137': 'Polygon',
      'eip155:42161': 'Arbitrum',
      'eip155:8453': 'Base',
      'eip155:84532': 'Base Sepolia',
      'solana:mainnet-beta': 'Solana',
      'solana:devnet': 'Solana Devnet',
    };
    return chainMap[chainId] || chainId;
  };

  const copyTxData = () => {
    if (!paymentRequest) return;
    const data = paymentRequest.txData.hex || paymentRequest.txData.base64 || '';
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
          await openAppKit();
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
        if (!publicKey || !signTransaction) {
          setError(t('pay_page.connect_solana'));
          setIsPaying(false);
          return;
        }

        if (paymentRequest.txData.base64) {
          const txBuffer = Buffer.from(paymentRequest.txData.base64, 'base64');
          try {
            const transaction = VersionedTransaction.deserialize(txBuffer);
            const signature = await sendSolTransaction(transaction, connection);
            console.log('Solana Payment sent:', signature);
            window.location.reload();
          } catch (e) {
            // Fallback for legacy
            const transaction = Transaction.from(txBuffer);
            const signature = await sendSolTransaction(transaction, connection);
            console.log('Solana Payment sent:', signature);
            window.location.reload();
          }
        }
      }
    } catch (e: unknown) {
      console.error(e);
      const message = e instanceof Error ? e.message : 'Failed to process payment';
      setError(message);
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-6 text-white">
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
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-center">
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
                    {t('pay_page.transaction_data')} ({paymentRequest.txData.hex ? 'Hex' : 'Base64'})
                  </h3>
                  <div className="relative">
                    <pre className="text-xs text-gray-300 bg-gray-900 rounded p-3 overflow-x-auto max-h-32 font-mono scrollbar-thin">
                      {paymentRequest.txData.hex || paymentRequest.txData.base64}
                    </pre>
                    <button
                      onClick={copyTxData}
                      className="absolute top-2 right-2 px-2 py-1 bg-gray-700 hover:bg-gray-600 text-xs text-white rounded transition-colors flex items-center gap-1"
                    >
                      {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {isCopied ? t('payment_requests.copied') : 'Copy'}
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
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-medium">
                      1
                    </span>
                    <span>
                      {t('pay_page.step_1')}{' '}
                      <strong className="text-white">{getChainName(paymentRequest.chainId)}</strong>
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-medium">
                      2
                    </span>
                    <span>{t('pay_page.step_2')}</span>
                  </li>
                </ol>

                <Button
                  onClick={handlePay}
                  disabled={isPaying || timeLeft <= 0}
                  loading={isPaying}
                  className="w-full mt-6 py-6 text-lg font-bold shadow-lg shadow-blue-500/20"
                >
                  {isPaying ? t('pay_page.processing') : t('pay_page.pay_now')}
                </Button>
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
