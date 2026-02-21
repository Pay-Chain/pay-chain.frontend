import { useState } from 'react';
import { useAdminMerchants as useAdminMerchantsQuery, useUpdateMerchantStatus } from '@/data/usecase/useAdmin';
import { useDebounce } from '@/presentation/hooks/useDebounce';
import { toast } from 'sonner';
import { useTranslation, useUrlQueryState } from '@/presentation/hooks';
import { QUERY_PARAM_KEYS } from '@/core/constants';

export const useAdminMerchants = () => {
  const { t } = useTranslation();
  const { getNumber, getSearch, setMany } = useUrlQueryState();
  const searchTerm = getSearch();
  const page = getNumber(QUERY_PARAM_KEYS.page, 1);
  const [limit] = useState(10);

  const debouncedSearch = useDebounce(searchTerm, 500);

  // Fetch Merchants
  const { data: merchants, isLoading, refetch } = useAdminMerchantsQuery();
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateMerchantStatus();

  const filteredMerchants = merchants?.filter((m: any) => 
    m.businessName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    m.businessEmail.toLowerCase().includes(debouncedSearch.toLowerCase())
  ) || [];

  const handleStatusUpdate = (id: string, status: string) => {
    if (confirm(t('admin.merchants_view.toasts.confirm_status_change'))) {
      updateStatus({ id, status }, {
        onSuccess: () => {
          toast.success(t('admin.merchants_view.toasts.update_success'));
          refetch();
        },
        onError: (err: any) => toast.error(err.message || t('admin.merchants_view.toasts.update_failed')),
      });
    }
  };

  return {
    state: {
      searchTerm,
      page,
      limit,
      merchants,
      filteredMerchants,
      isLoading,
      isUpdating,
      isSearching: searchTerm !== debouncedSearch,
    },
    actions: {
      setSearchTerm: (term: string) =>
        setMany({
          [QUERY_PARAM_KEYS.q]: term,
          [QUERY_PARAM_KEYS.legacySearch]: null,
          [QUERY_PARAM_KEYS.page]: 1,
        }),
      setPage: (value: number | ((prev: number) => number)) => {
        const next = typeof value === 'function' ? value(page) : value;
        setMany({ [QUERY_PARAM_KEYS.page]: next });
      },
      handleStatusUpdate,
    }
  };
};
