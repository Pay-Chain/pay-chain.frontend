'use client';

import { Edit2, Plus, Search, Trash2, Users } from 'lucide-react';
import { useTranslation } from '@/presentation/hooks';
import { BaseModal, DeleteConfirmationModal } from '@/presentation/components/molecules';
import { Button, Card, Input } from '@/presentation/components/atoms';
import { useAdminTeams } from './useAdminTeams';

export function AdminTeamsView() {
  const { t } = useTranslation();
  const { state, actions } = useAdminTeams();
  const { searchTerm, sortedTeams, isLoading, isModalOpen, editingId, deleteId, formData, isMutationPending } = state;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('admin.teams_view.title')}</h1>
          <p className="text-muted">{t('admin.teams_view.subtitle')}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => actions.setSearchTerm(e.target.value)}
              placeholder={t('admin.teams_view.search_placeholder')}
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 w-full md:w-64 transition-all"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted" />
          </div>
          <Button size="sm" glow onClick={actions.openAddModal}>
            <Plus className="w-4 h-4" />
            {t('admin.teams_view.add_team')}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-muted border border-white/10 rounded-2xl bg-white/5">{t('admin.teams_view.loading')}</div>
      ) : sortedTeams.length === 0 ? (
        <div className="p-12 text-center border border-white/10 rounded-2xl bg-white/5">
          <Users className="w-10 h-10 text-muted/50 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-foreground">{t('admin.teams_view.empty_title')}</h3>
          <p className="text-sm text-muted mt-1">{t('admin.teams_view.empty_desc')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTeams.map((team: any) => (
            <Card key={team.id} className="p-0 bg-white/5 border-white/10 overflow-hidden rounded-2xl">
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={team.imageUrl}
                      alt={team.name}
                      className="w-12 h-12 rounded-xl object-cover border border-white/10 bg-white/5"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate">{team.name}</p>
                      <p className="text-xs text-primary truncate">{team.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => actions.openEditModal(team)}
                      className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title={t('admin.teams_view.edit_team')}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => actions.setDeleteId(team.id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title={t('admin.teams_view.delete_team')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-muted line-clamp-3">{team.bio}</p>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted">
                    {t('admin.teams_view.order_label')}: <span className="text-foreground">{team.displayOrder || 0}</span>
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full border ${
                      team.isActive ? 'text-green-400 border-green-400/20 bg-green-500/10' : 'text-red-400 border-red-400/20 bg-red-500/10'
                    }`}
                  >
                    {team.isActive ? t('admin.teams_view.active') : t('admin.teams_view.inactive')}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <BaseModal
        isOpen={isModalOpen}
        onClose={actions.closeModal}
        title={editingId ? t('admin.teams_view.modal.edit_title') : t('admin.teams_view.modal.add_title')}
        description={editingId ? t('admin.teams_view.modal.edit_desc') : t('admin.teams_view.modal.add_desc')}
        onConfirm={actions.submit}
        confirmLabel={editingId ? t('admin.teams_view.modal.update_confirm') : t('admin.teams_view.modal.create_confirm')}
        isConfirmLoading={isMutationPending}
      >
        <form className="space-y-3" onSubmit={actions.submit}>
          <Input
            label={t('admin.teams_view.modal.name')}
            placeholder={t('admin.teams_view.modal.name_placeholder')}
            value={formData.name}
            onChange={(e) => actions.setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label={t('admin.teams_view.modal.role')}
            placeholder={t('admin.teams_view.modal.role_placeholder')}
            value={formData.role}
            onChange={(e) => actions.setFormData({ ...formData, role: e.target.value })}
            required
          />
          <Input
            label={t('admin.teams_view.modal.bio')}
            placeholder={t('admin.teams_view.modal.bio_placeholder')}
            value={formData.bio}
            onChange={(e) => actions.setFormData({ ...formData, bio: e.target.value })}
            required
          />
          <Input
            label={t('admin.teams_view.modal.image_url')}
            placeholder={t('admin.teams_view.modal.image_url_placeholder')}
            value={formData.imageUrl}
            onChange={(e) => actions.setFormData({ ...formData, imageUrl: e.target.value })}
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              label={t('admin.teams_view.modal.github_url')}
              placeholder={t('admin.teams_view.modal.github_url_placeholder')}
              value={formData.githubUrl}
              onChange={(e) => actions.setFormData({ ...formData, githubUrl: e.target.value })}
            />
            <Input
              label={t('admin.teams_view.modal.twitter_url')}
              placeholder={t('admin.teams_view.modal.twitter_url_placeholder')}
              value={formData.twitterUrl}
              onChange={(e) => actions.setFormData({ ...formData, twitterUrl: e.target.value })}
            />
            <Input
              label={t('admin.teams_view.modal.linkedin_url')}
              placeholder={t('admin.teams_view.modal.linkedin_url_placeholder')}
              value={formData.linkedinUrl}
              onChange={(e) => actions.setFormData({ ...formData, linkedinUrl: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              type="number"
              label={t('admin.teams_view.modal.display_order')}
              value={formData.displayOrder}
              onChange={(e) => actions.setFormData({ ...formData, displayOrder: Number(e.target.value || 0) })}
            />
            <label className="flex items-end gap-2 text-sm text-muted pb-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => actions.setFormData({ ...formData, isActive: e.target.checked })}
              />
              {t('admin.teams_view.modal.is_active')}
            </label>
          </div>
          <button type="submit" className="hidden" />
        </form>
      </BaseModal>

      <DeleteConfirmationModal
        isOpen={!!deleteId}
        onClose={() => actions.setDeleteId(null)}
        onConfirm={actions.confirmDelete}
        title={t('admin.teams_view.delete_modal.title')}
        description={t('admin.teams_view.delete_modal.description')}
        isLoading={isMutationPending}
      />
    </div>
  );
}
