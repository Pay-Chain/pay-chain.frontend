'use client';

import { usePaymentsQuery } from '@/data/usecase';

export function useHome() {
  const { data, isLoading, error, refetch } = usePaymentsQuery();

  const handleRefresh = () => {
    refetch();
  };

  return {
    payments: data?.payments || [],
    pagination: data?.pagination,
    isLoading,
    error: error?.message,
    handleRefresh,
  };
}
