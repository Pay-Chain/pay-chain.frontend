'use client';

import { usePaymentsQuery } from '@/data/usecase';
import { usePaymentStore } from '@/presentation/hooks';
import { useEffect, useState } from 'react';

export function usePayments() {
  const [page, setPage] = useState(1);
  const limit = 10;
  
  const { payments, setPayments, setLoading } = usePaymentStore();
  const { data, isLoading } = usePaymentsQuery(page, limit);

  useEffect(() => {
    if (data) {
      setPayments(data.payments ?? [], data.pagination);
    }
  }, [data, setPayments]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  return {
    payments,
    isLoading,
    pagination: data?.pagination,
    page,
    setPage,
  };
}
