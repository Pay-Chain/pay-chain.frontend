import { useState } from 'react';
import { useAdminMerchants as useAdminMerchantsQuery, useUpdateMerchantStatus } from '@/data/usecase/useAdmin';
import { useDebounce } from '@/presentation/hooks/useDebounce';
import { toast } from 'sonner';
import { useTranslation } from '@/presentation/hooks';

export const useAdminMerchants = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
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
      setSearchTerm: (term: string) => { setSearchTerm(term); setPage(1); },
      setPage,
      handleStatusUpdate,
    }
  };
};
