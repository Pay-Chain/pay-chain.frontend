import { useState } from 'react';
import { useAdminMerchants as useAdminMerchantsQuery, useUpdateMerchantStatus } from '@/data/usecase/useAdmin';
import { useDebounce } from '@/presentation/hooks/useDebounce';
import { toast } from 'sonner';

export const useAdminMerchants = () => {
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
    if (confirm(`Are you sure you want to mark this merchant as ${status}?`)) {
      updateStatus({ id, status }, {
        onSuccess: () => {
          toast.success(`Merchant ${status} successfully`);
          refetch();
        },
        onError: (err: any) => toast.error(err.message || 'Failed to update status'),
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
