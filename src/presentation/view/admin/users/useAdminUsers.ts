import { useState } from 'react';
import { useAdminUsers as useAdminUsersQuery } from '@/data/usecase/useAdmin';
import { useDebounce } from '@/presentation/hooks/useDebounce';

export const useAdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const debouncedSearch = useDebounce(searchTerm, 500);

  // Fetch Users
  const { data: users, isLoading } = useAdminUsersQuery(debouncedSearch);

  return {
    state: {
      searchTerm,
      page,
      limit,
      users,
      isLoading,
      isSearching: searchTerm !== debouncedSearch,
    },
    actions: {
      setSearchTerm: (term: string) => { setSearchTerm(term); setPage(1); },
      setPage,
    }
  };
};
