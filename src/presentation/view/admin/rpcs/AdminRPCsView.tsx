'use client';

import { useAdminRPCs } from './useAdminRPCs';
import { Card, Button, Input } from '@/presentation/components/atoms';
import { BaseModal, Pagination } from '@/presentation/components/molecules';
import { ChainSelector } from '@/presentation/components/organisms';
import { useTranslation } from '@/presentation/hooks';
import { Server, Globe, Search, Edit2, Activity, Plus, Filter, LayoutGrid, CheckCircle2, AlertTriangle, Trash2 } from 'lucide-react';

export const AdminRPCsView = () => {
  const { t } = useTranslation();
  const { state, actions } = useAdminRPCs();
  const {
    searchTerm,
    filterChainId,
    filterActive,
    rpcData,
    isRpcLoading,
    chains,
    isModalOpen,
    editingChainId,
    selectedChainId,
    formData,
    isUpdatePending,
    isDeleteModalOpen,
    isDeletePending,
  } = state;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Server className="w-6 h-6 text-primary" />
            {t('admin.rpcs_view.title')}
          </h1>
          <p className="text-sm text-muted">{t('admin.rpcs_view.subtitle')}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder={t('admin.rpcs_view.search_placeholder')}
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 w-full md:w-60 transition-all font-mono"
              value={searchTerm}
              onChange={(e) => actions.setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted" />
          </div>

          <div className="w-[160px]">
             <ChainSelector
                chains={chains?.items || []}
                selectedChainId={filterChainId}
                onSelect={(chain) => actions.setFilterChainId(chain?.id || '')}
                placeholder={t('admin.rpcs_view.all_chains')}
            />
          </div>

          <div className="relative">
            <select
              className="pl-10 pr-8 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none min-w-[120px] cursor-pointer"
              value={filterActive}
              onChange={(e) => actions.setFilterActive(e.target.value)}
            >
              <option value="">{t('admin.rpcs_view.all_status')}</option>
              <option value="true">{t('admin.rpcs_view.active')}</option>
              <option value="false">{t('admin.rpcs_view.inactive')}</option>
            </select>
            <Activity className="absolute left-3 top-2.5 w-4 h-4 text-muted" />
          </div>

          <Button onClick={actions.handleOpenAdd} size="sm" glow className="rounded-full px-5">
            <Plus className="w-4 h-4 mr-1" />
            {t('admin.rpcs_view.configure_node')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isRpcLoading ? (
          <div className="p-12 text-center text-muted text-sm flex flex-col items-center justify-center gap-4 border border-white/5 rounded-2xl bg-white/5">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
              <Server className="w-8 h-8 text-primary relative z-10" />
            </div>
            {t('admin.rpcs_view.loading')}
          </div>
        ) : (!rpcData || rpcData.items.length === 0) ? (
          <div className="text-center py-20 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-md">
            <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10 shadow-glow-sm">
              <LayoutGrid className="w-8 h-8 text-muted/50" />
            </div>
            <h3 className="text-lg font-bold text-foreground">{t('admin.rpcs_view.empty_title')}</h3>
            <p className="text-muted text-sm max-w-xs mx-auto mt-1">{t('admin.rpcs_view.empty_desc')}</p>
            <Button variant="ghost" size="sm" onClick={actions.clearFilters} className="mt-4 text-primary">
              {t('admin.rpcs_view.clear_filters')}
            </Button>
          </div>
        ) : (
          <>
            {rpcData.items.map((rpc) => {
              const effectiveChain = chains?.items?.find(c => c.id === rpc.chainId);
              const chainName = rpc.chain?.name || effectiveChain?.name || `${t('admin.rpcs_view.chain_fallback_prefix')} ${rpc.chainId.substring(0, 8)}...`;
              const chainSymbol = rpc.chain?.symbol || effectiveChain?.symbol;
              const displayId = effectiveChain?.networkId || effectiveChain?.caip2 || rpc.chainId;

              return (
                <Card key={rpc.id} className="p-0 bg-white/5 border-white/10 overflow-hidden shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all group backdrop-blur-md rounded-2xl">
                  <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4 min-w-[200px]">
                      <div className={`p-4 rounded-2xl border transition-all ${rpc.isActive ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                        }`}>
                        <Server className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg flex items-center gap-2">
                          {chainName}
                          {rpc.priority === 0 && (
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/20 font-bold uppercase tracking-wider">{t('admin.rpcs_view.primary')}</span>
                          )}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-muted font-mono bg-black/20 px-1.5 py-0.5 rounded border border-white/5">
                            {t('admin.rpcs_view.chain_id')}: {displayId}
                          </span>
                          {chainSymbol && (
                            <span className="text-[10px] text-primary/80 font-bold uppercase">{chainSymbol}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 max-w-xl">
                      <div className="flex items-center gap-2 text-sm text-foreground/80 mb-2 group-hover:text-foreground transition-colors overflow-hidden">
                        <div className="p-1 rounded bg-accent-green/10 text-accent-green shrink-0">
                          <Globe className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-mono truncate select-all" title={rpc.url}>{rpc.url}</span>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide ${rpc.isActive ? 'text-accent-green bg-accent-green/10 border-accent-green/20' : 'text-red-400 bg-red-400/10 border-red-400/20'
                          }`}>
                          <Activity className="w-3 h-3" />
                          {t('admin.rpcs_view.status_label')}: {rpc.isActive ? t('admin.rpcs_view.active') : t('admin.rpcs_view.inactive')}
                        </div>

                        {(rpc.errorCount ?? 0) > 0 && (
                          <div className="flex items-center gap-1.5 text-[10px] text-orange-400 font-bold px-2.5 py-1 rounded-full bg-orange-400/10 border border-orange-400/20 uppercase tracking-wide">
                            <AlertTriangle className="w-3 h-3" />
                            {t('admin.rpcs_view.errors_label')}: {rpc.errorCount}
                          </div>
                        )}

                        {rpc.lastErrorAt && (
                          <span className="text-[10px] text-muted">{t('admin.rpcs_view.last_error_label')}: {new Date(rpc.lastErrorAt).toLocaleString()}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => actions.handleOpenEdit(rpc)}
                        className="opacity-0 group-hover:opacity-100 transition-all hover:bg-primary/10 hover:text-primary rounded-xl"
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        {t('admin.rpcs_view.configure_chain')}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => actions.handleOpenDelete(rpc)} 
                        className="opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/10 hover:text-red-500 rounded-xl"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}

            {rpcData.meta && (
              <Pagination
                currentPage={rpcData.meta.page}
                totalPages={rpcData.meta.totalPages}
                onPageChange={actions.setPage}
                isLoading={isRpcLoading}
              />
            )}
          </>
        )}
      </div>

      <BaseModal
        isOpen={isModalOpen}
        onClose={actions.handleCloseModal}
        title={editingChainId ? `${t('admin.rpcs_view.edit_connection_title')} - ${formData.name}` : t('admin.rpcs_view.configure_new_title')}
        description={editingChainId ? t('admin.rpcs_view.edit_connection_desc') : t('admin.rpcs_view.configure_new_desc')}
        onConfirm={actions.handleSubmit}
        confirmLabel={editingChainId ? t('admin.rpcs_view.save_changes') : t('admin.rpcs_view.enable_connection')}
        isConfirmLoading={isUpdatePending}
        isConfirmDisabled={!formData.rpcUrl || !formData.explorerUrl || (!editingChainId && !selectedChainId)}
      >
        <form onSubmit={actions.handleSubmit} className="space-y-4">
          {!editingChainId && (
            <div className="space-y-2">
              <ChainSelector
                label={t('admin.rpcs_view.select_target_chain')}
                chains={chains?.items || []}
                selectedChainId={selectedChainId}
                onSelect={actions.handleChainSelect}
                placeholder={t('admin.rpcs_view.choose_blockchain')}
              />
            </div>
          )}

          {formData.name && (
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-3 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">{formData.name}</h4>
                  <p className="text-[10px] text-muted uppercase tracking-widest font-bold">{t('admin.rpcs_view.metadata_from_db')}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                <div>
                  <span className="text-[10px] text-muted uppercase block">{t('admin.rpcs_view.metadata_chain_id')}</span>
                  <span className="text-xs font-mono text-foreground">{formData.chainId}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted uppercase block">{t('admin.rpcs_view.metadata_symbol')}</span>
                  <span className="text-xs font-bold text-primary">{formData.symbol}</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4 pt-2">
            <Input
              label={t('admin.rpcs_view.primary_rpc_url')}
              placeholder={t('admin.rpcs_view.primary_rpc_url_placeholder')}
              value={formData.rpcUrl}
              onChange={(e) => actions.setFormData({ ...formData, rpcUrl: e.target.value })}
              required
              className="font-mono"
            />

            <Input
              label={t('admin.rpcs_view.explorer_url')}
              placeholder={t('admin.rpcs_view.explorer_url_placeholder')}
              value={formData.explorerUrl}
              onChange={(e) => actions.setFormData({ ...formData, explorerUrl: e.target.value })}
              required
            />
          </div>
          <p className="text-xs text-muted text-center italic">
            {t('admin.rpcs_view.note_primary_rpc')}
          </p>
          <button type="submit" className="hidden" />
        </form>
      </BaseModal>

      <BaseModal
        isOpen={isDeleteModalOpen}
        onClose={actions.handleCloseModal}
        title={`${t('admin.rpcs_view.remove_chain_title')} - ${formData.name}`}
        description={t('admin.rpcs_view.remove_chain_desc')}
        onConfirm={actions.handleDelete}
        confirmLabel={t('admin.rpcs_view.remove_chain_confirm')}
        isConfirmLoading={isDeletePending}
        isConfirmDisabled={false}
      >
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
                <h4 className="text-sm font-bold text-red-500">{t('admin.rpcs_view.warning_title')}</h4>
                <p className="text-xs text-red-400/90">
                  {t('admin.rpcs_view.warning_desc')}
                </p>
            </div>
        </div>
      </BaseModal>
    </div>
  );
};
