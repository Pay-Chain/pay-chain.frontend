'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuthStore, useWalletStore, usePaymentStore } from '@/presentation/hooks';
import { useWalletsQuery, useAdminStats } from '@/data/usecase';
import type { Payment } from '@/data/model/entity';

export function useDashboard() {
  const { user } = useAuthStore();
  const { primaryWallet: wallet, syncWithServer } = useWalletStore();
  const { payments, loading: paymentsLoading } = usePaymentStore(1, 5);
  /*
  const [stats, setStats] = useState({
    totalPayments: 0,
    totalVolume: 0,
    activeWallets: 0,
    pendingPayments: 0,
  });
  */

  const { data: walletsData } = useWalletsQuery();
  const { data: adminStats } = useAdminStats();

  useEffect(() => {
    if (walletsData?.wallets) {
      syncWithServer(walletsData.wallets);
    }
  }, [walletsData, syncWithServer]);

  // Derived state using useMemo instead of useEffect+useState
  const stats = useMemo(() => {
    if (!payments) {
      return {
        totalPayments: 0,
        totalVolume: 0,
        activeWallets: 0,
        pendingPayments: 0,
      };
    }

    return {
      totalPayments: payments.length,
      totalVolume: adminStats ? parseFloat(adminStats.totalVolume || '0') : 0,
      pendingPayments: payments.filter(
        (p: Payment) => p.status === 'pending' || p.status === 'processing'
      ).length,
      activeWallets: walletsData?.wallets?.length ?? 0,
    };
  }, [payments, adminStats, walletsData]);



  return {
    user,
    wallet,
    payments,
    stats,
    isLoading: paymentsLoading,
  };
}
