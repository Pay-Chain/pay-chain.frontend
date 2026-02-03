'use client';

import { usePaymentRequestsQuery } from '@/data/usecase';
import { useState } from 'react';

export function usePaymentRequests() {
  const [page, setPage] = useState(1);
  const limit = 10;
  
  const { data, isLoading } = usePaymentRequestsQuery(page, limit);

  return {
    paymentRequests: data?.paymentRequests ?? [],
    pagination: data?.pagination,
    isLoading,

    page,
    setPage,
  };
}
