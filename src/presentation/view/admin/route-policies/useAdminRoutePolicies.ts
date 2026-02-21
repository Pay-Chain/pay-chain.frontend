import { useState } from 'react';
import { useUrlQueryState } from '@/presentation/hooks';
import { QUERY_PARAM_KEYS } from '@/core/constants';
import {
  useAdminChains,
  useCreateRoutePolicy,
  useDeleteRoutePolicy,
  useRoutePolicies,
  useUpdateRoutePolicy,
} from '@/data/usecase/useAdmin';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

const parseFallbackOrder = (value: string): number[] => {
  if (!value.trim()) return [];
  return value
    .split(',')
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isInteger(item) && item >= 0);
};

export const useAdminRoutePolicies = () => {
  const { getString, getNumber, setMany } = useUrlQueryState();
  const page = getNumber(QUERY_PARAM_KEYS.page, DEFAULT_PAGE);
  const [limit] = useState(DEFAULT_LIMIT);
  const filterSourceChainId = getString(QUERY_PARAM_KEYS.sourceChainId);
  const filterDestChainId = getString(QUERY_PARAM_KEYS.destChainId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [deleteId, setDeleteId] = useState('');

  const [form, setForm] = useState({
    sourceChainId: '',
    destChainId: '',
    defaultBridgeType: '0',
    fallbackMode: 'strict',
    fallbackOrder: '',
  });

  const listQuery = useRoutePolicies({
    page,
    limit,
    sourceChainId: filterSourceChainId || undefined,
    destChainId: filterDestChainId || undefined,
  });
  const chainQuery = useAdminChains(1, 200);
  const createMutation = useCreateRoutePolicy();
  const updateMutation = useUpdateRoutePolicy();
  const deleteMutation = useDeleteRoutePolicy();

  const openCreate = () => {
    setEditingId('');
    setForm({
      sourceChainId: filterSourceChainId || '',
      destChainId: filterDestChainId || '',
      defaultBridgeType: '0',
      fallbackMode: 'strict',
      fallbackOrder: '',
    });
    setIsModalOpen(true);
  };

  const openEdit = (item: any) => {
    setEditingId(String(item.id || ''));
    setForm({
      sourceChainId: String(item.sourceChainId || ''),
      destChainId: String(item.destChainId || ''),
      defaultBridgeType: String(item.defaultBridgeType ?? 0),
      fallbackMode: String(item.fallbackMode || 'strict'),
      fallbackOrder: Array.isArray(item.fallbackOrder) ? item.fallbackOrder.join(',') : '',
    });
    setIsModalOpen(true);
  };

  const submit = () => {
    const fallbackOrder = parseFallbackOrder(form.fallbackOrder);
    const payload = {
      sourceChainId: form.sourceChainId,
      destChainId: form.destChainId,
      defaultBridgeType: Number(form.defaultBridgeType),
      fallbackMode: form.fallbackMode,
      fallbackOrder: fallbackOrder.length ? fallbackOrder : undefined,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload }, { onSuccess: () => setIsModalOpen(false) });
      return;
    }
    createMutation.mutate(payload, { onSuccess: () => setIsModalOpen(false) });
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId('') });
  };

  return {
    state: {
      page,
      listData: listQuery.data,
      isLoading: listQuery.isLoading,
      chains: chainQuery.data?.items || [],
      filterSourceChainId,
      filterDestChainId,
      isModalOpen,
      editingId,
      deleteId,
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
      setIsModalOpen,
      setDeleteId,
      setForm,
      openCreate,
      openEdit,
      submit,
      confirmDelete,
    },
  };
};
