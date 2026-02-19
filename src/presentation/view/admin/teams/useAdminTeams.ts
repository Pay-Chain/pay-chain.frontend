'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useTranslation, useUrlQueryState } from '@/presentation/hooks';
import { QUERY_PARAM_KEYS } from '@/core/constant';
import { useAdminTeams as useAdminTeamsQuery, useCreateTeam, useDeleteTeam, useUpdateTeam } from '@/data/usecase/useAdmin';
import { useDebounce } from '@/presentation/hooks/useDebounce';

type TeamForm = {
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  githubUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
  displayOrder: number;
  isActive: boolean;
};

const defaultForm: TeamForm = {
  name: '',
  role: '',
  bio: '',
  imageUrl: '',
  githubUrl: '',
  twitterUrl: '',
  linkedinUrl: '',
  displayOrder: 0,
  isActive: true,
};

export function useAdminTeams() {
  const { t } = useTranslation();
  const { getSearch, setMany } = useUrlQueryState();
  const searchTerm = getSearch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState<TeamForm>(defaultForm);

  const debouncedSearch = useDebounce(searchTerm, 400);

  const { data: teams = [], isLoading, refetch } = useAdminTeamsQuery(debouncedSearch);
  const createTeam = useCreateTeam();
  const updateTeam = useUpdateTeam();
  const deleteTeam = useDeleteTeam();

  const isMutationPending = createTeam.isPending || updateTeam.isPending || deleteTeam.isPending;

  const sortedTeams = useMemo(() => {
    return [...teams].sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }, [teams]);

  const openAddModal = () => {
    setEditingId(null);
    setFormData(defaultForm);
    setIsModalOpen(true);
  };

  const openEditModal = (team: any) => {
    setEditingId(team.id);
    setFormData({
      name: team.name || '',
      role: team.role || '',
      bio: team.bio || '',
      imageUrl: team.imageUrl || '',
      githubUrl: team.githubUrl || '',
      twitterUrl: team.twitterUrl || '',
      linkedinUrl: team.linkedinUrl || '',
      displayOrder: team.displayOrder || 0,
      isActive: team.isActive ?? true,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!formData.name || !formData.role || !formData.bio || !formData.imageUrl) {
      toast.error(t('admin.teams_view.toasts.required_fields'));
      return;
    }

    const payload = {
      ...formData,
      displayOrder: Number(formData.displayOrder || 0),
    };

    if (editingId) {
      updateTeam.mutate(
        { id: editingId, data: payload },
        {
          onSuccess: () => {
            toast.success(t('admin.teams_view.toasts.update_success'));
            closeModal();
            refetch();
          },
          onError: (err: any) => toast.error(err?.message || t('admin.teams_view.toasts.update_failed')),
        },
      );
      return;
    }

    createTeam.mutate(payload, {
      onSuccess: () => {
        toast.success(t('admin.teams_view.toasts.create_success'));
        closeModal();
        refetch();
      },
      onError: (err: any) => toast.error(err?.message || t('admin.teams_view.toasts.create_failed')),
    });
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    deleteTeam.mutate(deleteId, {
      onSuccess: () => {
        toast.success(t('admin.teams_view.toasts.delete_success'));
        setDeleteId(null);
        refetch();
      },
      onError: (err: any) => toast.error(err?.message || t('admin.teams_view.toasts.delete_failed')),
    });
  };

  return {
    state: {
      searchTerm,
      sortedTeams,
      isLoading,
      isModalOpen,
      editingId,
      deleteId,
      formData,
      isMutationPending,
    },
    actions: {
      setSearchTerm: (value: string) =>
        setMany({ [QUERY_PARAM_KEYS.q]: value, [QUERY_PARAM_KEYS.legacySearch]: null }),
      setFormData,
      setDeleteId,
      openAddModal,
      openEditModal,
      closeModal,
      submit,
      confirmDelete,
    },
  };
}
