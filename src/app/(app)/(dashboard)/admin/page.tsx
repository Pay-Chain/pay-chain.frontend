'use client';

import { useAdminStats } from '@/data/usecase/useAdmin';
import { Card } from '@/presentation/components/atoms';
import { useTranslation } from '@/presentation/hooks';
import { Users, Store, Activity, DollarSign } from 'lucide-react';

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading) {
    return <div className="p-8 text-center text-muted">{t('admin_dashboard_view.loading')}</div>;
  }

  const statCards = [
    {
      label: t('admin_dashboard_view.cards.total_users'),
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-blue-400',
    },
    {
      label: t('admin_dashboard_view.cards.total_merchants'),
      value: stats?.totalMerchants || 0,
      icon: Store,
      color: 'text-purple-400',
    },
    {
      label: t('admin_dashboard_view.cards.total_volume'),
      value: stats?.totalVolume || '$0',
      icon: DollarSign,
      color: 'text-green-400',
    },
    {
      label: t('admin_dashboard_view.cards.active_chains'),
      value: stats?.activeChains || 0,
      icon: Activity,
      color: 'text-orange-400',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('admin_dashboard_view.title')}</h1>
        <p className="text-muted">{t('admin_dashboard_view.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6 bg-white/5 border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
