'use client';

import { Orbit, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button, Card, Input } from '@/presentation/components/atoms';
import { BaseModal, DeleteConfirmationModal, Pagination } from '@/presentation/components/molecules';
import { ChainSelector } from '@/presentation/components/organisms';
import { useTranslation } from '@/presentation/hooks';
import { useAdminLayerzeroConfigs } from './useAdminLayerzeroConfigs';

export const AdminLayerzeroConfigsView = () => {
  const { t } = useTranslation();
  const { state, actions } = useAdminLayerzeroConfigs();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Orbit className="w-6 h-6 text-primary" />
            {t('admin.layerzero_configs_view.title')}
          </h1>
          <p className="text-sm text-muted">{t('admin.layerzero_configs_view.subtitle')}</p>
        </div>
        <Button onClick={actions.openCreate} size="sm" glow>
          <Plus className="w-4 h-4" />
          {t('admin.layerzero_configs_view.add_config')}
        </Button>
      </div>

      <Card className="p-4 bg-white/5 border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <ChainSelector
            label={t('admin.layerzero_configs_view.source_chain')}
            chains={state.chains}
            selectedChainId={state.filterSourceChainId}
            onSelect={(chain) => actions.setFilterSourceChainId(chain?.id || '')}
            placeholder={t('admin.layerzero_configs_view.all_source_chains')}
          />
          <ChainSelector
            label={t('admin.layerzero_configs_view.destination_chain')}
            chains={state.chains}
            selectedChainId={state.filterDestChainId}
            onSelect={(chain) => actions.setFilterDestChainId(chain?.id || '')}
            placeholder={t('admin.layerzero_configs_view.all_destination_chains')}
          />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground/80 ml-1">{t('admin.layerzero_configs_view.active_only')}</label>
            <select
              value={state.activeOnly}
              onChange={(e) => actions.setActiveOnly(e.target.value as 'all' | 'true' | 'false')}
              className="w-full h-11 px-4 rounded-xl border border-white/10 bg-black/40 text-foreground outline-none focus:ring-2 focus:ring-accent-purple/30"
            >
              <option value="all">{t('admin.layerzero_configs_view.filter_all')}</option>
              <option value="true">{t('admin.layerzero_configs_view.filter_active')}</option>
              <option value="false">{t('admin.layerzero_configs_view.filter_inactive')}</option>
            </select>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {state.isLoading ? (
          <Card className="p-6 bg-white/5 border-white/10">{t('admin.layerzero_configs_view.loading')}</Card>
        ) : (
          (state.listData?.items || []).map((item: any) => (
            <Card key={item.id} className="p-5 bg-white/5 border-white/10 rounded-2xl">
              <div className="flex justify-between gap-4 flex-wrap">
                <div className="space-y-1">
                  <p className="text-xs text-muted font-mono">{item.id}</p>
                  <p className="text-sm">
                    <span className="text-muted">{t('admin.layerzero_configs_view.labels.source')}:</span> {item.sourceChainId}
                  </p>
                  <p className="text-sm">
                    <span className="text-muted">{t('admin.layerzero_configs_view.labels.destination')}:</span> {item.destChainId}
                  </p>
                  <p className="text-sm">
                    <span className="text-muted">{t('admin.layerzero_configs_view.labels.dst_eid')}:</span> {item.dstEid}
                  </p>
                  <p className="text-sm break-all">
                    <span className="text-muted">{t('admin.layerzero_configs_view.labels.peer_hex')}:</span> {item.peerHex}
                  </p>
                  <p className="text-sm break-all">
                    <span className="text-muted">{t('admin.layerzero_configs_view.labels.options_hex')}:</span> {item.optionsHex || '0x'}
                  </p>
                  <p className="text-sm">
                    <span className="text-muted">{t('admin.layerzero_configs_view.labels.is_active')}:</span>{' '}
                    {item.isActive ? t('admin.layerzero_configs_view.yes') : t('admin.layerzero_configs_view.no')}
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
        title={state.editingId ? t('admin.layerzero_configs_view.update_title') : t('admin.layerzero_configs_view.create_title')}
        description={t('admin.layerzero_configs_view.modal_desc')}
        onConfirm={actions.submit}
        isConfirmLoading={state.isPending}
        isConfirmDisabled={!state.form.sourceChainId || !state.form.destChainId || !state.form.dstEid || !state.form.peerHex}
      >
        <div className="space-y-3">
          <ChainSelector
            label={t('admin.layerzero_configs_view.source_chain')}
            chains={state.chains}
            selectedChainId={state.form.sourceChainId}
            onSelect={(chain) => actions.setForm({ ...state.form, sourceChainId: chain?.id || '' })}
            placeholder={t('admin.layerzero_configs_view.select_source_chain')}
          />
          <ChainSelector
            label={t('admin.layerzero_configs_view.destination_chain')}
            chains={state.chains}
            selectedChainId={state.form.destChainId}
            onSelect={(chain) => actions.setForm({ ...state.form, destChainId: chain?.id || '' })}
            placeholder={t('admin.layerzero_configs_view.select_destination_chain')}
          />
          <Input
            label={t('admin.layerzero_configs_view.dst_eid')}
            value={state.form.dstEid}
            onChange={(e) => actions.setForm({ ...state.form, dstEid: e.target.value })}
            placeholder="30110"
          />
          <Input
            label={t('admin.layerzero_configs_view.peer_hex')}
            value={state.form.peerHex}
            onChange={(e) => actions.setForm({ ...state.form, peerHex: e.target.value })}
            placeholder="0x000000000000000000000000..."
          />
          <Input
            label={t('admin.layerzero_configs_view.options_hex')}
            value={state.form.optionsHex}
            onChange={(e) => actions.setForm({ ...state.form, optionsHex: e.target.value })}
            placeholder="0x"
          />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground/80 ml-1">{t('admin.layerzero_configs_view.is_active')}</label>
            <select
              value={state.form.isActive ? 'true' : 'false'}
              onChange={(e) => actions.setForm({ ...state.form, isActive: e.target.value === 'true' })}
              className="w-full h-11 px-4 rounded-xl border border-white/10 bg-black/40 text-foreground outline-none focus:ring-2 focus:ring-accent-purple/30"
            >
              <option value="true">{t('admin.layerzero_configs_view.active')}</option>
              <option value="false">{t('admin.layerzero_configs_view.inactive')}</option>
            </select>
          </div>
        </div>
      </BaseModal>

      <DeleteConfirmationModal
        isOpen={!!state.deleteId}
        onClose={() => actions.setDeleteId('')}
        onConfirm={actions.confirmDelete}
        title={t('admin.layerzero_configs_view.delete_title')}
        description={t('admin.layerzero_configs_view.delete_desc')}
        isLoading={state.isPending}
      />
    </div>
  );
};
