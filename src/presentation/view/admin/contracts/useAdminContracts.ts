import { useState } from 'react';
import { useAdminContracts as useAdminContractsQuery, useCreateContract, useDeleteContract, useUpdateContract, useAdminChains } from '@/data/usecase/useAdmin';
import { useDebounce } from '@/presentation/hooks/useDebounce';
import { toast } from 'sonner';

export const useAdminContracts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterChain, setFilterChain] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    contractAddress: '',
    chainId: '',
    type: 'GATEWAY',
  });

  const debouncedSearch = useDebounce(searchTerm, 500);

  // Fetch Data
  const { data: contractsData, isLoading: isContractsLoading, refetch: refetchContracts } = useAdminContractsQuery(page, limit);
  const { data: chains } = useAdminChains();

  const createContract = useCreateContract();
  const updateContract = useUpdateContract();
  const deleteContract = useDeleteContract();

  const contracts = contractsData?.items || [];
  const meta = contractsData?.meta;

  const filteredContracts = contracts.filter((c: any) => {
    const matchesSearch = c.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                          c.contractAddress?.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesChain = !filterChain || c.chainId.toString() === filterChain;
    return matchesSearch && matchesChain;
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ name: '', contractAddress: '', chainId: '', type: 'GATEWAY' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (contract: any) => {
    setEditingId(contract.id);
    setFormData({
      name: contract.name,
      contractAddress: contract.contractAddress,
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
        onSuccess: () => {
          handleCloseModal();
          toast.success('Contract updated successfully');
          refetchContracts();
        },
        onError: (err: any) => toast.error(err.message || 'Failed to update contract'),
      });
    } else {
      createContract.mutate(formData, {
        onSuccess: () => {
          handleCloseModal();
          toast.success('Contract created successfully');
          refetchContracts();
        },
        onError: (err: any) => toast.error(err.message || 'Failed to create contract'),
      });
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteContract.mutate(deleteId, {
        onSuccess: () => {
          setDeleteId(null);
          toast.success('Contract deleted successfully');
          refetchContracts();
        },
        onError: (err: any) => toast.error(err.message || 'Failed to delete contract'),
      });
    }
  };

  return {
    state: {
      searchTerm,
      filterChain,
      contracts,
      meta,
      chains,
      filteredContracts,
      isContractsLoading,
      isModalOpen,
      editingId,
      deleteId,
      formData,
      page,
      limit,
      isMutationPending: createContract.isPending || updateContract.isPending || deleteContract.isPending,
    },
    actions: {
      setSearchTerm: (term: string) => { setSearchTerm(term); setPage(1); },
      setFilterChain: (chain: string) => { setFilterChain(chain); setPage(1); },
      setFormData,
      setDeleteId,
      setPage,
      handleOpenAdd,
      handleOpenEdit,
      handleCloseModal,
      handleSubmit,
      handleDelete,
    }
  };
};
