'use client';

import { usePaymentRequestsQuery } from '@/data/usecase';
import { useUrlQueryState } from '@/presentation/hooks';
import { QUERY_PARAM_KEYS } from '@/core/constant';

export function usePaymentRequests() {
  const { getNumber, setMany } = useUrlQueryState();
  const page = getNumber(QUERY_PARAM_KEYS.page, 1);
  const limit = 10;
  
  const { data, isLoading } = usePaymentRequestsQuery(page, limit);

  return {
    paymentRequests: data?.paymentRequests ?? [],
    pagination: data?.pagination,
    isLoading,

    page,
    setPage: (value: number | ((prev: number) => number)) => {
      const next = typeof value === 'function' ? value(page) : value;
      setMany({ [QUERY_PARAM_KEYS.page]: next });
    },
  };
}
