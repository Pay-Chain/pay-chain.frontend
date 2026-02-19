'use client';

import { Cable, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button, Card, Input } from '@/presentation/components/atoms';
import { BaseModal, DeleteConfirmationModal, Pagination } from '@/presentation/components/molecules';
import { ChainSelector } from '@/presentation/components/organisms';
import { useBridgeConfigsAdmin } from './useAdminBridgeConfigs';
import { useTranslation } from '@/presentation/hooks';

export const AdminBridgeConfigsView = () => {
  const { t } = useTranslation();
  const { state, actions } = useBridgeConfigsAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Cable className="w-6 h-6 text-primary" />
            {t('admin.bridge_configs_view.title')}
          </h1>
          <p className="text-sm text-muted">{t('admin.bridge_configs_view.subtitle')}</p>
        </div>
        <Button onClick={actions.handleOpenCreate} size="sm" glow>
          <Plus className="w-4 h-4" />
          {t('admin.bridge_configs_view.add_config')}
        </Button>
      </div>

      <Card className="p-4 bg-white/5 border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <ChainSelector
            label={t('admin.bridge_configs_view.source_chain')}
            chains={state.chains}
            selectedChainId={state.filterSourceChainId}
            onSelect={(chain) => actions.setFilterSourceChainId(chain?.id || '')}
            placeholder={t('admin.bridge_configs_view.filter_source')}
          />
          <ChainSelector
            label={t('admin.bridge_configs_view.destination_chain')}
            chains={state.chains}
            selectedChainId={state.filterDestChainId}
            onSelect={(chain) => actions.setFilterDestChainId(chain?.id || '')}
            placeholder={t('admin.bridge_configs_view.filter_destination')}
          />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground/80 ml-1">{t('admin.bridge_configs_view.labels.bridge')}</label>
            <select
              className="h-11 rounded-full bg-white/5 border border-white/10 px-3 text-sm w-full"
              value={state.filterBridgeId}
              onChange={(e) => actions.setFilterBridgeId(e.target.value)}
            >
              <option value="">{t('admin.bridge_configs_view.all_bridges')}</option>
              {state.bridges.map((bridge: any) => (
                <option key={bridge.id} value={bridge.id}>{bridge.name}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {state.isLoading ? (
          <Card className="p-6 bg-white/5 border-white/10">{t('admin.bridge_configs_view.loading')}</Card>
        ) : (
          (state.listData?.items || []).map((item: any) => (
            <Card key={item.id} className="p-5 bg-white/5 border-white/10 rounded-2xl">
              <div className="flex justify-between gap-4 flex-wrap">
                <div className="space-y-1">
                  <p className="text-xs text-muted font-mono">{item.id}</p>
                  <p className="text-sm"><span className="text-muted">{t('admin.bridge_configs_view.labels.bridge')}:</span> {item.bridge?.name || item.bridgeId}</p>
                  <p className="text-sm"><span className="text-muted">{t('admin.bridge_configs_view.labels.source')}:</span> {item.sourceChainId}</p>
                  <p className="text-sm"><span className="text-muted">{t('admin.bridge_configs_view.labels.destination')}:</span> {item.destChainId}</p>
                  <p className="text-sm"><span className="text-muted">{t('admin.bridge_configs_view.labels.router')}:</span> {item.routerAddress || '-'}</p>
                  <p className="text-sm"><span className="text-muted">{t('admin.bridge_configs_view.labels.fee')}:</span> {item.feePercentage}</p>
                </div>
                <div className="flex items-start gap-1">
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
        title={state.editingId ? t('admin.bridge_configs_view.update_title') : t('admin.bridge_configs_view.create_title')}
        description={t('admin.bridge_configs_view.modal_desc')}
        onConfirm={actions.handleSubmit}
        isConfirmLoading={state.isPending}
        isConfirmDisabled={!state.form.bridgeId || !state.form.sourceChainId || !state.form.destChainId}
      >
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground/80 ml-1">{t('admin.bridge_configs_view.labels.bridge')}</label>
            <select
              className="h-11 rounded-full bg-white/5 border border-white/10 px-3 text-sm w-full"
              value={state.form.bridgeId}
              onChange={(e) => actions.setForm({ ...state.form, bridgeId: e.target.value })}
            >
              <option value="">{t('admin.bridge_configs_view.select_bridge')}</option>
              {state.bridges.map((bridge: any) => (
                <option key={bridge.id} value={bridge.id}>{bridge.name}</option>
              ))}
            </select>
          </div>
          <ChainSelector
            label={t('admin.bridge_configs_view.source_chain')}
            chains={state.chains}
            selectedChainId={state.form.sourceChainId}
            onSelect={(chain) => actions.setForm({ ...state.form, sourceChainId: chain?.id || '' })}
            placeholder={t('admin.bridge_configs_view.source_chain')}
          />
          <ChainSelector
            label={t('admin.bridge_configs_view.destination_chain')}
            chains={state.chains}
            selectedChainId={state.form.destChainId}
            onSelect={(chain) => actions.setForm({ ...state.form, destChainId: chain?.id || '' })}
            placeholder={t('admin.bridge_configs_view.destination_chain')}
          />
          <Input
            label={t('admin.bridge_configs_view.router_address')}
            value={state.form.routerAddress}
            onChange={(e) => actions.setForm({ ...state.form, routerAddress: e.target.value })}
            placeholder="0x..."
          />
          <Input
            label={t('admin.bridge_configs_view.fee_percentage')}
            value={state.form.feePercentage}
            onChange={(e) => actions.setForm({ ...state.form, feePercentage: e.target.value })}
            placeholder="0.01"
          />
          <Input
            label={t('admin.bridge_configs_view.config_json')}
            value={state.form.config}
            onChange={(e) => actions.setForm({ ...state.form, config: e.target.value })}
            placeholder="{}"
          />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground/80 ml-1">{t('admin.bridge_configs_view.is_active')}</label>
            <select
              className="h-11 rounded-full bg-white/5 border border-white/10 px-3 text-sm w-full"
              value={state.form.isActive ? 'true' : 'false'}
              onChange={(e) => actions.setForm({ ...state.form, isActive: e.target.value === 'true' })}
            >
              <option value="true">{t('admin.rpcs_view.active')}</option>
              <option value="false">{t('admin.rpcs_view.inactive')}</option>
            </select>
          </div>
        </div>
      </BaseModal>

      <DeleteConfirmationModal
        isOpen={!!state.deleteId}
        onClose={() => actions.setDeleteId(null)}
        onConfirm={actions.handleDelete}
        title={t('admin.bridge_configs_view.delete_title')}
        description={t('admin.bridge_configs_view.delete_desc')}
        isLoading={state.isPending}
      />
    </div>
  );
};
