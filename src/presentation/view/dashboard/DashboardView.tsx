'use client';

import Link from 'next/link';
import { useDashboard } from './useDashboard';
import { formatCurrency, shortenAddress } from '@/core/utils';
import { Button, Card } from '@/presentation/components/atoms';
import TransactionList from '@/presentation/components/organisms/TransactionList';
import { Plus, Wallet, RefreshCcw, Settings, TrendingUp, Clock, CreditCard, ArrowUpRight } from 'lucide-react';
import { useTranslation } from '@/presentation/hooks';

export function DashboardView() {
  const { user, wallet, payments, stats } = useDashboard();
  const { t } = useTranslation();
  const firstName = user?.name ? user.name.split(' ')[0] : '';

  const statCards = [
    {
      label: t('dashboard.stats.total_payments'),
      value: stats.totalPayments,
      icon: CreditCard,
      color: 'purple',
      delay: 0,
    },
    {
      label: t('dashboard.stats.total_volume'),
      value: formatCurrency(stats.totalVolume),
      icon: TrendingUp,
      color: 'green',
      delay: 50,
    },
    {
      label: t('dashboard.stats.active_wallets'),
      value: stats.activeWallets,
      icon: Wallet,
      color: 'blue',
      delay: 100,
    },
    {
      label: t('dashboard.stats.pending'),
      value: stats.pendingPayments,
      icon: Clock,
      color: 'amber',
      delay: 150,
    },
  ];

  const getColorStyles = (color: string) => {
    const colors: Record<string, { bg: string; icon: string; glow: string }> = {
      purple: { bg: 'bg-accent-purple/10', icon: 'text-accent-purple', glow: 'group-hover:shadow-glow-purple' },
      green: { bg: 'bg-accent-green/10', icon: 'text-accent-green', glow: 'group-hover:shadow-glow-green' },
      blue: { bg: 'bg-accent-blue/10', icon: 'text-accent-blue', glow: 'group-hover:shadow-glow-blue' },
      amber: { bg: 'bg-amber-500/10', icon: 'text-amber-400', glow: '' },
    };
    return colors[color] || colors.purple;
  };

  const quickActions = [
    {
      href: '/payments/new',
      icon: Plus,
      color: 'purple',
      title: t('dashboard.quick_actions.create_payment.title'),
      subtitle: t('dashboard.quick_actions.create_payment.subtitle'),
    },
    {
      href: '/wallets',
      icon: Wallet,
      color: 'green',
      title: t('dashboard.quick_actions.manage_wallets.title'),
      subtitle: t('dashboard.quick_actions.manage_wallets.subtitle'),
    },
    {
      href: '/payments',
      icon: RefreshCcw,
      color: 'blue',
      title: t('dashboard.quick_actions.history.title'),
      subtitle: t('dashboard.quick_actions.history.subtitle'),
    },
    {
      href: '/settings',
      icon: Settings,
      color: 'amber',
      title: t('dashboard.quick_actions.settings.title'),
      subtitle: t('dashboard.quick_actions.settings.subtitle'),
    },
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="animate-fade-in-up">
          <h1 className="heading-1 text-foreground">
            {t('dashboard.welcome')}{firstName ? `, ${firstName}` : ''}! 👋
          </h1>
          <p className="body-lg mt-2">{t('dashboard.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3 mt-6 md:mt-0 animate-slide-in-right">
          {wallet && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface border border-white/10 group hover:border-accent-green/30 transition-all duration-300">
              <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
              <span className="text-muted font-mono text-sm group-hover:text-foreground transition-colors">
                {shortenAddress(wallet.address)}
              </span>
            </div>
          )}
          <Link href="/payments/new">
            <Button variant="primary" glow>
              <Plus className="w-4 h-4" />
              {t('common.new')} {t('common.payments')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statCards.map((stat, index) => {
          const colorStyles = getColorStyles(stat.color);
          const IconComponent = stat.icon;
          return (
            <Card
              key={stat.label}
              variant="glass"
              size="md"
              hoverable
              className={colorStyles.glow}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${colorStyles.bg} flex items-center justify-center transition-transform duration-300`}>
                  <IconComponent className={`w-6 h-6 ${colorStyles.icon}`} />
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted opacity-50" />
              </div>
              <p className="label mb-1">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color === 'amber' ? 'text-amber-400' : 'text-foreground'}`}>
                {stat.value}
              </p>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="heading-3 text-foreground mb-4">{t('dashboard.quick_actions.title')}</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const colorStyles = getColorStyles(action.color);
            const IconComponent = action.icon;
            return (
              <Link key={action.href} href={action.href}>
                <Card
                  variant="glass"
                  size="md"
                  hoverable
                  className={`h-full text-center md:text-left flex flex-col items-center md:items-start ${colorStyles.glow}`}
                >
                  <div className={`w-14 h-14 rounded-xl ${colorStyles.bg} border border-white/5 flex items-center justify-center mb-4 transition-all duration-300`}>
                    <IconComponent className={`w-7 h-7 ${colorStyles.icon}`} />
                  </div>
                  <p className="text-foreground font-medium mb-1">{action.title}</p>
                  <p className="text-muted text-sm">{action.subtitle}</p>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Transactions */}
      <Card variant="glass" size="lg">
        <TransactionList payments={payments} />
      </Card>
    </div>
  );
}
