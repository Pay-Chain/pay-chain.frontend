import { useState } from 'react';
import { useTokenList } from '@/presentation/hooks/useTokenList/useTokenList';
import { useAdminChains } from '@/data/usecase/useAdmin';
import { useCreateToken } from '@/presentation/hooks/useTokenList/useCreateToken';
import { useUpdateToken } from '@/presentation/hooks/useTokenList/useUpdateToken';
import { useDeleteToken } from '@/presentation/hooks/useTokenList/useDeleteToken';
import { useDebounce } from '@/presentation/hooks/useDebounce';
import { useUrlQueryState } from '@/presentation/hooks';
import { QUERY_PARAM_KEYS } from '@/core/constant';
import { SupportedTokenEntity } from '@/src/domain/entity/token/TokenEntity';

export const useAdminTokens = () => {
  const { getString, getNumber, getSearch, setMany } = useUrlQueryState();
  const searchTerm = getSearch();
  const filterChainId = getString(QUERY_PARAM_KEYS.chainId);
  const page = getNumber(QUERY_PARAM_KEYS.page, 1);
  const [limit] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    symbol: '',
    name: '',
    decimals: 18,
    logoUrl: '',
    type: 'ERC20',
    chainId: '',
    contractAddress: '',
    minAmount: '',
    maxAmount: '',
  });

  const debouncedSearch = useDebounce(searchTerm, 500);

  // Fetch Tokens
  const { data: tokenData, isLoading: isTokensLoading } = useTokenList({
    chainId: filterChainId || undefined,
    search: debouncedSearch,
    page,
    limit,
  });

  // Fetch Chains for filter
  const { data: chains } = useAdminChains();

  const createToken = useCreateToken();
  const updateToken = useUpdateToken();
  const deleteToken = useDeleteToken();

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ symbol: '', name: '', decimals: 18, logoUrl: '', type: 'ERC20', chainId: filterChainId || '', contractAddress: '', minAmount: '', maxAmount: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (token: SupportedTokenEntity) => {
    // We use id because the backend endpoint /admin/tokens/:id updates the Token entity
    setEditingId(token.id);
    setFormData({
      symbol: token.symbol || '',
      name: token.name || '',
      decimals: token.decimals || 18,
      logoUrl: token.logoUrl || '',
      type: token.type || 'ERC20',
      chainId: token.chainId,
      contractAddress: token.contractAddress || '',
      minAmount: token.minAmount || '',
      maxAmount: token.maxAmount || '',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (editingId) {
      updateToken.mutate({ id: editingId, data: formData }, {
        onSuccess: handleCloseModal,
      });
    } else {
      createToken.mutate(formData, {
        onSuccess: handleCloseModal,
      });
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteToken.mutate(deleteId, {
        onSuccess: () => setDeleteId(null),
      });
    }
  };

  const clearFilters = () => {
    setMany({
      [QUERY_PARAM_KEYS.q]: null,
      [QUERY_PARAM_KEYS.legacySearch]: null,
      [QUERY_PARAM_KEYS.chainId]: null,
      [QUERY_PARAM_KEYS.page]: 1,
    });
  };

  return {
    state: {
      searchTerm,
      filterChainId,
      page,
      limit,
      tokenData,
      isTokensLoading,
      chains,
      isModalOpen,
      editingId,
      deleteId,
      formData,
      isMutationPending: createToken.isPending || updateToken.isPending || deleteToken.isPending,
    },
    actions: {
      setSearchTerm: (term: string) =>
        setMany({
          [QUERY_PARAM_KEYS.q]: term,
          [QUERY_PARAM_KEYS.legacySearch]: null,
          [QUERY_PARAM_KEYS.page]: 1,
        }),
      setFilterChainId: (id: string) => setMany({ [QUERY_PARAM_KEYS.chainId]: id, [QUERY_PARAM_KEYS.page]: 1 }),
      setPage: (value: number | ((prev: number) => number)) => {
        const next = typeof value === 'function' ? value(page) : value;
        setMany({ [QUERY_PARAM_KEYS.page]: next });
      },
      setFormData,
      setDeleteId,
      handleOpenAdd,
      handleOpenEdit,
      handleCloseModal,
      handleSubmit,
      handleDelete,
      clearFilters,
    }
  };
};
