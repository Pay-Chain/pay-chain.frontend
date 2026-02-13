import { useState } from 'react';
import { useRpcList } from '@/presentation/hooks/useRpcList/useRpcList';
import { useAdminChains, useUpdateChain, useDeleteChain } from '@/data/usecase/useAdmin';
import { useDebounce } from '@/presentation/hooks/useDebounce';
import { useTranslation } from '@/presentation/hooks';
import { toast } from 'sonner';

export const useAdminRPCs = () => {
  const { t } = useTranslation();
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
  const deleteChain = useDeleteChain();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
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

  const handleOpenEdit = (rpc: any) => {
    // 1. Try to get chain details from relation
    let chain = rpc.chain;

    // 2. If relation missing, lookup in loaded chains list
    if (!chain && chains?.items) {
       chain = chains.items.find((c: any) => c.id === rpc.chainId);
    }
    
    // 3. Fallback to basic info if still not found
    if (!chain) {
        chain = {
            id: rpc.chainId,
            name: `${t('admin.rpcs_view.chain_fallback_prefix')} ${rpc.chainId.substring(0, 8)}...`,
            symbol: '???',
            chainType: 'EVM', // Default
            rpcUrl: rpc.url,
            explorerUrl: '',
        };
    }

    setEditingChainId(rpc.id); // RPC ID for update (wait, backend uses ChainID/RPC ID mixed?)
    // Correction: UpdateChain uses Chain ID, UpdateRPC presumably uses Chain ID or RPC ID. 
    // The previous code used `chain.id` which was RPC's chain relation ID?
    // Let's look at `updateChain.mutate({ id: targetId ...`. 
    // If we are editing RPC config for a chain, we likely need chain ID.
    // Use `rpc.chainId` as the target ID for the form.
    
    setSelectedChainId(rpc.chainId);

    let caip2Id = chain.caip2;
    if (!caip2Id && chain.networkId) {
      caip2Id = `${chain.namespace || 'eip155'}:${chain.networkId}`;
    } else if (!caip2Id) {
        // If we have no networkId (fallback), just use chainId?
      caip2Id = `eip155:${chain.id}`;
    }

    setFormData({
      name: chain.name || `${t('admin.rpcs_view.chain_fallback_prefix')} ${rpc.chainId.substring(0, 8)}...`,
      chainId: caip2Id || '',
      rpcUrl: rpc.url || '', // Use RPC's URL not Chain's default
      explorerUrl: chain.explorerUrl || '',
      symbol: chain.symbol || '',
      chainType: chain.chainType || 'EVM',
    });
    setIsModalOpen(true);
  };

  const handleChainSelect = (chain: any) => {
    if (!chain) {
        setSelectedChainId('');
        return;
    }

    setSelectedChainId(chain.id);
    
    let caip2Id = chain.caip2;
    if (!caip2Id && chain.networkId) {
      caip2Id = `${chain.namespace || 'eip155'}:${chain.networkId}`;
    } else if (!caip2Id) {
      caip2Id = `eip155:${chain.id}`;
    }

    setFormData({
      ...formData,
      name: chain.name,
      chainId: caip2Id || '',
      symbol: chain.symbol || '',
      chainType: chain.chainType || 'EVM',
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsDeleteModalOpen(false);
    setEditingChainId(null);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const targetId = editingChainId || selectedChainId;
    if (!targetId) {
      toast.error(t('admin.rpcs_view.toasts.select_chain_first'));
      return;
    }

    updateChain.mutate({ id: targetId, data: { ...formData, id: targetId } }, {
      onSuccess: () => {
        handleCloseModal();
        toast.success(`${t('admin.rpcs_view.toasts.update_success')} ${formData.name}`);
        refetch();
      },
      onError: (err: any) => {
        toast.error(err.message || t('admin.rpcs_view.toasts.update_failed'));
      }
    });
  };

  const handleOpenDelete = (chain: any) => {
    setEditingChainId(chain.id.toString());
    setFormData({ ...formData, name: chain.name }); 
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
     if (!editingChainId) return;
     
     deleteChain.mutate(editingChainId, {
        onSuccess: () => {
           handleCloseModal();
           toast.success(t('admin.rpcs_view.toasts.remove_success'));
           refetch();
        },
        onError: (err: any) => {
           toast.error(err.message || t('admin.rpcs_view.toasts.remove_failed'));
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
      isDeleteModalOpen,
      editingChainId,
      selectedChainId,
      formData,
      isUpdatePending: updateChain.isPending,
      isDeletePending: deleteChain.isPending,
    },
    actions: {
      setSearchTerm: (term: string) => { setSearchTerm(term); setPage(1); },
      setFilterChainId: (id: string) => { setFilterChainId(id); setPage(1); },
      setFilterActive: (active: string) => { setFilterActive(active); setPage(1); },
      setPage,
      setFormData,
      setSelectedChainId,
      handleChainSelect,
      handleOpenAdd,
      handleOpenEdit,
      handleOpenDelete,
      handleCloseModal,
      handleSubmit,
      handleDelete,
      clearFilters,
    }
  };
};
