import { useState } from 'react';
import { useRpcList } from '@/presentation/hooks/useRpcList/useRpcList';
import { useAdminChains, useUpdateChain } from '@/data/usecase/useAdmin';
import { useDebounce } from '@/presentation/hooks/useDebounce';
import { toast } from 'sonner';

export const useAdminRPCs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterChainId, setFilterChainId] = useState<string>('');
  const [filterActive, setFilterActive] = useState<string>(''); // "true", "false", ""
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const debouncedSearch = useDebounce(searchTerm, 500);

  // Fetch RPCs
  const { data: rpcData, isLoading: isRpcLoading, refetch } = useRpcList({
    chainId: filterChainId || undefined,
    isActive: filterActive === '' ? undefined : filterActive === 'true',
    search: debouncedSearch,
    page,
    limit,
  });

  // Fetch Chains
  const { data: chains } = useAdminChains();
  const updateChain = useUpdateChain();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChainId, setEditingChainId] = useState<string | null>(null);
  const [selectedChainId, setSelectedChainId] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    chainId: '',
    rpcUrl: '',
    explorerUrl: '',
    symbol: '',
    chainType: 'EVM',
  });

  const handleOpenAdd = () => {
    setEditingChainId(null);
    setSelectedChainId('');
    setFormData({ name: '', chainId: '', rpcUrl: '', explorerUrl: '', symbol: '', chainType: 'EVM' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (chain: any) => {
    setEditingChainId(chain.id.toString());
    setSelectedChainId(chain.id.toString());

    let caip2Id = chain.caip2;
    if (!caip2Id && chain.networkId) {
      caip2Id = `${chain.namespace || 'eip155'}:${chain.networkId}`;
    } else if (!caip2Id) {
      caip2Id = `eip155:${chain.id}`;
    }

    setFormData({
      name: chain.name,
      chainId: caip2Id || '',
      rpcUrl: chain.rpcUrl || '',
      explorerUrl: chain.explorerUrl || '',
      symbol: chain.symbol || '',
      chainType: chain.chainType || 'EVM',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingChainId(null);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const targetId = editingChainId || selectedChainId;
    if (!targetId) {
      toast.error('Please select a chain first');
      return;
    }

    updateChain.mutate({ id: targetId, data: { ...formData, id: targetId } }, {
      onSuccess: () => {
        handleCloseModal();
        toast.success(`RPC connection updated for ${formData.name}`);
        refetch();
      },
      onError: (err: any) => {
        toast.error(err.message || 'Failed to update connection');
      }
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterChainId('');
    setFilterActive('');
    setPage(1);
  };

  return {
    state: {
      searchTerm,
      filterChainId,
      filterActive,
      page,
      limit,
      rpcData,
      isRpcLoading,
      chains,
      isModalOpen,
      editingChainId,
      selectedChainId,
      formData,
      isUpdatePending: updateChain.isPending,
    },
    actions: {
      setSearchTerm: (term: string) => { setSearchTerm(term); setPage(1); },
      setFilterChainId: (id: string) => { setFilterChainId(id); setPage(1); },
      setFilterActive: (active: string) => { setFilterActive(active); setPage(1); },
      setPage,
      setFormData,
      setSelectedChainId,
      handleOpenAdd,
      handleOpenEdit,
      handleCloseModal,
      handleSubmit,
      clearFilters,
    }
  };
};
