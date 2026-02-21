import { useState } from 'react';
import { useUrlQueryState } from '@/presentation/hooks';
import { QUERY_PARAM_KEYS } from '@/core/constants';
import {
  useAdminPaymentBridges,
  useCreatePaymentBridge,
  useDeletePaymentBridge,
  useUpdatePaymentBridge,
} from '@/data/usecase/useAdmin';

export const usePaymentBridgesAdmin = () => {
  const { getNumber, setMany } = useUrlQueryState();
  const page = getNumber(QUERY_PARAM_KEYS.page, 1);
  const [limit] = useState(20);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');

  const { data, isLoading } = useAdminPaymentBridges(page, limit);
  const createMutation = useCreatePaymentBridge();
  const updateMutation = useUpdatePaymentBridge();
  const deleteMutation = useDeletePaymentBridge();

  const handleOpenCreate = () => {
    setEditingId(null);
    setName('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingId(item.id);
    setName(item.name || '');
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: { name: name.trim() } }, { onSuccess: () => setIsModalOpen(false) });
      return;
    }
    createMutation.mutate({ name: name.trim() }, { onSuccess: () => setIsModalOpen(false) });
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
  };

  return {
    state: {
      page,
      data,
      isLoading,
      isModalOpen,
      deleteId,
      editingId,
      name,
      isPending: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    },
    actions: {
      setPage: (value: number | ((prev: number) => number)) => {
        const next = typeof value === 'function' ? value(page) : value;
        setMany({ [QUERY_PARAM_KEYS.page]: next });
      },
      setName,
      setDeleteId,
      handleOpenCreate,
      handleOpenEdit,
      setIsModalOpen,
      handleSubmit,
      handleDelete,
    },
  };
};
