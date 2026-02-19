import { useState } from 'react';
import { useUrlQueryState } from '@/presentation/hooks';
import { QUERY_PARAM_KEYS } from '@/core/constant';
import {
  useAdminBridgeConfigs,
  useAdminChains,
  useAdminPaymentBridges,
  useCreateBridgeConfig,
  useDeleteBridgeConfig,
  useUpdateBridgeConfig,
} from '@/data/usecase/useAdmin';

export const useBridgeConfigsAdmin = () => {
  const { getString, getNumber, setMany } = useUrlQueryState();
  const page = getNumber(QUERY_PARAM_KEYS.page, 1);
  const [limit] = useState(20);
  const filterSourceChainId = getString(QUERY_PARAM_KEYS.sourceChainId);
  const filterDestChainId = getString(QUERY_PARAM_KEYS.destChainId);
  const filterBridgeId = getString(QUERY_PARAM_KEYS.bridgeId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    bridgeId: '',
    sourceChainId: '',
    destChainId: '',
    routerAddress: '',
    feePercentage: '0',
    config: '{}',
    isActive: true,
  });

  const listQuery = useAdminBridgeConfigs({
    page,
    limit,
    sourceChainId: filterSourceChainId || undefined,
    destChainId: filterDestChainId || undefined,
    bridgeId: filterBridgeId || undefined,
  });
  const chainQuery = useAdminChains(1, 200);
  const bridgeQuery = useAdminPaymentBridges(1, 200);

  const createMutation = useCreateBridgeConfig();
  const updateMutation = useUpdateBridgeConfig();
  const deleteMutation = useDeleteBridgeConfig();

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm({
      bridgeId: '',
      sourceChainId: '',
      destChainId: '',
      routerAddress: '',
      feePercentage: '0',
      config: '{}',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingId(item.id);
    setForm({
      bridgeId: item.bridgeId || '',
      sourceChainId: item.sourceChainId || '',
      destChainId: item.destChainId || '',
      routerAddress: item.routerAddress || '',
      feePercentage: item.feePercentage || '0',
      config: item.config || '{}',
      isActive: item.isActive ?? true,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    const payload = {
      ...form,
      feePercentage: form.feePercentage || '0',
      config: form.config || '{}',
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
      bridges: bridgeQuery.data?.items || [],
      filterSourceChainId,
      filterDestChainId,
      filterBridgeId,
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
      setFilterSourceChainId: (value: string) =>
        setMany({ [QUERY_PARAM_KEYS.sourceChainId]: value, [QUERY_PARAM_KEYS.page]: 1 }),
      setFilterDestChainId: (value: string) =>
        setMany({ [QUERY_PARAM_KEYS.destChainId]: value, [QUERY_PARAM_KEYS.page]: 1 }),
      setFilterBridgeId: (value: string) =>
        setMany({ [QUERY_PARAM_KEYS.bridgeId]: value, [QUERY_PARAM_KEYS.page]: 1 }),
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
