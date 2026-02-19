'use client';

import { usePaymentStore, useUrlQueryState } from '@/presentation/hooks';
import { QUERY_PARAM_KEYS } from '@/core/constant';

export function usePayments() {
  const { getNumber, setMany } = useUrlQueryState();
  const page = getNumber(QUERY_PARAM_KEYS.page, 1);
  const limit = 10;
  
  const { payments, loading: isLoading, pagination } = usePaymentStore(page, limit);

  return {
    payments,
    isLoading,
    pagination,
    page,
    setPage: (value: number | ((prev: number) => number)) => {
      const next = typeof value === 'function' ? value(page) : value;
      setMany({ [QUERY_PARAM_KEYS.page]: next });
    },
  };
}
