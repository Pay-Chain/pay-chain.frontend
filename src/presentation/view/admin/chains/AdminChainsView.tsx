'use client';

import { useAdminChains } from './useAdminChains';
import { Card, Button, Input } from '@/presentation/components/atoms';
import { BaseModal, DeleteConfirmationModal, Pagination } from '@/presentation/components/molecules';
import { useTranslation } from '@/presentation/hooks';
import { Plus, Trash2, Globe, ExternalLink, Search, Edit2, LayoutGrid } from 'lucide-react';

export const AdminChainsView = () => {
  const { t } = useTranslation();
  const { state, actions } = useAdminChains();
  const {
    searchTerm,
    chainsData,
    isChainsLoading,
    isModalOpen,
    editingId,
    deleteId,
    formData,
    isMutationPending,
  } = state;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('admin.chains_view.title')}</h1>
          <p className="text-muted">{t('admin.chains_view.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder={t('admin.chains_view.search_placeholder')}
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 w-full md:w-64 transition-all"
              value={searchTerm}
              onChange={(e) => actions.setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted" />
          </div>
          <Button onClick={actions.handleOpenAdd} size="sm" glow>
            <Plus className="w-4 h-4" />
            {t('admin.chains_view.add_chain')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isChainsLoading ? (
          <div className="col-span-full p-12 text-center text-muted text-sm flex flex-col items-center justify-center gap-4 border border-white/5 rounded-2xl bg-white/5">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
              <Globe className="w-8 h-8 text-primary relative z-10" />
            </div>
            {t('admin.chains_view.loading')}
          </div>
        ) : (!chainsData || !chainsData.items || chainsData.items.length === 0) ? (
          <div className="col-span-full text-center py-20 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-md">
            <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10 shadow-glow-sm">
              <LayoutGrid className="w-8 h-8 text-muted/50" />
            </div>
            <h3 className="text-lg font-bold text-foreground">{t('admin.chains_view.empty_title')}</h3>
            <p className="text-muted text-sm max-w-xs mx-auto mt-1">{t('admin.chains_view.empty_desc')}</p>
          </div>
        ) : (
          <>
            <div className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chainsData.items.map((chain: any) => (
                <Card key={chain.id} className="p-6 bg-white/5 border-white/10 hover:border-primary/50 transition-all group relative overflow-hidden backdrop-blur-sm rounded-2xl">
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button
                      onClick={() => actions.handleOpenEdit(chain)}
                      className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                      title={t('admin.chains_view.edit_chain')}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => actions.setDeleteId(chain.id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title={t('admin.chains_view.delete_chain')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    {chain.logoUrl ? (
                      <img src={chain.logoUrl} alt={chain.name} className="w-12 h-12 rounded-full ring-1 ring-white/10 object-cover bg-white/5" />
                    ) : (
                      <div className="p-3 rounded-full bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/30">
                        <Globe className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-lg">{chain.name}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-muted uppercase tracking-widest font-bold border border-white/5">
                        {chain.chainType}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm text-muted">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span>{t('admin.chains_view.chain_id')}</span>
                      <span className="font-mono text-foreground">
                        {chain.caip2 && chain.caip2.includes(':') 
                          ? chain.caip2 
                          : chain.chainType === 'EVM' 
                            ? `eip155:${chain.networkId || chain.chainId}` 
                            : chain.chainType === 'SVM' 
                              ? `solana:${(chain.networkId || chain.chainId || '').substring(0, 8)}...` 
                              : (chain.networkId || chain.chainId)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span>{t('admin.chains_view.symbol')}</span>
                      <span className="text-foreground font-medium">{chain.symbol}</span>
                    </div>
                    <div className="pt-1">
                      <a
                        href={chain.explorerUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors text-xs font-semibold"
                      >
                        {t('admin.chains_view.open_explorer')} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="col-span-full">
              {chainsData.meta && (
                <Pagination
                  currentPage={chainsData.meta.page}
                  totalPages={chainsData.meta.totalPages}
                  onPageChange={actions.setPage}
                  isLoading={isChainsLoading}
                />
              )}
            </div>
          </>
        )}
      </div>

      <BaseModal
        isOpen={isModalOpen}
        onClose={actions.handleCloseModal}
        title={editingId ? t('admin.chains_view.modal.edit_title') : t('admin.chains_view.modal.add_title')}
        description={editingId ? t('admin.chains_view.modal.edit_desc') : t('admin.chains_view.modal.add_desc')}
        onConfirm={actions.handleSubmit}
        confirmLabel={editingId ? t('admin.chains_view.modal.update_confirm') : t('admin.chains_view.modal.save_confirm')}
        isConfirmLoading={isMutationPending}
        isConfirmDisabled={!formData.name || !formData.chainId || !formData.rpcUrl || !formData.symbol}
      >
        <form onSubmit={actions.handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={t('admin.chains_view.modal.chain_name')}
            placeholder={t('admin.chains_view.modal.chain_name_placeholder')}
            value={formData.name}
            onChange={(e) => actions.setFormData({ ...formData, name: e.target.value })}
            required
            className="md:col-span-2"
          />
          <Input
            label={t('admin.chains_view.modal.chain_id_label')}
            placeholder={t('admin.chains_view.modal.chain_id_placeholder')}
            value={formData.chainId}
            onChange={(e) => actions.setFormData({ ...formData, chainId: e.target.value })}
            required
            className="md:col-span-2"
            description={t('admin.chains_view.modal.chain_id_description')}
          />
          <Input
            label={t('admin.chains_view.modal.rpc_url')}
            placeholder={t('admin.chains_view.modal.rpc_url_placeholder')}
            value={formData.rpcUrl}
            onChange={(e) => actions.setFormData({ ...formData, rpcUrl: e.target.value })}
            required
            className="md:col-span-2"
          />
          <Input
            label={t('admin.chains_view.modal.explorer_url')}
            placeholder={t('admin.chains_view.modal.explorer_url_placeholder')}
            value={formData.explorerUrl}
            onChange={(e) => actions.setFormData({ ...formData, explorerUrl: e.target.value })}
            required
            className="md:col-span-2"
          />
          <Input
            label={t('admin.chains_view.modal.symbol_label')}
            placeholder={t('admin.chains_view.modal.symbol_placeholder')}
            value={formData.symbol}
            onChange={(e) => actions.setFormData({ ...formData, symbol: e.target.value })}
            required
          />
          <Input
            label={t('admin.chains_view.modal.logo_url')}
            placeholder={t('admin.chains_view.modal.logo_url_placeholder')}
            value={formData.logoUrl}
            onChange={(e) => actions.setFormData({ ...formData, logoUrl: e.target.value })}
          />
          <button type="submit" className="hidden" />
        </form>
      </BaseModal>

      <DeleteConfirmationModal
        isOpen={!!deleteId}
        onClose={() => actions.setDeleteId(null)}
        onConfirm={actions.handleDelete}
        title={t('admin.chains_view.delete_modal.title')}
        description={t('admin.chains_view.delete_modal.description')}
        isLoading={isMutationPending}
      />
    </div>
  );
};
