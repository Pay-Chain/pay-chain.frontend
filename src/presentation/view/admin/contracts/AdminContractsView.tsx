import { useAdminContracts, useCreateContract, useDeleteContract, useUpdateContract, useAdminChains } from '@/data/usecase/useAdmin';
import { Card, Button, Input } from '@/presentation/components/atoms';
import { BaseModal, DeleteConfirmationModal } from '@/presentation/components/molecules';
import { Plus, Trash2, Code, ShieldCheck, ArrowRightLeft, Search, Filter, Edit2 } from 'lucide-react';
import { useState } from 'react';

export const AdminContractsView = () => {
  const { data: contracts, isLoading } = useAdminContracts();
  const { data: chains } = useAdminChains();
  const createContract = useCreateContract();
  const updateContract = useUpdateContract();
  const deleteContract = useDeleteContract();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterChain, setFilterChain] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    chainId: '',
    type: 'GATEWAY',
  });

  const filteredContracts = contracts?.filter((c: any) => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChain = !filterChain || c.chainId.toString() === filterChain;
    return matchesSearch && matchesChain;
  }) || [];

  const CONTRACT_TYPES = [
    { value: 'GATEWAY', label: 'PayChain Gateway' },
    { value: 'CCIP_ROUTER', label: 'CCIP Router' },
    { value: 'HYPERBRIDGE_ROUTER', label: 'Hyperbridge Router' },
    { value: 'DEX_POOL', label: 'DEX Pool' },
  ];

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ name: '', address: '', chainId: '', type: 'GATEWAY' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (contract: any) => {
    setEditingId(contract.id);
    setFormData({
      name: contract.name,
      address: contract.address,
      chainId: contract.chainId || '',
      type: contract.type || 'GATEWAY',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (editingId) {
      updateContract.mutate({ id: editingId, data: formData }, {
        onSuccess: handleCloseModal,
      });
    } else {
      createContract.mutate(formData, {
        onSuccess: handleCloseModal,
      });
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteContract.mutate(deleteId, {
        onSuccess: () => setDeleteId(null),
      });
    }
  };

  if (isLoading) return <div className="p-8 text-center text-muted">Loading contracts...</div>;

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
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 w-full md:w-64 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted" />
          </div>

          <div className="relative">
            <select
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none min-w-[160px] cursor-pointer"
              value={filterChain}
              onChange={(e) => setFilterChain(e.target.value)}
            >
              <option value="">All Chains</option>
              {chains?.map((chain: any) => (
                <option key={chain.id} value={chain.caip2 || chain.id.toString()}>
                  {chain.name}
                </option>
              ))}
            </select>
            <Filter className="absolute left-3 top-2.5 w-4 h-4 text-muted" />
          </div>

          <Button onClick={handleOpenAdd} size="sm" glow>
            <Plus className="w-4 h-4" />
            Add Contract
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContracts.length === 0 && (
          <div className="col-span-full text-center py-12 border border-white/10 rounded-xl bg-white/5">
            <p className="text-muted">No contracts found matching your search.</p>
          </div>
        )}
        {filteredContracts.map((contract: any) => (
           <Card key={contract.id} className="p-6 bg-white/5 border-white/10 hover:border-primary/50 transition-all group relative backdrop-blur-sm overflow-hidden">
             <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <button
                  onClick={() => handleOpenEdit(contract)}
                  className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                  title="Edit Contract"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteId(contract.id)}
                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Delete Contract"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
             </div>
             
             <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ring-1 ${
                  contract.type === 'GATEWAY' ? 'bg-purple-500/20 text-purple-400 ring-purple-500/30' :
                  contract.type === 'DEX_POOL' ? 'bg-green-500/20 text-green-400 ring-green-500/30' :
                  'bg-blue-500/20 text-blue-400 ring-blue-500/30'
                }`}>
                  {contract.type === 'GATEWAY' ? <ShieldCheck className="w-6 h-6" /> :
                   contract.type === 'DEX_POOL' ? <ArrowRightLeft className="w-6 h-6" /> :
                   <Code className="w-6 h-6" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg truncate">{contract.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-muted uppercase tracking-widest font-bold border border-white/5">
                      {contract.chainId}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-muted uppercase tracking-widest font-bold border border-white/5">
                      {contract.type?.replace('_', ' ')}
                    </span>
                  </div>
                  <p 
                    className="font-mono text-xs text-muted mt-2 truncate w-full cursor-help py-1 px-2 bg-white/5 rounded border border-white/5" 
                    title={contract.address}
                  >
                    {contract.address}
                  </p>
                </div>
             </div>
           </Card>
        ))}
      </div>

      <BaseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingId ? 'Edit Contract' : 'Register New Contract'}
        description={editingId ? 'Update smart contract details' : 'Add a new contract to the platform registry'}
        onConfirm={handleSubmit}
        confirmLabel={editingId ? 'Update Contract' : 'Register Contract'}
        isConfirmLoading={createContract.isPending || updateContract.isPending}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted">Contract Type</label>
            <div className="grid grid-cols-2 gap-2">
              {CONTRACT_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: type.value })}
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
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Chain ID"
              placeholder="e.g. 1"
              value={formData.chainId}
              onChange={(e) => setFormData({ ...formData, chainId: e.target.value })}
              required
            />
          </div>
          
          <Input
            label="Contract Address"
            placeholder="0x..."
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
            className="font-mono"
          />
          
          <button type="submit" className="hidden" />
        </form>
      </BaseModal>

      <DeleteConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Contract?"
        description="Are you sure you want to remove this contract from the registry? This action cannot be undone."
        isLoading={deleteContract.isPending}
      />
    </div>
  );
};
