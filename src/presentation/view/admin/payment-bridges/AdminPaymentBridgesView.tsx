'use client';

import { Plus, Waypoints, Pencil, Trash2 } from 'lucide-react';
import { Button, Card, Input } from '@/presentation/components/atoms';
import { BaseModal, DeleteConfirmationModal, Pagination } from '@/presentation/components/molecules';
import { usePaymentBridgesAdmin } from './useAdminPaymentBridges';
import { useTranslation } from '@/presentation/hooks';

export const AdminPaymentBridgesView = () => {
  const { t } = useTranslation();
  const { state, actions } = usePaymentBridgesAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Waypoints className="w-6 h-6 text-primary" />
            {t('admin.payment_bridges_view.title')}
          </h1>
          <p className="text-sm text-muted">{t('admin.payment_bridges_view.subtitle')}</p>
        </div>
        <Button onClick={actions.handleOpenCreate} size="sm" glow>
          <Plus className="w-4 h-4" />
          {t('admin.payment_bridges_view.add_bridge')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {state.isLoading ? (
          <Card className="p-6 bg-white/5 border-white/10">{t('admin.payment_bridges_view.loading')}</Card>
        ) : (
          (state.data?.items || []).map((item: any) => (
            <Card key={item.id} className="p-5 bg-white/5 border-white/10 rounded-2xl">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-muted">{t('admin.payment_bridges_view.bridge_name')}</p>
                  <p className="text-lg font-semibold text-foreground">{item.name}</p>
                  <p className="text-xs text-muted mt-1 font-mono">{item.id}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button size="sm" variant="ghost" onClick={() => actions.handleOpenEdit(item)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => actions.setDeleteId(item.id)}>
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {state.data?.meta && (
        <Pagination
          currentPage={state.data.meta.page}
          totalPages={state.data.meta.totalPages}
          onPageChange={actions.setPage}
          isLoading={state.isLoading}
        />
      )}

      <BaseModal
        isOpen={state.isModalOpen}
        onClose={() => actions.setIsModalOpen(false)}
        title={state.editingId ? t('admin.payment_bridges_view.update_title') : t('admin.payment_bridges_view.create_title')}
        description={t('admin.payment_bridges_view.modal_desc')}
        onConfirm={actions.handleSubmit}
        isConfirmLoading={state.isPending}
        isConfirmDisabled={!state.name.trim()}
      >
        <Input
          label={t('admin.payment_bridges_view.name_label')}
          placeholder={t('admin.payment_bridges_view.name_placeholder')}
          value={state.name}
          onChange={(e) => actions.setName(e.target.value)}
          required
        />
      </BaseModal>

      <DeleteConfirmationModal
        isOpen={!!state.deleteId}
        onClose={() => actions.setDeleteId(null)}
        onConfirm={actions.handleDelete}
        title={t('admin.payment_bridges_view.delete_title')}
        description={t('admin.payment_bridges_view.delete_desc')}
        isLoading={state.isPending}
      />
    </div>
  );
};
