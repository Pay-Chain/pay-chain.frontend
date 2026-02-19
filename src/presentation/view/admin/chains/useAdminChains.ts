import { useState } from 'react';
import { useAdminChains as useAdminChainsQuery, useCreateChain, useUpdateChain, useDeleteChain } from '@/data/usecase/useAdmin';
import { useTranslation, useUrlQueryState } from '@/presentation/hooks';
import { QUERY_PARAM_KEYS } from '@/core/constant';
import { toast } from 'sonner';

export const useAdminChains = () => {
  const { t } = useTranslation();
  const { getNumber, getSearch, setMany } = useUrlQueryState();
  const searchTerm = getSearch();
  const page = getNumber(QUERY_PARAM_KEYS.page, 1);
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
      caip2Id = `${namespace}:${chain.networkId || chain.chainId}`; // Use legacy chainId/networkId
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
      toast.error(t('admin.chains_view.toasts.invalid_chain_id'));
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
          toast.success(t('admin.chains_view.toasts.update_success'));
          refetch();
        },
        onError: (err: any) => {
          toast.error(err.message || t('admin.chains_view.toasts.update_failed'));
        }
      });
    } else {
      createChain.mutate(payload, {
        onSuccess: () => {
          handleCloseModal();
          toast.success(t('admin.chains_view.toasts.create_success'));
          refetch();
        },
        onError: (err: any) => {
          toast.error(err.message || t('admin.chains_view.toasts.create_failed'));
        }
      });
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteChain.mutate(deleteId as any, {
        onSuccess: () => {
          setDeleteId(null);
          toast.success(t('admin.chains_view.toasts.delete_success'));
          refetch();
        },
        onError: (err: any) => {
          toast.error(err.message || t('admin.chains_view.toasts.delete_failed'));
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
