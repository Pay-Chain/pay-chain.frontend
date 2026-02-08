'use client';

import { useState, useCallback } from 'react';
import type { Payment } from '@/data/model/entity';

// Stub hook - TODO: implement with proper data layer
export function usePaymentStore() {
  const [payments, setPaymentsState] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);

  const setPayments = useCallback((newPayments: Payment[], _pagination?: unknown) => {
    setPaymentsState(newPayments);
  }, []);

  return {
    payments,
    loading,
    setPayments,
    setLoading,
  };
}
