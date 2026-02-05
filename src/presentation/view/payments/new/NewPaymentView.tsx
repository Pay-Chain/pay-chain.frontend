'use client';

import { Button, Input } from '@/presentation/components/atoms';
import { useNewPayment } from './useNewPayment';
import { ArrowLeft, Send, AlertTriangle, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/presentation/hooks';

export function NewPaymentView() {
  const { formData, loading, error, handleChange, handleSubmit, primaryWallet } = useNewPayment();
  const { t } = useTranslation();

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard" 
          className="p-2 -ml-2 rounded-full hover:bg-white/5 transition-all duration-300 group"
        >
          <ArrowLeft className="w-5 h-5 text-muted group-hover:text-foreground transition-colors" />
        </Link>
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-purple/10 border border-accent-purple/20 mb-2">
            <Send className="w-3 h-3 text-accent-purple" />
            <span className="text-xs text-accent-purple font-medium">New Transfer</span>
          </div>
          <h1 className="heading-2 text-foreground">{t('payments.new_payment')}</h1>
        </div>
      </div>

      {/* Form Card */}
      <div className="card-glass p-8 shadow-glass">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Payment Details Section */}
          <div className="space-y-6">
            <h2 className="heading-3 text-foreground flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent-purple/10 flex items-center justify-center">
                <span className="text-accent-purple text-sm font-bold">1</span>
              </div>
              {t('payments.details')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t('payments.source_chain')}
                name="sourceChainId"
                placeholder="e.g. 1 (Ethereum)"
                value={formData.sourceChainId}
                onChange={handleChange}
                required
              />
              <Input
                label={t('payments.dest_chain')}
                name="destChainId"
                placeholder="e.g. 137 (Polygon)"
                value={formData.destChainId}
                onChange={handleChange}
                required
              />
            </div>

            <Input
              label={t('payments.receiver')}
              name="receiverAddress"
              placeholder="0x..."
              value={formData.receiverAddress}
              onChange={handleChange}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t('payments.amount')}
                name="amount"
                type="number"
                placeholder="0.0"
                value={formData.amount}
                onChange={handleChange}
                required
              />
              <Input
                label={t('payments.token_address')}
                name="sourceTokenAddress"
                placeholder="0x... (Leave empty for native)"
                value={formData.sourceTokenAddress}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Notices */}
          {!primaryWallet && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 animate-fade-in">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <Wallet className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-amber-200 font-medium">{t('payments.connect_wallet_notice')}</p>
                <p className="text-amber-200/60 text-sm mt-1">Connect your wallet to continue with the payment.</p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 animate-fade-in">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-red-400 font-medium">Error</p>
                <p className="text-red-400/80 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
            <Link href="/dashboard">
              <Button type="button" variant="ghost">{t('common.cancel')}</Button>
            </Link>
            <Button 
              type="submit" 
              variant="primary"
              loading={loading}
              disabled={!primaryWallet}
              glow
            >
              <Send className="w-4 h-4" />
              {t('payments.confirm')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
