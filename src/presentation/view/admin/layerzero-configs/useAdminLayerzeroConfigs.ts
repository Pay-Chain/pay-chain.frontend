import { useState } from 'react';
import { useUrlQueryState } from '@/presentation/hooks';
import { QUERY_PARAM_KEYS } from '@/core/constant';
import {
  useAdminChains,
  useCreateLayerZeroPolicy,
  useDeleteLayerZeroPolicy,
  useLayerZeroPolicies,
  useUpdateLayerZeroPolicy,
} from '@/data/usecase/useAdmin';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

export const useAdminLayerzeroConfigs = () => {
  const { getString, getNumber, setMany } = useUrlQueryState();
  const page = getNumber(QUERY_PARAM_KEYS.page, DEFAULT_PAGE);
  const [limit] = useState(DEFAULT_LIMIT);
  const filterSourceChainId = getString(QUERY_PARAM_KEYS.sourceChainId);
  const filterDestChainId = getString(QUERY_PARAM_KEYS.destChainId);
  const activeOnly = (getString(QUERY_PARAM_KEYS.activeOnly, 'all') as 'all' | 'true' | 'false');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [deleteId, setDeleteId] = useState('');

  const [form, setForm] = useState({
    sourceChainId: '',
    destChainId: '',
    dstEid: '',
    peerHex: '',
    optionsHex: '0x',
    isActive: true,
  });

  const listQuery = useLayerZeroPolicies({
    page,
    limit,
    sourceChainId: filterSourceChainId || undefined,
    destChainId: filterDestChainId || undefined,
    activeOnly: activeOnly === 'all' ? undefined : activeOnly === 'true',
  });
  const chainQuery = useAdminChains(1, 200);
  const createMutation = useCreateLayerZeroPolicy();
  const updateMutation = useUpdateLayerZeroPolicy();
  const deleteMutation = useDeleteLayerZeroPolicy();

  const openCreate = () => {
    setEditingId('');
    setForm({
      sourceChainId: filterSourceChainId || '',
      destChainId: filterDestChainId || '',
      dstEid: '',
      peerHex: '',
      optionsHex: '0x',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEdit = (item: any) => {
    setEditingId(String(item.id || ''));
    setForm({
      sourceChainId: String(item.sourceChainId || ''),
      destChainId: String(item.destChainId || ''),
      dstEid: String(item.dstEid || ''),
      peerHex: String(item.peerHex || ''),
      optionsHex: String(item.optionsHex || '0x'),
      isActive: Boolean(item.isActive),
    });
    setIsModalOpen(true);
  };

  const submit = () => {
    const payload = {
      sourceChainId: form.sourceChainId,
      destChainId: form.destChainId,
      dstEid: Number(form.dstEid),
      peerHex: form.peerHex,
      optionsHex: form.optionsHex || '0x',
      isActive: form.isActive,
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
      activeOnly,
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
      setActiveOnly: (value: 'all' | 'true' | 'false') =>
        setMany({ [QUERY_PARAM_KEYS.activeOnly]: value, [QUERY_PARAM_KEYS.page]: 1 }),
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
