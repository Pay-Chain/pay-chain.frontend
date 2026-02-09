import { useState } from 'react';
import { useTokenList } from '@/presentation/hooks/useTokenList/useTokenList';
import { useAdminChains } from '@/data/usecase/useAdmin';
import { useCreateToken } from '@/presentation/hooks/useTokenList/useCreateToken';
import { useUpdateToken } from '@/presentation/hooks/useTokenList/useUpdateToken';
import { useDeleteToken } from '@/presentation/hooks/useTokenList/useDeleteToken';
import { useDebounce } from '@/presentation/hooks/useDebounce';
import { SupportedTokenEntity } from '@/src/domain/entity/token/TokenEntity';

export const useAdminTokens = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterChainId, setFilterChainId] = useState<string>('');
  const [page, setPage] = useState(1);
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
    setFormData({ symbol: '', name: '', decimals: 18, logoUrl: '', type: 'ERC20', chainId: filterChainId || '', contractAddress: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (token: SupportedTokenEntity) => {
    // We use tokenId because the backend endpoint /admin/tokens/:id updates the Token entity
    setEditingId(token.tokenId);
    setFormData({
      symbol: token.token?.symbol || '',
      name: token.token?.name || '',
      decimals: token.token?.decimals || 18,
      logoUrl: token.token?.logoUrl || '',
      type: (token.token as any)?.type || 'ERC20',
      chainId: token.chainId,
      contractAddress: token.contractAddress || '',
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
      // Find the tokenId for the selected supported token
      const tokenToDelete = tokenData?.items.find(t => t.id === deleteId);
      const targetId = tokenToDelete?.tokenId || deleteId;

      deleteToken.mutate(targetId, {
        onSuccess: () => setDeleteId(null),
      });
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterChainId('');
    setPage(1);
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
      setSearchTerm: (term: string) => { setSearchTerm(term); setPage(1); },
      setFilterChainId: (id: string) => { setFilterChainId(id); setPage(1); },
      setPage,
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
