'use client';

import { useAdminChains, useCreateChain, useDeleteChain, useUpdateChain } from '@/data/usecase/useAdmin';
import { Card, Button, Input } from '@/presentation/components/atoms';
import { BaseModal, DeleteConfirmationModal } from '@/presentation/components/molecules';
import { Plus, Trash2, Globe, ExternalLink, Search, Edit2 } from 'lucide-react';
import { useState } from 'react';

export const AdminChainsView = () => {
  const { data: chains, isLoading } = useAdminChains();
  const createChain = useCreateChain();
  const updateChain = useUpdateChain();
  const deleteChain = useDeleteChain();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    chainId: '', // CAIP-2 format: eip155:1 or solana:5ey...
    rpcUrl: '',
    explorerUrl: '',
    symbol: '',
    logoUrl: '',
  });

  const filteredChains = chains?.filter((chain: any) => 
    chain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chain.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (chain.caip2 || chain.id.toString()).includes(searchTerm)
  ) || [];

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ name: '', chainId: '', rpcUrl: '', explorerUrl: '', symbol: '', logoUrl: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (chain: any) => {
    setEditingId(chain.id);
    // Construct CAIP-2 ID for display
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
      logoUrl: chain.logoUrl || '',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    // Parse CAIP-2 ID
    const [namespace, reference] = formData.chainId.split(':');
    
    if (!namespace || !reference) {
        alert('Invalid Chain ID format. Use format: eip155:1 or solana:mainnet-beta');
        return;
    }

    let chainType = 'EVM';
    let id = 0;

    if (namespace.toLowerCase() === 'eip155') {
        chainType = 'EVM';
        id = parseInt(reference, 10);
    } else if (namespace.toLowerCase() === 'solana') {
        chainType = 'SVM';
        // For Solana, the backend currently expects an int ID.
        // If the reference is not an int, this might fail on backend validation if it strictly requires int ID.
        // However, user prompt implies we want to support this input format.
        // Given previous backend code: ID is int.
        // If strict int ID is required by backend, we must parse int. 
        // If reference is a hash (Solana), backend might need update or we map hash to an int ID internally?
        // Let's assume for now reference is the numeric ID for eip155, and for Solana we might need to handle it.
        // BUT, looking at backend handler: `ID int`.
        // So for now, we MUST extract an integer from the reference.
        // If the user inputs `solana:5`, id=5.
        // If user inputs `solana:5ey...`, parseInt will be NaN/Partial.
        id = parseInt(reference, 10); 
    } else {
         alert('Unsupported namespace. Use eip155 or solana.');
         return;
    }

    if (isNaN(id)) {
        alert('Chain ID reference must be a number for now.');
        return;
    }

    const payload = {
      name: formData.name,
      id: id,
      chainType: chainType,
      rpcUrl: formData.rpcUrl,
      explorerUrl: formData.explorerUrl,
      symbol: formData.symbol,
      logoUrl: formData.logoUrl,
    };

    
    if (editingId) {
      updateChain.mutate({ id: editingId, data: payload }, {
        onSuccess: handleCloseModal,
      });
    } else {
      createChain.mutate(payload, {
        onSuccess: handleCloseModal,
      });
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteChain.mutate(deleteId, {
        onSuccess: () => setDeleteId(null),
      });
    }
  };

  if (isLoading) return <div className="p-8 text-center text-muted">Loading chains...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Chain Configuration</h1>
          <p className="text-muted">Manage supported blockchains and RPCs</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search chains..."
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 w-full md:w-64 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted" />
          </div>
          <Button onClick={handleOpenAdd} size="sm" glow>
            <Plus className="w-4 h-4" />
            Add Chain
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredChains.length === 0 && (
          <div className="col-span-full text-center py-12 border border-white/10 rounded-xl bg-white/5">
            <p className="text-muted">No chains found matching your search.</p>
          </div>
        )}
        {filteredChains.map((chain: any) => (
          <Card key={chain.id} className="p-6 bg-white/5 border-white/10 hover:border-primary/50 transition-all group relative overflow-hidden backdrop-blur-sm">
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <button
                onClick={() => handleOpenEdit(chain)}
                className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                title="Edit Chain"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeleteId(chain.id)}
                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Delete Chain"
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
                <span>Chain ID</span>
                <span className="font-mono text-foreground">{chain.caip2 || chain.id}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span>Symbol</span>
                <span className="text-foreground font-medium">{chain.symbol}</span>
              </div>
              <div className="pt-1">
                <a 
                  href={chain.explorerUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors text-xs font-semibold"
                >
                  Open Explorer <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <BaseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingId ? 'Edit Chain' : 'Add New Chain'}
        description={editingId ? 'Update blockchain configuration' : 'Configure a new blockchain for the platform'}
        onConfirm={handleSubmit}
        confirmLabel={editingId ? 'Update Chain' : 'Save Chain'}
        isConfirmLoading={createChain.isPending || updateChain.isPending}
      >
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Chain Name"
            placeholder="e.g. Ethereum"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="md:col-span-2"
          />
          <Input
            label="Chain ID (CAIP-2)"
            placeholder="e.g. eip155:1 or solana:5"
            value={formData.chainId}
            onChange={(e) => setFormData({ ...formData, chainId: e.target.value })}
            required
            className="md:col-span-2"
            description="Format: <namespace>:<reference>. Example: eip155:1 for Ethereum Mainnet."
          />
          <Input
            label="RPC URL"
            placeholder="https://..."
            value={formData.rpcUrl}
            onChange={(e) => setFormData({ ...formData, rpcUrl: e.target.value })}
            required
            className="md:col-span-2"
          />
          <Input
            label="Explorer URL"
            placeholder="https://etherscan.io"
            value={formData.explorerUrl}
            onChange={(e) => setFormData({ ...formData, explorerUrl: e.target.value })}
            required
            className="md:col-span-2"
          />
          <Input
            label="Currency Symbol"
            placeholder="e.g. ETH"
            value={formData.symbol}
            onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
            required
          />
          <Input
            label="Logo URL"
            placeholder="e.g. https://.../eth.png"
            value={formData.logoUrl}
            onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
          />
          <button type="submit" className="hidden" />
        </form>
      </BaseModal>

      <DeleteConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Chain?"
        description="Are you sure you want to delete this blockchain? This will affect all contracts associated with it."
        isLoading={deleteChain.isPending}
      />
    </div>
  );
};
