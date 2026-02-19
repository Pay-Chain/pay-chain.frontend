'use client';

import { Percent, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button, Card, Input } from '@/presentation/components/atoms';
import { BaseModal, DeleteConfirmationModal, Pagination } from '@/presentation/components/molecules';
import { ChainSelector, TokenSelector } from '@/presentation/components/organisms';
import { useFeeConfigsAdmin } from './useAdminFeeConfigs';
import { useTranslation } from '@/presentation/hooks';

export const AdminFeeConfigsView = () => {
  const { t } = useTranslation();
  const { state, actions } = useFeeConfigsAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Percent className="w-6 h-6 text-primary" />
            {t('admin.fee_configs_view.title')}
          </h1>
          <p className="text-sm text-muted">{t('admin.fee_configs_view.subtitle')}</p>
        </div>
        <Button onClick={actions.handleOpenCreate} size="sm" glow>
          <Plus className="w-4 h-4" />
          {t('admin.fee_configs_view.add_config')}
        </Button>
      </div>

      <Card className="p-4 bg-white/5 border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ChainSelector
            label={t('admin.fee_configs_view.chain')}
            chains={state.chains}
            selectedChainId={state.filterChainId}
            onSelect={(chain) => {
              actions.setFilterChainId(chain?.id || '');
              actions.setFilterTokenId('');
            }}
            placeholder={t('admin.fee_configs_view.filter_chain')}
          />
          <TokenSelector
            label={t('admin.fee_configs_view.token')}
            tokens={state.filterTokens}
            selectedTokenId={state.filterTokenId}
            onSelect={(token) => actions.setFilterTokenId(token?.id || '')}
            placeholder={t('admin.fee_configs_view.all_tokens')}
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {state.isLoading ? (
          <Card className="p-6 bg-white/5 border-white/10">{t('admin.fee_configs_view.loading')}</Card>
        ) : (
          (state.listData?.items || []).map((item: any) => (
            <Card key={item.id} className="p-5 bg-white/5 border-white/10 rounded-2xl">
              <div className="flex justify-between gap-4 flex-wrap">
                <div className="space-y-1">
                  <p className="text-xs text-muted font-mono">{item.id}</p>
                  <p className="text-sm"><span className="text-muted">{t('admin.fee_configs_view.labels.chain')}:</span> {item.chainId}</p>
                  <p className="text-sm"><span className="text-muted">{t('admin.fee_configs_view.labels.token')}:</span> {item.tokenId}</p>
                  <p className="text-sm"><span className="text-muted">{t('admin.fee_configs_view.labels.platform_fee_percent')}:</span> {item.platformFeePercent}</p>
                  <p className="text-sm"><span className="text-muted">{t('admin.fee_configs_view.labels.fixed_base_fee')}:</span> {item.fixedBaseFee}</p>
                  <p className="text-sm"><span className="text-muted">{t('admin.fee_configs_view.labels.min_fee')}:</span> {item.minFee}</p>
                  <p className="text-sm"><span className="text-muted">{t('admin.fee_configs_view.labels.max_fee')}:</span> {item.maxFee || '-'}</p>
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
        title={state.editingId ? t('admin.fee_configs_view.update_title') : t('admin.fee_configs_view.create_title')}
        description={t('admin.fee_configs_view.modal_desc')}
        onConfirm={actions.handleSubmit}
        isConfirmLoading={state.isPending}
        isConfirmDisabled={!state.form.chainId || !state.form.tokenId}
      >
        <div className="space-y-3">
          <ChainSelector
            label={t('admin.fee_configs_view.chain')}
            chains={state.chains}
            selectedChainId={state.form.chainId}
            onSelect={(chain) => actions.setForm({ ...state.form, chainId: chain?.id || '', tokenId: '' })}
            placeholder={t('admin.fee_configs_view.chain')}
          />
          <TokenSelector
            label={t('admin.fee_configs_view.token')}
            tokens={state.formTokens}
            selectedTokenId={state.form.tokenId}
            onSelect={(token) => actions.setForm({ ...state.form, tokenId: token?.id || '' })}
            placeholder={state.form.chainId ? t('admin.fee_configs_view.select_token') : t('payments.select_chain_first')}
            disabled={!state.form.chainId}
          />
          <Input
            label={t('admin.fee_configs_view.platform_fee_percent')}
            value={state.form.platformFeePercent}
            onChange={(e) => actions.setForm({ ...state.form, platformFeePercent: e.target.value })}
            placeholder="0.01"
          />
          <Input
            label={t('admin.fee_configs_view.fixed_base_fee')}
            value={state.form.fixedBaseFee}
            onChange={(e) => actions.setForm({ ...state.form, fixedBaseFee: e.target.value })}
            placeholder="0"
          />
          <Input
            label={t('admin.fee_configs_view.min_fee')}
            value={state.form.minFee}
            onChange={(e) => actions.setForm({ ...state.form, minFee: e.target.value })}
            placeholder="0"
          />
          <Input
            label={t('admin.fee_configs_view.max_fee_optional')}
            value={state.form.maxFee}
            onChange={(e) => actions.setForm({ ...state.form, maxFee: e.target.value })}
            placeholder="optional"
          />
        </div>
      </BaseModal>

      <DeleteConfirmationModal
        isOpen={!!state.deleteId}
        onClose={() => actions.setDeleteId(null)}
        onConfirm={actions.handleDelete}
        title={t('admin.fee_configs_view.delete_title')}
        description={t('admin.fee_configs_view.delete_desc')}
        isLoading={state.isPending}
      />
    </div>
  );
};
