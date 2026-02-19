'use client';

import { usePaymentsQuery } from '@/data/usecase';
import type { Payment } from '@/data/model/entity';

const EMPTY_PAYMENTS: Payment[] = [];

// Stub hook - TODO: implement with proper data layer
export function usePaymentStore(page = 1, limit = 10) {
  const { data, isLoading } = usePaymentsQuery(page, limit);

  return {
    payments: data?.payments ?? EMPTY_PAYMENTS,
    loading: isLoading,
    pagination: data?.pagination,
    // Compatibility helpers if needed, or we explicitly remove them from consumers
    setPayments: () => {}, // No-op as query handles data
    setLoading: () => {}, // No-op
  };
}
