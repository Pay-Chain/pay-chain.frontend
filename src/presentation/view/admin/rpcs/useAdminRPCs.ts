import { useState } from 'react';
import { useRpcList } from '@/presentation/hooks/useRpcList/useRpcList';
import { useAdminChains, useCreateRpc, useUpdateRpc, useDeleteRpc } from '@/data/usecase/useAdmin';
import { useDebounce } from '@/presentation/hooks/useDebounce';
import { useTranslation, useUrlQueryState } from '@/presentation/hooks';
import { QUERY_PARAM_KEYS } from '@/core/constant';
import { toast } from 'sonner';

export const useAdminRPCs = () => {
  const { t } = useTranslation();
  const { getString, getNumber, getSearch, setMany } = useUrlQueryState();
  const searchTerm = getSearch();
  const filterChainId = getString(QUERY_PARAM_KEYS.chainId);
  const filterActive = getString(QUERY_PARAM_KEYS.active); // "true", "false", ""
  const page = getNumber(QUERY_PARAM_KEYS.page, 1);
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
  const createRpc = useCreateRpc();
  const updateRpc = useUpdateRpc();
  const deleteRpc = useDeleteRpc();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingRpcId, setEditingRpcId] = useState<string | null>(null);
  const [selectedChainId, setSelectedChainId] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    chainId: '',
    rpcUrl: '',
    explorerUrl: '',
    symbol: '',
    chainType: 'EVM',
    isActive: true,
  });

  const handleOpenAdd = () => {
    setEditingRpcId(null);
    setSelectedChainId('');
    setFormData({ name: '', chainId: '', rpcUrl: '', explorerUrl: '', symbol: '', chainType: 'EVM', isActive: true });
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

    setEditingRpcId(rpc.id);
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
      rpcUrl: rpc.url || '', 
      explorerUrl: chain.explorerUrl || '',
      symbol: chain.symbol || '',
      chainType: chain.chainType || 'EVM',
      isActive: rpc.isActive ?? true,
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
      isActive: chain.isActive ?? true,
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsDeleteModalOpen(false);
    setEditingRpcId(null);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (editingRpcId) {
        // Update existing RPC
        const payload = {
            url: formData.rpcUrl,
            isActive: formData.isActive,
            // priority: 0 // Optional, maybe add field later
        };

        updateRpc.mutate({ id: editingRpcId, data: payload }, {
            onSuccess: () => {
                handleCloseModal();
                toast.success(`${t('admin.rpcs_view.toasts.update_success')} ${formData.name}`);
                refetch();
            },
            onError: (err: any) => {
                toast.error(err.message || t('admin.rpcs_view.toasts.update_failed'));
            }
        });
    } else {
        // Create new RPC
        if (!selectedChainId) {
            toast.error(t('admin.rpcs_view.toasts.select_chain_first'));
            return;
        }

        const payload = {
            chainId: selectedChainId,
            url: formData.rpcUrl,
            priority: 0, // Default priority
        };

        createRpc.mutate(payload, {
            onSuccess: () => {
                handleCloseModal();
                toast.success(t('admin.rpcs_view.toasts.create_success') || 'RPC created successfully');
                refetch();
            },
            onError: (err: any) => {
                toast.error(err.message || t('admin.rpcs_view.toasts.create_failed') || 'Failed to create RPC');
            }
        });
    }
  };

  const handleOpenDelete = (rpc: any) => {
    setEditingRpcId(rpc.id);
    const chainName = rpc.chain?.name || `${t('admin.rpcs_view.chain_fallback_prefix')} ${rpc.chainId.substring(0, 8)}...`;
    setFormData({ ...formData, name: `${chainName} - ${rpc.url}` }); 
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
     if (!editingRpcId) return;
     
     deleteRpc.mutate(editingRpcId, {
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
    setMany({
      [QUERY_PARAM_KEYS.q]: null,
      [QUERY_PARAM_KEYS.legacySearch]: null,
      [QUERY_PARAM_KEYS.chainId]: null,
      [QUERY_PARAM_KEYS.active]: null,
      [QUERY_PARAM_KEYS.page]: 1,
    });
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
      editingRpcId,

      selectedChainId,
      formData,
      isUpdatePending: updateRpc.isPending || createRpc.isPending,
      isDeletePending: deleteRpc.isPending,
    },
    actions: {
      setSearchTerm: (term: string) =>
        setMany({
          [QUERY_PARAM_KEYS.q]: term,
          [QUERY_PARAM_KEYS.legacySearch]: null,
          [QUERY_PARAM_KEYS.page]: 1,
        }),
      setFilterChainId: (id: string) => setMany({ [QUERY_PARAM_KEYS.chainId]: id, [QUERY_PARAM_KEYS.page]: 1 }),
      setFilterActive: (active: string) => setMany({ [QUERY_PARAM_KEYS.active]: active, [QUERY_PARAM_KEYS.page]: 1 }),
      setPage: (value: number | ((prev: number) => number)) => {
        const next = typeof value === 'function' ? value(page) : value;
        setMany({ [QUERY_PARAM_KEYS.page]: next });
      },
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
