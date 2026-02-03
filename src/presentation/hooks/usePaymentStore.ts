'use client';

import { useState } from 'react';
import type { Payment } from '@/data/model/entity';

// Stub hook - TODO: implement with proper data layer
export function usePaymentStore() {
  const [payments, setPaymentsState] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);

  return {
    payments,
    loading,
    setPayments: (newPayments: Payment[], _pagination?: unknown) => setPaymentsState(newPayments),
    setLoading,
  };
}
