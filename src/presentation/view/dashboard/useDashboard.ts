'use client';

import { useEffect, useState } from 'react';
import { useAuthStore, useWalletStore, usePaymentStore } from '@/presentation/hooks';
import { usePaymentsQuery, useWalletsQuery } from '@/data/usecase';
import type { Payment } from '@/data/model/entity';

export function useDashboard() {
  const { user } = useAuthStore();
  const { primaryWallet: wallet, syncWithServer } = useWalletStore();
  const { payments, setPayments, setLoading } = usePaymentStore();
  const [stats, setStats] = useState({
    totalPayments: 0,
    totalVolume: 0,
    activeWallets: 0,
    pendingPayments: 0,
  });

  const { data: paymentsData, isLoading: paymentsLoading } = usePaymentsQuery(1, 5);
  const { data: walletsData } = useWalletsQuery();

  useEffect(() => {
    if (paymentsData) {
      const paymentsList = paymentsData.payments ?? [];
      setPayments(paymentsList, paymentsData.pagination);

      const currentStats = {
        totalPayments: paymentsData.pagination?.total ?? paymentsList.length,
        totalVolume: paymentsList.reduce(
          (sum: number, p: Payment) => sum + parseFloat(p.sourceAmount ?? '0'),
          0
        ),
        pendingPayments: paymentsList.filter(
          (p: Payment) => p.status === 'pending' || p.status === 'processing'
        ).length,
        activeWallets: 0,
      };

      if (walletsData) {
        syncWithServer(walletsData.wallets ?? []);
        currentStats.activeWallets = walletsData.wallets?.length ?? 0;
      }

      setStats(currentStats);
    }
  }, [paymentsData, walletsData, setPayments, syncWithServer]);

  useEffect(() => {
    setLoading(paymentsLoading);
  }, [paymentsLoading, setLoading]);

  return {
    user,
    wallet,
    payments,
    stats,
    isLoading: paymentsLoading,
  };
}
