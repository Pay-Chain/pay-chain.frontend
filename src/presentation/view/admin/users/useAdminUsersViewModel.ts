'use client';

import { useState, useEffect } from 'react';
import { useAdminUsers } from '@/data/usecase/useAdmin';

export const useAdminUsersViewModel = () => {
  const [searchTerm, setSearchTerm] = useState('');
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
    setSearchTerm,
    isSearching: searchTerm !== debouncedSearch,
  };
};
