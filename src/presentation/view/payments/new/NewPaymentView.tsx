'use client';

import { Button, Input } from '@/presentation/components/atoms';
import { useNewPayment } from './useNewPayment';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/presentation/hooks';

export function NewPaymentView() {
  const { formData, loading, error, handleChange, handleSubmit, primaryWallet } = useNewPayment();
  const { t } = useTranslation();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="p-2 -ml-2 rounded-lg hover:bg-white/5 transition-colors">
          <ArrowLeft className="w-5 h-5 text-white/50" />
        </Link>
        <h1 className="text-2xl font-bold text-white">{t('payments.new_payment')}</h1>
      </div>

      <div className="p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">{t('payments.details')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">{t('payments.source_chain')}</label>
                <Input
                  name="sourceChainId"
                  placeholder="e.g. 1 (Ethereum)"
                  value={formData.sourceChainId}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">{t('payments.dest_chain')}</label>
                <Input
                  name="destChainId"
                  placeholder="e.g. 137 (Polygon)"
                  value={formData.destChainId}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
               <label className="text-sm font-medium text-white/70">{t('payments.receiver')}</label>
               <Input
                 name="receiverAddress"
                 placeholder="0x..."
                 value={formData.receiverAddress}
                 onChange={handleChange}
                 required
               />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">{t('payments.amount')}</label>
                <Input
                  name="amount"
                  type="number"
                  placeholder="0.0"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">{t('payments.token_address')}</label>
                <Input
                  name="sourceTokenAddress"
                  placeholder="0x... (Leave empty for native)"
                  value={formData.sourceTokenAddress}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {!primaryWallet && (
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200 text-sm">
              {t('payments.connect_wallet_notice')}
            </div>
          )}

          {error && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="pt-4 flex justify-end gap-3">
            <Link href="/dashboard">
              <Button type="button" variant="ghost">{t('common.cancel')}</Button>
            </Link>
            <Button 
              type="submit" 
              loading={loading}
              disabled={!primaryWallet}
            >
              {t('payments.confirm')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
