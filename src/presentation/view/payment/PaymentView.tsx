'use client';

import { useParams } from 'next/navigation';
import { Button, Card, Badge } from '@/presentation/components/atoms';
import { WalletConnectButton } from '@/presentation/components/molecules';
import { AlertCircle, Clock, ShieldCheck } from 'lucide-react';
import { QRDisplay } from '@/presentation/components/organisms/checkout/QRDisplay';
import { usePayment } from './usePayment';
import { cn } from '@/core/utils/cn';

const shortenMiddle = (value: string, edge = 8) => {
  if (!value) return '';
  if (value.length <= edge * 2) return value;
  return `${value.slice(0, edge)}...${value.slice(-edge)}`;
};

function ShimmerPaymentSkeleton() {
  return (
    <div className="rounded-[3.5rem] border border-white/10 bg-white/5 backdrop-blur-3xl p-10 space-y-8 overflow-hidden relative">
      <div
        className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/15 to-transparent"
        style={{ animation: 'payShimmer 1.8s infinite' }}
      />
      <style jsx>{`
        @keyframes payShimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
      <div className="h-14 w-52 mx-auto rounded-full bg-white/10" />
      <div className="h-16 w-72 mx-auto rounded-3xl bg-white/10" />
      <div className="h-9 w-64 mx-auto rounded-full bg-white/10" />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-72 rounded-3xl bg-white/10" />
        <div className="space-y-4">
          <div className="h-24 rounded-3xl bg-white/10" />
          <div className="h-14 rounded-2xl bg-white/10" />
          <div className="h-14 rounded-2xl bg-white/10" />
        </div>
      </div>
    </div>
  );
}

export function PaymentView() {
  const params = useParams();
  const requestId = params.id as string;
  const {
    paymentRequest,
    isLoading,
    error,
    isCompleted,
    isTerminal,
    timeLeft,
    isPaying,
    isWalletReady,
    handlePay,
    formatTimeLeft,
    formatAmount,
    getChainName,
    paymentTokenSymbol,
    t
  } = usePayment(requestId);

  const statusVariant = isCompleted
    ? 'success'
    : paymentRequest?.status === 'EXPIRED'
      ? 'warning'
      : paymentRequest?.status === 'FAILED' || paymentRequest?.status === 'CANCELLED'
        ? 'destructive'
        : 'secondary';
  const statusLabel = isCompleted
    ? t('pay_page.order_confirmed', 'Order Confirmed')
    : paymentRequest?.status === 'EXPIRED'
      ? t('pay_page.order_expired', 'Order Expired')
      : t('pay_page.order_pending', 'Order Confirmation Pending');
  const qrValue = paymentRequest?.payment_code?.trim() || '';

  return (
    <div className="min-h-screen bg-pk-bg flex items-center justify-center p-6 text-white overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent-blue/20 rounded-full blur-[100px]" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-6xl relative z-10">
        {isLoading ? (
          <ShimmerPaymentSkeleton />
        ) : error && !paymentRequest ? (
          <Card variant="glass" className="p-12 text-center rounded-[3rem] border-destructive/20 bg-destructive/5 animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 mx-auto bg-destructive/10 rounded-3xl flex items-center justify-center mb-8">
              <AlertCircle className="w-10 h-10 text-destructive" />
            </div>
            <h2 className="text-2xl font-black text-white mb-4 tracking-tight">{t('pay_page.error_title')}</h2>
            <p className="text-white/40 font-medium leading-relaxed">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()} className="mt-10 w-full h-14 rounded-2xl border-white/10 font-bold hover:bg-white/5 transition-all">
              {t('common.retry', 'Try again')}
            </Button>
          </Card>
        ) : (
          paymentRequest && (
            <div className="space-y-8 animate-fade-in">
              <Card variant="glass" className="p-0 overflow-hidden rounded-[3.5rem] shadow-2xl border-white/5 bg-white/5 backdrop-blur-3xl group">
                {/* Header Section */}
                <div className="p-10 text-center bg-white/5 border-b border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />
                  
                  <div className="flex items-center justify-center gap-3 text-white/50 text-xs mb-6 bg-white/5 w-fit mx-auto px-5 py-2 rounded-full border border-white/10 backdrop-blur-md relative z-10 group-hover:bg-primary/10 transition-colors">
                    <Clock className={cn("w-4 h-4 transition-colors", timeLeft < 60 ? "text-destructive animate-pulse" : "text-primary")} />
                    <span className="font-black tracking-widest uppercase">{t('pay_page.expires_in', 'Expires in')} {formatTimeLeft(timeLeft)}</span>
                  </div>

                  <div className="relative z-10 space-y-2">
                    <div className="flex items-baseline justify-center gap-3 text-5xl font-black text-white tracking-tighter mb-1">
                      {formatAmount(paymentRequest.amount, paymentRequest.amount_decimals)}
                      <span className="text-lg text-primary tracking-widest uppercase">
                        {paymentTokenSymbol}
                      </span>
                    </div>
                    <div className="text-primary font-black tracking-[0.3em] uppercase text-[10px] flex items-center justify-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      {getChainName(paymentRequest.dest_chain)} {t('pay_page.network_label', 'Network')}
                    </div>
                    <div className="flex justify-center">
                      <Badge variant={statusVariant} className="mt-3 px-4 py-1.5 text-[10px] tracking-wider uppercase">
                        {statusLabel}
                      </Badge>
                    </div>
                    <p className="text-xs text-white/50">
                      {t('pay_page.destination_label', 'Destination')} {shortenMiddle(paymentRequest.dest_wallet)}
                    </p>
                  </div>
                </div>

                <div className="p-6 md:p-10">
                  <div className="grid gap-6 md:grid-cols-[minmax(300px,1fr)_minmax(360px,1.15fr)] md:items-stretch">
                    <div className="rounded-[2.25rem] border border-white/10 bg-white/5 p-4 md:p-6">
                      <QRDisplay value={qrValue} label={t('pay_page.scan_to_pay', 'Scan to Pay')} />
                      <p className="mt-1 text-center text-sm text-white/45 font-medium">
                        {t('pay_page.scan_hint', 'Scan with the PaymentKita mobile app for instant confirmation.')}
                      </p>
                    </div>

                    <div className="rounded-[2.25rem] border border-white/10 bg-white/5 p-6 md:p-8 flex flex-col">
                      <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        {t('pay_page.wallet_checkout_title', 'Interactive Wallet Checkout')}
                      </h3>

                      <ol className="mt-5 space-y-4 text-sm font-medium text-white/55">
                        <li className="flex gap-3 items-start">
                          <span className="w-7 h-7 rounded-lg bg-primary/15 text-primary flex items-center justify-center text-[10px] font-black shrink-0">01</span>
                          <span>{t('pay_page.wallet_step_1', 'Connect your hardware or software wallet.')}</span>
                        </li>
                        <li className="flex gap-3 items-start">
                          <span className="w-7 h-7 rounded-lg bg-primary/15 text-primary flex items-center justify-center text-[10px] font-black shrink-0">02</span>
                          <span>{t('pay_page.wallet_step_2', 'Verify and sign the intent on-chain.')}</span>
                        </li>
                        <li className="flex gap-3 items-start">
                          <span className="w-7 h-7 rounded-lg bg-primary/15 text-primary flex items-center justify-center text-[10px] font-black shrink-0">03</span>
                          <span className="text-white/70">{t('pay_page.checkout_or_pay', 'Checkout / Pay')} ({paymentRequest.dest_chain})</span>
                        </li>
                      </ol>

                      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
                          <p className="text-[10px] uppercase tracking-widest text-white/35">{t('pay_page.network_label', 'Network')}</p>
                          <p className="mt-1 text-sm font-black text-white">{getChainName(paymentRequest.dest_chain)}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
                          <p className="text-[10px] uppercase tracking-widest text-white/35">{t('payments.token', 'Token')}</p>
                          <p className="mt-1 text-sm font-black text-white">{paymentTokenSymbol}</p>
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-2 gap-3">
                        <WalletConnectButton
                          size="lg"
                          className="w-full h-14 rounded-2xl"
                          connectLabel={t('common.connect')}
                        />
                        <Button
                          onClick={handlePay}
                          disabled={!isWalletReady || isPaying || timeLeft <= 0 || isTerminal}
                          loading={isPaying}
                          className="w-full h-14 rounded-2xl font-black text-sm md:text-base"
                        >
                          {isCompleted ? t('pay_page.completed', 'Payment Completed') : isPaying ? t('pay_page.processing') : t('pay_page.checkout_or_pay', 'Checkout / Pay')}
                        </Button>
                      </div>

                      {!isWalletReady && !isTerminal && (
                        <p className="mt-3 text-xs text-white/45 text-center">
                          {t('payments.connect_wallet_notice')}
                        </p>
                      )}
                      {error && (
                        <p className="mt-3 text-sm text-destructive text-center font-medium">
                          {error}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 text-center border-t border-white/5 bg-black/40">
                  <div className="flex items-center justify-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-accent-green opacity-40" />
                    <p className="text-[9px] text-white/20 font-black tracking-[0.4em] uppercase">
                      {isCompleted ? t('pay_page.payment_confirmed', 'Payment confirmed on-chain') : t('pay_page.security_notice', 'Secured by institutional vault architecture')}
                    </p>
                  </div>
                </div>
              </Card>

              <div className="flex items-center justify-center gap-6 opacity-30">
                 <div className="h-px bg-white/20 flex-1" />
                 <span className="text-[10px] font-bold text-white uppercase tracking-widest whitespace-nowrap">
                   {statusLabel}
                 </span>
                 <div className="h-px bg-white/20 flex-1" />
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
