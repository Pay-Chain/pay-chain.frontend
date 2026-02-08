'use client';

import { useAdminChains, useCreateChain, useUpdateChain } from '@/data/usecase/useAdmin';
import { Card, Button, Input } from '@/presentation/components/atoms';
import { BaseModal } from '@/presentation/components/molecules';
import { Server, Globe, Search, Edit2, Activity, ShieldCheck, Plus, Filter, LayoutGrid, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export const AdminRPCsView = () => {
  const { data: chains, isLoading } = useAdminChains();
  const updateChain = useUpdateChain();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedChainId, setSelectedChainId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    chainId: '', // CAIP-2 format
    rpcUrl: '',
    explorerUrl: '',
    symbol: '',
  });

  // When selectedChainId changes in Add mode, populate read-only fields
  useEffect(() => {
    if (!editingId && selectedChainId) {
      const chain = chains?.find((c: any) => c.id.toString() === selectedChainId);
      if (chain) {
        setFormData({
          name: chain.name,
          chainId: chain.caip2 || `eip155:${chain.id}`,
          rpcUrl: chain.rpcUrl || '',
          explorerUrl: chain.explorerUrl || '',
          symbol: chain.symbol || '',
        });
      }
    }
  }, [selectedChainId, editingId, chains]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setSelectedChainId('');
    setFormData({ name: '', chainId: '', rpcUrl: '', explorerUrl: '', symbol: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (chain: any) => {
    setEditingId(chain.id);
    setSelectedChainId(chain.id.toString());
    
    // Construct CAIP-2 ID for display if missing
    let caip2Id = chain.caip2;
    if (!caip2Id) {
       const namespace = chain.chainType === 'EVM' ? 'eip155' : 'solana';
       caip2Id = `${namespace}:${chain.id}`;
    }

    setFormData({
      name: chain.name,
      chainId: caip2Id,
      rpcUrl: chain.rpcUrl || '',
      explorerUrl: chain.explorerUrl || '',
      symbol: chain.symbol || '',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    const targetId = editingId || parseInt(selectedChainId);
    if (!targetId) {
        toast.error('Please select a chain first');
        return;
    }

    // Determine namespace based on chain data indirectly if needed, 
    // but here we just pass the payload to update since the chain exists.
    const payload = {
      ...formData,
      id: targetId,
    };

    updateChain.mutate({ id: targetId, data: payload }, {
      onSuccess: () => {
        handleCloseModal();
        toast.success(`RPC connection updated for ${formData.name}`);
      },
      onError: (err: any) => {
        toast.error(err.message || 'Failed to update connection');
      }
    });
  };

  const filteredChains = chains?.filter((chain: any) => {
    const matchesSearch = 
      chain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chain.symbol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (chain.caip2 || chain.id.toString()).includes(searchTerm);
    
    const matchesType = !filterType || chain.chainType === filterType;
    
    return matchesSearch && matchesType;
  }) || [];

  if (isLoading) return <div className="p-8 text-center text-muted text-sm flex items-center justify-center gap-2">
    <Activity className="w-4 h-4 animate-pulse text-primary" />
    Loading RPC nodes...
  </div>;

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
              placeholder="Search nodes..."
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 w-full md:w-60 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted" />
          </div>

          <div className="relative">
            <select
              className="pl-10 pr-8 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none min-w-[140px] cursor-pointer"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="EVM">EVM Chains</option>
              <option value="SVM">SVM (Solana)</option>
            </select>
            <Filter className="absolute left-3 top-2.5 w-4 h-4 text-muted" />
          </div>

          <Button onClick={handleOpenAdd} size="sm" glow className="rounded-full px-5">
            <Plus className="w-4 h-4 mr-1" />
            Configure Node
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredChains.length === 0 ? (
          <div className="text-center py-20 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-md">
            <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10 shadow-glow-sm">
              <LayoutGrid className="w-8 h-8 text-muted/50" />
            </div>
            <h3 className="text-lg font-bold text-foreground">No nodes found</h3>
            <p className="text-muted text-sm max-w-xs mx-auto mt-1">Try adjusting your filters or search terms to find what you're looking for.</p>
            <Button variant="ghost" size="sm" onClick={() => { setSearchTerm(''); setFilterType(''); }} className="mt-4 text-primary">
              Clear all filters
            </Button>
          </div>
        ) : (
          filteredChains.map((chain: any) => (
            <Card key={chain.id} className="p-0 bg-white/5 border-white/10 overflow-hidden shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all group backdrop-blur-md rounded-2xl">
              <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl border transition-all ${
                    chain.chainType === 'EVM' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                  }`}>
                    <Server className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      {chain.name}
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-muted uppercase tracking-widest font-black border border-white/5">
                        {chain.chainType}
                      </span>
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted font-mono bg-black/20 px-1.5 py-0.5 rounded border border-white/5">
                        {chain.caip2 || `eip155:${chain.id}`}
                      </span>
                      {chain.symbol && (
                        <span className="text-[10px] text-primary/80 font-bold uppercase">{chain.symbol}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex-1 max-w-xl">
                  <div className="flex items-center gap-2 text-sm text-foreground/80 mb-2 group-hover:text-foreground transition-colors">
                    <div className="p-1 rounded bg-accent-green/10 text-accent-green">
                      <Globe className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-mono truncate select-all">{chain.rpcUrl || 'No RPC configured'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-[10px] text-accent-green font-bold px-2.5 py-1 rounded-full bg-accent-green/10 border border-accent-green/20 uppercase tracking-wide">
                      <Activity className="w-3 h-3" />
                      Status: Active
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-blue-400 font-bold px-2.5 py-1 rounded-full bg-blue-400/10 border border-blue-400/20 uppercase tracking-wide">
                      <ShieldCheck className="w-3 h-3" />
                      Verified
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleOpenEdit(chain)}
                    className="opacity-0 group-hover:opacity-100 transition-all hover:bg-primary/10 hover:text-primary rounded-xl"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Manage Node
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <BaseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingId ? `Edit Connection - ${formData.name}` : 'Configure New RPC Node'}
        description={editingId ? 'Update connectivity parameters for this blockchain' : 'Select an existing chain to configure its RPC endpoint'}
        onConfirm={handleSubmit}
        confirmLabel={editingId ? 'Save Changes' : 'Enable Connection'}
        isConfirmLoading={updateChain.isPending}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {!editingId && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted">Select Target Chain</label>
              <div className="relative">
                <select
                  className="w-full pl-4 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer"
                  value={selectedChainId}
                  onChange={(e) => setSelectedChainId(e.target.value)}
                  required
                >
                  <option value="">Choose a blockchain...</option>
                  {chains?.map((c: any) => (
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
              onChange={(e) => setFormData({ ...formData, rpcUrl: e.target.value })}
              required
              className="font-mono"
            />

            <Input
              label="Explorer URL"
              placeholder="https://polygonscan.com"
              value={formData.explorerUrl}
              onChange={(e) => setFormData({ ...formData, explorerUrl: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="hidden" />
        </form>
      </BaseModal>
    </div>
  );
};
