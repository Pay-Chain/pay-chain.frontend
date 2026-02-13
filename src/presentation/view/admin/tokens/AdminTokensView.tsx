'use client';

import { useAdminTokens } from './useAdminTokens';
import { Card, Button, Input } from '@/presentation/components/atoms';
import { BaseModal, DeleteConfirmationModal, Pagination } from '@/presentation/components/molecules';
import { ChainSelector } from '@/presentation/components/organisms';
import { useTranslation } from '@/presentation/hooks';
import { Coins, Search, LayoutGrid, CheckCircle2, Plus, Edit2, Trash2 } from 'lucide-react';

export const AdminTokensView = () => {
  const { t } = useTranslation();
  const { state, actions } = useAdminTokens();
  const {
    searchTerm,
    filterChainId,
    tokenData,
    isTokensLoading,
    chains,
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
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Coins className="w-6 h-6 text-primary" />
            {t('admin.tokens_view.title')}
          </h1>
          <p className="text-sm text-muted">{t('admin.tokens_view.subtitle')}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder={t('admin.tokens_view.search_placeholder')}
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 w-full md:w-64 transition-all"
              value={searchTerm}
              onChange={(e) => actions.setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted" />
          </div>

          <div className="w-[180px]">
            <ChainSelector
                chains={chains?.items || []}
                selectedChainId={filterChainId}
                onSelect={(chain) => actions.setFilterChainId(chain?.id || '')}
                placeholder={t('admin.tokens_view.all_chains')}
            />
          </div>

          <Button onClick={actions.handleOpenAdd} size="sm" glow className="rounded-full px-5">
            <Plus className="w-4 h-4 mr-1" />
            {t('admin.tokens_view.add_token')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isTokensLoading ? (
          <div className="col-span-full p-12 text-center text-muted text-sm flex flex-col items-center justify-center gap-4 border border-white/5 rounded-2xl bg-white/5">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
              <Coins className="w-8 h-8 text-primary relative z-10" />
            </div>
            {t('admin.tokens_view.loading')}
          </div>
        ) : (!tokenData || !tokenData.items || tokenData.items.length === 0) ? (
          <div className="col-span-full text-center py-20 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-md">
            <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10 shadow-glow-sm">
              <LayoutGrid className="w-8 h-8 text-muted/50" />
            </div>
            <h3 className="text-lg font-bold text-foreground">{t('admin.tokens_view.empty_title')}</h3>
            <p className="text-muted text-sm max-w-xs mx-auto mt-1">{t('admin.tokens_view.empty_desc')}</p>
            <Button variant="ghost" size="sm" onClick={actions.clearFilters} className="mt-4 text-primary">
              {t('admin.tokens_view.clear_filters')}
            </Button>
          </div>
        ) : (
          <>
            <div className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tokenData.items.map((token) => (
                <Card key={token.id} className="p-0 bg-white/5 border-white/10 overflow-hidden shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all group backdrop-blur-md rounded-2xl flex flex-col">
                  <div className="p-5 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden shrink-0">
                        {token.logoUrl ? (
                          <img src={token.logoUrl} alt={token.symbol} className="w-full h-full object-cover" />
                        ) : (
                          <Coins className="w-6 h-6 text-primary" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">{token.name || t('admin.tokens_view.unknown_token')}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded border border-primary/20">
                            {token.symbol || '???'}
                          </span>
                          <span className="text-[10px] text-muted uppercase font-bold tracking-wider">
                            {token.chain?.name || chains?.items?.find(c => c.id === token.chainId)?.name || t('admin.tokens_view.unknown_chain')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => actions.handleOpenEdit(token)}
                        className="p-2 h-auto hover:bg-primary/20 text-primary rounded-lg"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => actions.setDeleteId(token.id)}
                        className="p-2 h-auto hover:bg-red-500/20 text-red-400 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="px-5 pb-5 mt-auto space-y-3">
                    <div className="flex items-center justify-between py-2 border-y border-white/5 text-[10px]">
                      <div className="space-y-1">
                        <span className="text-muted uppercase block">{t('admin.tokens_view.contract_address')}</span>
                        <span className="font-mono text-foreground truncate max-w-[120px] block select-all" title={token.contractAddress}>
                          {token.contractAddress || t('admin.tokens_view.native')}
                        </span>
                      </div>
                      <div className="text-right space-y-1">
                        <span className="text-muted uppercase block">{t('admin.tokens_view.min_amount')}</span>
                        <span className="font-bold text-foreground">{token.minAmount || '0'}</span>
                      </div>
                    </div>

                    <div className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide ${token.isActive ? 'text-accent-green bg-accent-green/10 border-accent-green/20' : 'text-red-400 bg-red-400/10 border-red-400/20'}`}>
                      <CheckCircle2 className="w-3 h-3" />
                      {token.isActive ? t('admin.tokens_view.active') : t('admin.tokens_view.inactive')}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="col-span-full">
              {tokenData.meta && (
                <Pagination
                  currentPage={tokenData.meta.page}
                  totalPages={tokenData.meta.totalPages}
                  onPageChange={actions.setPage}
                  isLoading={isTokensLoading}
                />
              )}
            </div>
          </>
        )}
      </div>

      <BaseModal
        isOpen={isModalOpen}
        onClose={actions.handleCloseModal}
        title={editingId ? t('admin.tokens_view.modal.edit_title') : t('admin.tokens_view.modal.add_title')}
        description={editingId ? t('admin.tokens_view.modal.edit_desc') : t('admin.tokens_view.modal.add_desc')}
        onConfirm={actions.handleSubmit}
        isConfirmLoading={isMutationPending}
        isConfirmDisabled={!formData.chainId || !formData.symbol || !formData.name}
      >
        <form onSubmit={actions.handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <ChainSelector
                label={t('admin.tokens_view.modal.target_blockchain')}
                chains={chains?.items || []}
                selectedChainId={formData.chainId}
                onSelect={(chain) => actions.setFormData({ ...formData, chainId: chain?.id || '' })}
                placeholder={t('admin.tokens_view.modal.target_blockchain_placeholder')}
              />
            </div>

            <Input
              label={t('admin.tokens_view.modal.token_name')}
              placeholder={t('admin.tokens_view.modal.token_name_placeholder')}
              value={formData.name}
              onChange={(e) => actions.setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label={t('admin.tokens_view.modal.symbol')}
              placeholder={t('admin.tokens_view.modal.symbol_placeholder')}
              value={formData.symbol}
              onChange={(e) => actions.setFormData({ ...formData, symbol: e.target.value })}
              required
            />
            <Input
              label={t('admin.tokens_view.modal.decimals')}
              type="number"
              value={formData.decimals}
              onChange={(e) => actions.setFormData({ ...formData, decimals: Number(e.target.value) })}
              required
            />
            <Input
              label={t('admin.tokens_view.modal.token_type')}
              placeholder={t('admin.tokens_view.modal.token_type_placeholder')}
              value={formData.type}
              onChange={(e) => actions.setFormData({ ...formData, type: e.target.value })}
              required
            />
            <Input
              label={t('admin.tokens_view.modal.min_amount')}
              placeholder={t('admin.tokens_view.modal.amount_placeholder')}
              type="number"
              value={formData.minAmount}
              onChange={(e) => actions.setFormData({ ...formData, minAmount: e.target.value })}
            />
            <Input
              label={t('admin.tokens_view.modal.max_amount')}
              placeholder={t('admin.tokens_view.modal.amount_placeholder')}
              type="number"
              value={formData.maxAmount}
              onChange={(e) => actions.setFormData({ ...formData, maxAmount: e.target.value })}
            />
            <div className="col-span-2">
              <Input
                label={t('admin.tokens_view.modal.contract_address')}
                placeholder={t('admin.tokens_view.modal.contract_address_placeholder')}
                value={formData.contractAddress}
                onChange={(e) => actions.setFormData({ ...formData, contractAddress: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <Input
                label={t('admin.tokens_view.modal.logo_url')}
                placeholder={t('admin.tokens_view.modal.logo_url_placeholder')}
                value={formData.logoUrl}
                onChange={(e) => actions.setFormData({ ...formData, logoUrl: e.target.value })}
              />
            </div>
          </div>
        </form>
      </BaseModal>

      <DeleteConfirmationModal
        isOpen={!!deleteId}
        onClose={() => actions.setDeleteId(null)}
        onConfirm={actions.handleDelete}
        title={t('admin.tokens_view.delete_modal.title')}
        description={t('admin.tokens_view.delete_modal.description')}
        isLoading={isMutationPending}
      />
    </div>
  );
};
