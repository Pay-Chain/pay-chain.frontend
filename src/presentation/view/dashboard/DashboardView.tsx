'use client';

import Link from 'next/link';
import { useDashboard } from './useDashboard';
import { formatCurrency, shortenAddress } from '@/core/utils';
import { Button } from '@/presentation/components/atoms';
import TransactionList from '@/presentation/components/organisms/TransactionList';
import { Plus, Wallet, RefreshCcw, ExternalLink } from 'lucide-react';
import { useTranslation } from '@/presentation/hooks';

export function DashboardView() {
  const { user, wallet, payments, stats } = useDashboard();
  const { t } = useTranslation();
  const firstName = user?.name ? user.name.split(' ')[0] : '';

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {t('dashboard.welcome')}{firstName ? `, ${firstName}` : ''}! 👋
          </h1>
          <p className="text-white/50 mt-2">{t('dashboard.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3 mt-6 md:mt-0">
          {wallet && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-white/70 font-mono text-sm">{shortenAddress(wallet.address)}</span>
            </div>
          )}
          <Link href="/payments/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {t('common.new')} {t('common.payments')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
          <p className="text-white/40 text-sm mb-2">{t('dashboard.stats.total_payments')}</p>
          <p className="text-3xl font-bold text-white">{stats.totalPayments}</p>
        </div>
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
          <p className="text-white/40 text-sm mb-2">{t('dashboard.stats.total_volume')}</p>
          <p className="text-3xl font-bold text-white">{formatCurrency(stats.totalVolume)}</p>
        </div>
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
          <p className="text-white/40 text-sm mb-2">{t('dashboard.stats.active_wallets')}</p>
          <p className="text-3xl font-bold text-white">{stats.activeWallets}</p>
        </div>
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
          <p className="text-white/40 text-sm mb-2">{t('dashboard.stats.pending')}</p>
          <p className="text-3xl font-bold text-amber-400">{stats.pendingPayments}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">{t('dashboard.quick_actions.title')}</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/payments/new"
            className="group p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-center md:text-left flex flex-col items-center md:items-start"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
              <Plus className="w-6 h-6 text-blue-400" />
            </div>
            <p className="text-white font-medium mb-1">{t('dashboard.quick_actions.create_payment.title')}</p>
            <p className="text-white/40 text-sm">{t('dashboard.quick_actions.create_payment.subtitle')}</p>
          </Link>

          <Link
            href="/wallets"
            className="group p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-center md:text-left flex flex-col items-center md:items-start"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
              <Wallet className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-white font-medium mb-1">{t('dashboard.quick_actions.manage_wallets.title')}</p>
            <p className="text-white/40 text-sm">{t('dashboard.quick_actions.manage_wallets.subtitle')}</p>
          </Link>

          <Link
            href="/payments"
            className="group p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-center md:text-left flex flex-col items-center md:items-start"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
              <RefreshCcw className="w-6 h-6 text-emerald-400" />
            </div>
            <p className="text-white font-medium mb-1">{t('dashboard.quick_actions.history.title')}</p>
            <p className="text-white/40 text-sm">{t('dashboard.quick_actions.history.subtitle')}</p>
          </Link>

          <Link
            href="/settings"
            className="group p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-center md:text-left flex flex-col items-center md:items-start"
          >
            <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
              <ExternalLink className="w-6 h-6 text-pink-400" />
            </div>
            <p className="text-white font-medium mb-1">{t('dashboard.quick_actions.settings.title')}</p>
            <p className="text-white/40 text-sm">{t('dashboard.quick_actions.settings.subtitle')}</p>
          </Link>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
        <TransactionList payments={payments} />
      </div>
    </div>
  );
}
