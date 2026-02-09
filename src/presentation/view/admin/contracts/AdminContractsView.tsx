'use client';

import { useAdminContracts } from './useAdminContracts';
import { Card, Button, Input } from '@/presentation/components/atoms';
import { BaseModal, DeleteConfirmationModal, Pagination } from '@/presentation/components/molecules';
import { Plus, Trash2, Code, ShieldCheck, ArrowRightLeft, Search, Filter, Edit2, LayoutGrid } from 'lucide-react';

export const AdminContractsView = () => {
  const { state, actions } = useAdminContracts();
  const {
    searchTerm,
    filterChain,
    chains,
    filteredContracts,
    isContractsLoading,
    isModalOpen,
    editingId,
    deleteId,
    formData,
    isMutationPending,
    page,
    limit,
    meta,
  } = state;
  const { setPage } = actions;

  const CONTRACT_TYPES = [
    { value: 'GATEWAY', label: 'PayChain Gateway' },
    { value: 'CCIP_ROUTER', label: 'CCIP Router' },
    { value: 'HYPERBRIDGE_ROUTER', label: 'Hyperbridge Router' },
    { value: 'DEX_POOL', label: 'DEX Pool' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Smart Contract Registry</h1>
          <p className="text-muted">Manage Gateways, Routers, and Liquidity Pools</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search contracts..."
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 w-full md:w-64 transition-all text-sm"
              value={searchTerm}
              onChange={(e) => actions.setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted" />
          </div>

          <div className="relative">
            <select
              className="pl-10 pr-8 py-2 bg-white/5 border border-white/10 rounded-full text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none min-w-[160px] cursor-pointer text-sm"
              value={filterChain}
              onChange={(e) => actions.setFilterChain(e.target.value)}
            >
              <option value="">All Chains</option>
              {chains?.items?.map((chain: any) => (
                <option key={chain.id} value={chain.id}>
                  {chain.name}
                </option>
              ))}
            </select>
            <Filter className="absolute left-3 top-2.5 w-4 h-4 text-muted" />
          </div>

          <Button onClick={actions.handleOpenAdd} size="sm" glow className="rounded-full px-5">
            <Plus className="w-4 h-4 mr-1" />
            Add Contract
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isContractsLoading ? (
          <div className="col-span-full p-12 text-center text-muted text-sm flex flex-col items-center justify-center gap-4 border border-white/5 rounded-2xl bg-white/5">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
              <Code className="w-8 h-8 text-primary relative z-10" />
            </div>
            Loading contracts...
          </div>
        ) : filteredContracts.length === 0 ? (
          <div className="col-span-full text-center py-20 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-md">
            <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10 shadow-glow-sm">
              <LayoutGrid className="w-8 h-8 text-muted/50" />
            </div>
            <h3 className="text-lg font-bold text-foreground">No contracts found</h3>
            <p className="text-muted text-sm max-w-xs mx-auto mt-1">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          filteredContracts.map((contract: any) => (
             <Card key={contract.id} className="p-0 bg-white/5 border-white/10 hover:border-primary/50 transition-all group relative backdrop-blur-md rounded-2xl flex flex-col overflow-hidden">
                <div className="p-5 flex items-start gap-4">
                  <div className={`p-3 rounded-xl ring-1 shrink-0 ${
                    contract.type === 'GATEWAY' ? 'bg-purple-500/20 text-purple-400 ring-purple-500/30' :
                    contract.type === 'DEX_POOL' ? 'bg-green-500/20 text-green-400 ring-green-500/30' :
                    'bg-blue-500/20 text-blue-400 ring-blue-500/30'
                  }`}>
                    {contract.type === 'GATEWAY' ? <ShieldCheck className="w-6 h-6" /> :
                     contract.type === 'DEX_POOL' ? <ArrowRightLeft className="w-6 h-6" /> :
                     <Code className="w-6 h-6" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors">{contract.name}</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-muted uppercase tracking-widest font-bold border border-white/5">
                        {contract.chainId}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-muted uppercase tracking-widest font-bold border border-white/5">
                        {contract.type?.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button
                      onClick={() => actions.handleOpenEdit(contract)}
                      className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title="Edit Contract"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => actions.setDeleteId(contract.id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete Contract"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="px-5 pb-5 mt-auto">
                  <p 
                    className="font-mono text-xs text-muted truncate w-full cursor-help py-3 px-3 bg-black/40 rounded-xl border border-white/5 select-all" 
                    title={contract.contractAddress}
                  >
                    {contract.contractAddress}
                  </p>
                </div>
             </Card>
          ))
        )}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination
            currentPage={page}
            totalPages={meta.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      <BaseModal
        isOpen={isModalOpen}
        onClose={actions.handleCloseModal}
        title={editingId ? 'Edit Contract' : 'Register New Contract'}
        description={editingId ? 'Update smart contract details' : 'Add a new contract to the platform registry'}
        onConfirm={actions.handleSubmit}
        confirmLabel={editingId ? 'Update Contract' : 'Register Contract'}
        isConfirmLoading={isMutationPending}
        isConfirmDisabled={!formData.name || !formData.contractAddress || !formData.chainId}
      >
        <form onSubmit={actions.handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted">Contract Type</label>
            <div className="grid grid-cols-2 gap-2">
              {CONTRACT_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => actions.setFormData({ ...formData, type: type.value })}
                  className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                    formData.type === type.value
                      ? 'bg-primary/20 border-primary text-primary shadow-glow-sm'
                      : 'bg-black/20 border-white/10 text-muted hover:border-white/30'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Contract Name"
              placeholder="e.g. Main Gateway V1"
              value={formData.name}
              onChange={(e) => actions.setFormData({ ...formData, name: e.target.value })}
              required
            />
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted">Chain</label>
              <select
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none text-sm h-11"
                value={formData.chainId}
                onChange={(e) => actions.setFormData({ ...formData, chainId: e.target.value })}
                required
              >
                <option value="" disabled>Select Chain</option>
                {chains?.items?.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <Input
            label="Contract Address"
            placeholder="0x..."
            value={formData.contractAddress}
            onChange={(e) => actions.setFormData({ ...formData, contractAddress: e.target.value })}
            required
            className="font-mono"
          />
          
          <button type="submit" className="hidden" />
        </form>
      </BaseModal>

      <DeleteConfirmationModal
        isOpen={!!deleteId}
        onClose={() => actions.setDeleteId(null)}
        onConfirm={actions.handleDelete}
        title="Delete Contract?"
        description="Are you sure you want to remove this contract from the registry? This action cannot be undone."
        isLoading={isMutationPending}
      />
    </div>
  );
};
