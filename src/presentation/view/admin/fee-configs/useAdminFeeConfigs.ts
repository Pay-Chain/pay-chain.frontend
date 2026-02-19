import { useState } from 'react';
import { useUrlQueryState } from '@/presentation/hooks';
import { QUERY_PARAM_KEYS } from '@/core/constant';
import {
  useAdminChains,
  useAdminFeeConfigs,
  useCreateFeeConfig,
  useDeleteFeeConfig,
  useUpdateFeeConfig,
} from '@/data/usecase/useAdmin';
import { useTokenList } from '@/presentation/hooks/useTokenList/useTokenList';

export const useFeeConfigsAdmin = () => {
  const { getString, getNumber, setMany } = useUrlQueryState();
  const page = getNumber(QUERY_PARAM_KEYS.page, 1);
  const [limit] = useState(20);
  const filterChainId = getString(QUERY_PARAM_KEYS.chainId);
  const filterTokenId = getString(QUERY_PARAM_KEYS.tokenId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    chainId: '',
    tokenId: '',
    platformFeePercent: '0',
    fixedBaseFee: '0',
    minFee: '0',
    maxFee: '',
  });

  const listQuery = useAdminFeeConfigs({
    page,
    limit,
    chainId: filterChainId || undefined,
    tokenId: filterTokenId || undefined,
  });
  const chainQuery = useAdminChains(1, 200);
  const filterTokenQuery = useTokenList({ page: 1, limit: 500, chainId: filterChainId || undefined });
  const formTokenQuery = useTokenList({ page: 1, limit: 500, chainId: form.chainId || undefined });

  const createMutation = useCreateFeeConfig();
  const updateMutation = useUpdateFeeConfig();
  const deleteMutation = useDeleteFeeConfig();

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm({
      chainId: filterChainId || '',
      tokenId: '',
      platformFeePercent: '0',
      fixedBaseFee: '0',
      minFee: '0',
      maxFee: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingId(item.id);
    setForm({
      chainId: item.chainId || '',
      tokenId: item.tokenId || '',
      platformFeePercent: item.platformFeePercent || '0',
      fixedBaseFee: item.fixedBaseFee || '0',
      minFee: item.minFee || '0',
      maxFee: item.maxFee || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    const payload = {
      ...form,
      maxFee: form.maxFee.trim() ? form.maxFee.trim() : null,
    };
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload }, { onSuccess: () => setIsModalOpen(false) });
      return;
    }
    createMutation.mutate(payload, { onSuccess: () => setIsModalOpen(false) });
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
  };

  return {
    state: {
      page,
      listData: listQuery.data,
      isLoading: listQuery.isLoading,
      chains: chainQuery.data?.items || [],
      filterTokens: filterTokenQuery.data?.items || [],
      formTokens: formTokenQuery.data?.items || [],
      filterChainId,
      filterTokenId,
      isModalOpen,
      deleteId,
      editingId,
      form,
      isPending: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    },
    actions: {
      setPage: (value: number | ((prev: number) => number)) => {
        const next = typeof value === 'function' ? value(page) : value;
        setMany({ [QUERY_PARAM_KEYS.page]: next });
      },
      setFilterChainId: (value: string) =>
        setMany({
          [QUERY_PARAM_KEYS.chainId]: value,
          [QUERY_PARAM_KEYS.tokenId]: null,
          [QUERY_PARAM_KEYS.page]: 1,
        }),
      setFilterTokenId: (value: string) => setMany({ [QUERY_PARAM_KEYS.tokenId]: value, [QUERY_PARAM_KEYS.page]: 1 }),
      setIsModalOpen,
      setDeleteId,
      setForm,
      handleOpenCreate,
      handleOpenEdit,
      handleSubmit,
      handleDelete,
    },
  };
};
