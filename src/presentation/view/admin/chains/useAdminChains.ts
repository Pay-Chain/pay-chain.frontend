import { useState } from 'react';
import { useAdminChains as useAdminChainsQuery, useCreateChain, useUpdateChain, useDeleteChain } from '@/data/usecase/useAdmin';
import { useDebounce } from '@/presentation/hooks/useDebounce';
import { toast } from 'sonner';

export const useAdminChains = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    chainId: '', // CAIP-2 format
    rpcUrl: '',
    explorerUrl: '',
    symbol: '',
    logoUrl: '',
    isActive: true,
  });

  const debouncedSearch = useDebounce(searchTerm, 500);

  // Fetch Chains
  const { data: chainsData, isLoading: isChainsLoading, refetch } = useAdminChainsQuery(page, limit);

  const createChain = useCreateChain();
  const updateChain = useUpdateChain();
  const deleteChain = useDeleteChain();

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ name: '', chainId: '', rpcUrl: '', explorerUrl: '', symbol: '', logoUrl: '', isActive: true });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (chain: any) => {
    setEditingId(chain.id);
    let caip2Id = chain.caip2;
    if (!caip2Id) {
      const namespace = chain.chainType === 'EVM' ? 'eip155' : 'solana';
      caip2Id = `${namespace}:${chain.id}`;
    }

    setFormData({
      name: chain.name,
      chainId: caip2Id,
      rpcUrl: chain.rpcUrl || '',
      explorerUrl: chain.explorerUrl || '',
      symbol: chain.symbol || '',
      logoUrl: chain.logoUrl || '',
      isActive: chain.isActive ?? true,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    const [namespace, reference] = formData.chainId.split(':');
    if (!namespace || !reference) {
      toast.error('Invalid Chain ID format. Use format: eip155:1 or solana:5');
      return;
    }

    let chainType = 'EVM';
    if (namespace.toLowerCase() === 'solana') {
      chainType = 'SVM';
    }

    const payload = {
      ...formData,
      networkId: reference,
      chainType,
    };

    if (editingId) {
      updateChain.mutate({ id: editingId, data: payload } as any, {
        onSuccess: () => {
          handleCloseModal();
          toast.success('Chain updated successfully');
          refetch();
        },
        onError: (err: any) => {
          toast.error(err.message || 'Failed to update chain');
        }
      });
    } else {
      createChain.mutate(payload, {
        onSuccess: () => {
          handleCloseModal();
          toast.success('Chain created successfully');
          refetch();
        },
        onError: (err: any) => {
          toast.error(err.message || 'Failed to create chain');
        }
      });
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteChain.mutate(deleteId as any, {
        onSuccess: () => {
          setDeleteId(null);
          toast.success('Chain deleted successfully');
          refetch();
        },
        onError: (err: any) => {
          toast.error(err.message || 'Failed to delete chain');
        }
      });
    }
  };

  return {
    state: {
      searchTerm,
      page,
      limit,
      chainsData,
      isChainsLoading,
      isModalOpen,
      editingId,
      deleteId,
      formData,
      isMutationPending: createChain.isPending || updateChain.isPending || deleteChain.isPending,
    },
    actions: {
      setSearchTerm: (term: string) => { setSearchTerm(term); setPage(1); },
      setPage,
      setFormData,
      setDeleteId,
      handleOpenAdd,
      handleOpenEdit,
      handleCloseModal,
      handleSubmit,
      handleDelete,
    }
  };
};
