'use client';

import { useAdminTokens } from './useAdminTokens';
import { Card, Button, Input } from '@/presentation/components/atoms';
import { BaseModal, DeleteConfirmationModal, Pagination } from '@/presentation/components/molecules';
import { Coins, Search, Filter, LayoutGrid, CheckCircle2, Plus, Edit2, Trash2 } from 'lucide-react';

export const AdminTokensView = () => {
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
            Supported Tokens
          </h1>
          <p className="text-sm text-muted">Manage tokens supported on each chain</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search symbol or address..."
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 w-full md:w-64 transition-all"
              value={searchTerm}
              onChange={(e) => actions.setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted" />
          </div>

          <div className="relative">
            <select
              className="pl-10 pr-8 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none min-w-[160px] cursor-pointer"
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

          <Button onClick={actions.handleOpenAdd} size="sm" glow className="rounded-full px-5">
            <Plus className="w-4 h-4 mr-1" />
            Add Token
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
            Loading tokens...
          </div>
        ) : (!tokenData || !tokenData.items || tokenData.items.length === 0) ? (
          <div className="col-span-full text-center py-20 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-md">
            <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10 shadow-glow-sm">
              <LayoutGrid className="w-8 h-8 text-muted/50" />
            </div>
            <h3 className="text-lg font-bold text-foreground">No tokens found</h3>
            <p className="text-muted text-sm max-w-xs mx-auto mt-1">Try adjusting your filters or search terms.</p>
            <Button variant="ghost" size="sm" onClick={actions.clearFilters} className="mt-4 text-primary">
              Clear all filters
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
                        {token.token?.logoUrl ? (
                          <img src={token.token.logoUrl} alt={token.token.symbol} className="w-full h-full object-cover" />
                        ) : (
                          <Coins className="w-6 h-6 text-primary" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">{token.token?.name || 'Unknown Token'}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded border border-primary/20">
                            {token.token?.symbol || '???'}
                          </span>
                          <span className="text-[10px] text-muted uppercase font-bold tracking-wider">
                            {token.chain?.name || 'Unknown Chain'}
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
                        <span className="text-muted uppercase block">Contract Address</span>
                        <span className="font-mono text-foreground truncate max-w-[120px] block select-all" title={token.contractAddress}>
                          {token.contractAddress || 'Native'}
                        </span>
                      </div>
                      <div className="text-right space-y-1">
                        <span className="text-muted uppercase block">Min Amount</span>
                        <span className="font-bold text-foreground">{token.minAmount || '0'}</span>
                      </div>
                    </div>

                    <div className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide ${token.isActive ? 'text-accent-green bg-accent-green/10 border-accent-green/20' : 'text-red-400 bg-red-400/10 border-red-400/20'}`}>
                      <CheckCircle2 className="w-3 h-3" />
                      {token.isActive ? 'Active' : 'Inactive'}
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
        title={editingId ? 'Edit Supported Token' : 'Add Supported Token'}
        description={editingId ? 'Update configuration for this token support' : 'Add a new token to be supported on a specific chain'}
        onConfirm={actions.handleSubmit}
        isConfirmLoading={isMutationPending}
        isConfirmDisabled={!formData.chainId || !formData.symbol || !formData.name}
      >
        <form onSubmit={actions.handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-muted">Target Blockchain</label>
              <select
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer"
                value={formData.chainId}
                onChange={(e) => actions.setFormData({ ...formData, chainId: e.target.value })}
                required
              >
                <option value="">Select a chain...</option>
                {chains?.items?.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <Input
              label="Token Name"
              placeholder="e.g. Tether USD"
              value={formData.name}
              onChange={(e) => actions.setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Symbol"
              placeholder="e.g. USDT"
              value={formData.symbol}
              onChange={(e) => actions.setFormData({ ...formData, symbol: e.target.value })}
              required
            />
            <Input
              label="Decimals"
              type="number"
              value={formData.decimals}
              onChange={(e) => actions.setFormData({ ...formData, decimals: Number(e.target.value) })}
              required
            />
            <Input
              label="Token Type"
              placeholder="ERC20, BEP20, etc."
              value={formData.type}
              onChange={(e) => actions.setFormData({ ...formData, type: e.target.value })}
              required
            />
            <div className="col-span-2">
              <Input
                label="Contract Address"
                placeholder="0x... (leave empty for native tokens)"
                value={formData.contractAddress}
                onChange={(e) => actions.setFormData({ ...formData, contractAddress: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <Input
                label="Logo URL"
                placeholder="https://..."
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
        title="Remove Token Support"
        description="Are you sure you want to remove support for this token? This will not delete the token itself, but it will no longer be available for payments on this chain."
        isLoading={isMutationPending}
      />
    </div>
  );
};
