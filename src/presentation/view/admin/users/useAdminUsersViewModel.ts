'use client';

import { useState, useEffect } from 'react';
import { useAdminUsers } from '@/data/usecase/useAdmin';
import { useUrlQueryState } from '@/presentation/hooks';
import { QUERY_PARAM_KEYS } from '@/core/constant';

export const useAdminUsersViewModel = () => {
  const { getSearch, setMany } = useUrlQueryState();
  const searchTerm = getSearch();
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debouncing effect (2 seconds as requested)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 2000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const { data: users, isLoading, error } = useAdminUsers(debouncedSearch);

  return {
    users,
    isLoading,
    error,
    searchTerm,
    setSearchTerm: (value: string) =>
      setMany({ [QUERY_PARAM_KEYS.q]: value, [QUERY_PARAM_KEYS.legacySearch]: null }),
    isSearching: searchTerm !== debouncedSearch,
  };
};
