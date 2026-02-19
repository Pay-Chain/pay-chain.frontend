'use client';

import { Pencil, Plus, Route, Trash2 } from 'lucide-react';
import { Button, Card, Input } from '@/presentation/components/atoms';
import { BaseModal, DeleteConfirmationModal, Pagination } from '@/presentation/components/molecules';
import { ChainSelector } from '@/presentation/components/organisms';
import { useTranslation } from '@/presentation/hooks';
import { useAdminRoutePolicies } from './useAdminRoutePolicies';

export const AdminRoutePoliciesView = () => {
  const { t } = useTranslation();
  const { state, actions } = useAdminRoutePolicies();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Route className="w-6 h-6 text-primary" />
            {t('admin.route_policies_view.title')}
          </h1>
          <p className="text-sm text-muted">{t('admin.route_policies_view.subtitle')}</p>
        </div>
        <Button onClick={actions.openCreate} size="sm" glow>
          <Plus className="w-4 h-4" />
          {t('admin.route_policies_view.add_policy')}
        </Button>
      </div>

      <Card className="p-4 bg-white/5 border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ChainSelector
            label={t('admin.route_policies_view.source_chain')}
            chains={state.chains}
            selectedChainId={state.filterSourceChainId}
            onSelect={(chain) => actions.setFilterSourceChainId(chain?.id || '')}
            placeholder={t('admin.route_policies_view.all_source_chains')}
          />
          <ChainSelector
            label={t('admin.route_policies_view.destination_chain')}
            chains={state.chains}
            selectedChainId={state.filterDestChainId}
            onSelect={(chain) => actions.setFilterDestChainId(chain?.id || '')}
            placeholder={t('admin.route_policies_view.all_destination_chains')}
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {state.isLoading ? (
          <Card className="p-6 bg-white/5 border-white/10">{t('admin.route_policies_view.loading')}</Card>
        ) : (
          (state.listData?.items || []).map((item: any) => (
            <Card key={item.id} className="p-5 bg-white/5 border-white/10 rounded-2xl">
              <div className="flex justify-between gap-4 flex-wrap">
                <div className="space-y-1">
                  <p className="text-xs text-muted font-mono">{item.id}</p>
                  <p className="text-sm">
                    <span className="text-muted">{t('admin.route_policies_view.labels.source')}:</span> {item.sourceChainId}
                  </p>
                  <p className="text-sm">
                    <span className="text-muted">{t('admin.route_policies_view.labels.destination')}:</span> {item.destChainId}
                  </p>
                  <p className="text-sm">
                    <span className="text-muted">{t('admin.route_policies_view.labels.default_bridge_type')}:</span> {item.defaultBridgeType}
                  </p>
                  <p className="text-sm">
                    <span className="text-muted">{t('admin.route_policies_view.labels.fallback_mode')}:</span> {item.fallbackMode || '-'}
                  </p>
                  <p className="text-sm">
                    <span className="text-muted">{t('admin.route_policies_view.labels.fallback_order')}:</span>{' '}
                    {Array.isArray(item.fallbackOrder) ? item.fallbackOrder.join(', ') : '-'}
                  </p>
                </div>
                <div className="flex items-start gap-1">
                  <Button size="sm" variant="ghost" onClick={() => actions.openEdit(item)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => actions.setDeleteId(String(item.id || ''))}>
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {state.listData?.meta && (
        <Pagination
          currentPage={state.listData.meta.page}
          totalPages={state.listData.meta.totalPages}
          onPageChange={actions.setPage}
          isLoading={state.isLoading}
        />
      )}

      <BaseModal
        isOpen={state.isModalOpen}
        onClose={() => actions.setIsModalOpen(false)}
        title={state.editingId ? t('admin.route_policies_view.update_title') : t('admin.route_policies_view.create_title')}
        description={t('admin.route_policies_view.modal_desc')}
        onConfirm={actions.submit}
        isConfirmLoading={state.isPending}
        isConfirmDisabled={!state.form.sourceChainId || !state.form.destChainId}
      >
        <div className="space-y-3">
          <ChainSelector
            label={t('admin.route_policies_view.source_chain')}
            chains={state.chains}
            selectedChainId={state.form.sourceChainId}
            onSelect={(chain) => actions.setForm({ ...state.form, sourceChainId: chain?.id || '' })}
            placeholder={t('admin.route_policies_view.select_source_chain')}
          />
          <ChainSelector
            label={t('admin.route_policies_view.destination_chain')}
            chains={state.chains}
            selectedChainId={state.form.destChainId}
            onSelect={(chain) => actions.setForm({ ...state.form, destChainId: chain?.id || '' })}
            placeholder={t('admin.route_policies_view.select_destination_chain')}
          />

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground/80 ml-1">
              {t('admin.route_policies_view.default_bridge_type')}
            </label>
            <select
              value={state.form.defaultBridgeType}
              onChange={(e) => actions.setForm({ ...state.form, defaultBridgeType: e.target.value })}
              className="w-full h-11 px-4 rounded-xl border border-white/10 bg-black/40 text-foreground outline-none focus:ring-2 focus:ring-accent-purple/30"
            >
              <option value="0">0 - Hyperbridge</option>
              <option value="1">1 - CCIP</option>
              <option value="2">2 - LayerZero</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground/80 ml-1">
              {t('admin.route_policies_view.fallback_mode')}
            </label>
            <select
              value={state.form.fallbackMode}
              onChange={(e) => actions.setForm({ ...state.form, fallbackMode: e.target.value })}
              className="w-full h-11 px-4 rounded-xl border border-white/10 bg-black/40 text-foreground outline-none focus:ring-2 focus:ring-accent-purple/30"
            >
              <option value="strict">{t('admin.route_policies_view.strict')}</option>
              <option value="auto_fallback">{t('admin.route_policies_view.auto_fallback')}</option>
            </select>
          </div>

          <Input
            label={t('admin.route_policies_view.fallback_order_optional')}
            value={state.form.fallbackOrder}
            onChange={(e) => actions.setForm({ ...state.form, fallbackOrder: e.target.value })}
            placeholder="0,1,2"
          />
        </div>
      </BaseModal>

      <DeleteConfirmationModal
        isOpen={!!state.deleteId}
        onClose={() => actions.setDeleteId('')}
        onConfirm={actions.confirmDelete}
        title={t('admin.route_policies_view.delete_title')}
        description={t('admin.route_policies_view.delete_desc')}
        isLoading={state.isPending}
      />
    </div>
  );
};
