'use client';

import { useAdminRPCs } from './useAdminRPCs';
import { Card, Button, Input } from '@/presentation/components/atoms';
import { BaseModal, Pagination } from '@/presentation/components/molecules';
import { Server, Globe, Search, Edit2, Activity, Plus, Filter, LayoutGrid, CheckCircle2, AlertTriangle } from 'lucide-react';

export const AdminRPCsView = () => {
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
  } = state;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Server className="w-6 h-6 text-primary" />
            RPC Nodes
          </h1>
          <p className="text-sm text-muted">Manage and monitor blockchain RPC endpoints</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search RPC URL..."
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 w-full md:w-60 transition-all font-mono"
              value={searchTerm}
              onChange={(e) => actions.setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted" />
          </div>

          <div className="relative">
            <select
              className="pl-10 pr-8 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none min-w-[140px] cursor-pointer"
              value={filterChainId}
              onChange={(e) => actions.setFilterChainId(e.target.value)}
            >
              <option value="">All Chains</option>
              {chains?.items?.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <Filter className="absolute left-3 top-2.5 w-4 h-4 text-muted" />
          </div>

          <div className="relative">
            <select
              className="pl-10 pr-8 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none min-w-[120px] cursor-pointer"
              value={filterActive}
              onChange={(e) => actions.setFilterActive(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
            <Activity className="absolute left-3 top-2.5 w-4 h-4 text-muted" />
          </div>

          <Button onClick={actions.handleOpenAdd} size="sm" glow className="rounded-full px-5">
            <Plus className="w-4 h-4 mr-1" />
            Configure Node
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
            Loading RPC nodes...
          </div>
        ) : (!rpcData || rpcData.items.length === 0) ? (
          <div className="text-center py-20 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-md">
            <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10 shadow-glow-sm">
              <LayoutGrid className="w-8 h-8 text-muted/50" />
            </div>
            <h3 className="text-lg font-bold text-foreground">No nodes found</h3>
            <p className="text-muted text-sm max-w-xs mx-auto mt-1">Try adjusting your filters or search terms.</p>
            <Button variant="ghost" size="sm" onClick={actions.clearFilters} className="mt-4 text-primary">
              Clear all filters
            </Button>
          </div>
        ) : (
          <>
            {rpcData.items.map((rpc) => (
              <Card key={rpc.id} className="p-0 bg-white/5 border-white/10 overflow-hidden shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all group backdrop-blur-md rounded-2xl">
                <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4 min-w-[200px]">
                    <div className={`p-4 rounded-2xl border transition-all ${rpc.isActive ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                      }`}>
                      <Server className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        {rpc.chain?.name || `Chain ${rpc.chainId}`}
                        {rpc.priority === 0 && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/20 font-bold uppercase tracking-wider">Primary</span>
                        )}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted font-mono bg-black/20 px-1.5 py-0.5 rounded border border-white/5">
                          Chain ID: {rpc.chainId}
                        </span>
                        {rpc.chain?.symbol && (
                          <span className="text-[10px] text-primary/80 font-bold uppercase">{rpc.chain.symbol}</span>
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
                        Status: {rpc.isActive ? 'Active' : 'Inactive'}
                      </div>

                      {(rpc.errorCount ?? 0) > 0 && (
                        <div className="flex items-center gap-1.5 text-[10px] text-orange-400 font-bold px-2.5 py-1 rounded-full bg-orange-400/10 border border-orange-400/20 uppercase tracking-wide">
                          <AlertTriangle className="w-3 h-3" />
                          Errors: {rpc.errorCount}
                        </div>
                      )}

                      {rpc.lastErrorAt && (
                        <span className="text-[10px] text-muted">Last Error: {new Date(rpc.lastErrorAt).toLocaleString()}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => rpc.chain && actions.handleOpenEdit({ ...rpc.chain, rpcUrl: rpc.url })}
                      className="opacity-0 group-hover:opacity-100 transition-all hover:bg-primary/10 hover:text-primary rounded-xl"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Configure Chain
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

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
        title={editingChainId ? `Edit Connection - ${formData.name}` : 'Configure New RPC Node'}
        description={editingChainId ? 'Update connectivity parameters for this blockchain' : 'Select an existing chain to configure its RPC endpoint'}
        onConfirm={actions.handleSubmit}
        confirmLabel={editingChainId ? 'Save Changes' : 'Enable Connection'}
        isConfirmLoading={isUpdatePending}
        isConfirmDisabled={!formData.rpcUrl || !formData.explorerUrl || (!editingChainId && !selectedChainId)}
      >
        <form onSubmit={actions.handleSubmit} className="space-y-4">
          {!editingChainId && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted">Select Target Chain</label>
              <div className="relative">
                <select
                  className="w-full pl-4 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer"
                  value={selectedChainId}
                  onChange={(e) => actions.setSelectedChainId(e.target.value)}
                  required
                >
                  <option value="">Choose a blockchain...</option>
                  {chains?.items?.map((c: any) => (
                    <option key={c.id} value={c.id.toString()}>{c.name}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-4 pointer-events-none text-muted">
                  <Filter className="w-4 h-4" />
                </div>
              </div>
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
                  <p className="text-[10px] text-muted uppercase tracking-widest font-bold">Metadata from Database</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                <div>
                  <span className="text-[10px] text-muted uppercase block">Chain ID</span>
                  <span className="text-xs font-mono text-foreground">{formData.chainId}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted uppercase block">Symbol</span>
                  <span className="text-xs font-bold text-primary">{formData.symbol}</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4 pt-2">
            <Input
              label="Primary RPC URL"
              placeholder="https://..."
              value={formData.rpcUrl}
              onChange={(e) => actions.setFormData({ ...formData, rpcUrl: e.target.value })}
              required
              className="font-mono"
            />

            <Input
              label="Explorer URL"
              placeholder="https://polygonscan.com"
              value={formData.explorerUrl}
              onChange={(e) => actions.setFormData({ ...formData, explorerUrl: e.target.value })}
              required
            />
          </div>
          <p className="text-xs text-muted text-center italic">
            Note: Updating will set this URL as the primary RPC for the chain.
          </p>
          <button type="submit" className="hidden" />
        </form>
      </BaseModal>
    </div>
  );
};
