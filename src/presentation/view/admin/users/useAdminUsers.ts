import { useState } from 'react';
import { useAdminUsers as useAdminUsersQuery } from '@/data/usecase/useAdmin';
import { useDebounce } from '@/presentation/hooks/useDebounce';
import { useUrlQueryState } from '@/presentation/hooks';
import { QUERY_PARAM_KEYS } from '@/core/constants';

export const useAdminUsers = () => {
  const { getNumber, getSearch, setMany } = useUrlQueryState();
  const searchTerm = getSearch();
  const page = getNumber(QUERY_PARAM_KEYS.page, 1);
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
    }
  };
};
