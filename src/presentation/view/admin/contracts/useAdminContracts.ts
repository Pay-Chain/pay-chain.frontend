import { useMemo, useState } from 'react';
import { useAdminContracts as useAdminContractsQuery, useCreateContract, useDeleteContract, useUpdateContract, useAdminChains, useAdminContractConfigCheck } from '@/data/usecase/useAdmin';
import { useDebounce } from '@/presentation/hooks/useDebounce';
import { useTranslation, useUrlQueryState } from '@/presentation/hooks';
import { QUERY_PARAM_KEYS } from '@/core/constants';
import { useTokensQuery } from '@/data/usecase';
import { toast } from 'sonner';

const POOL_ONLY_TYPES = new Set(['POOL']);

export const useAdminContracts = () => {
  const { t } = useTranslation();
  const { getString, getNumber, getSearch, setMany } = useUrlQueryState();
  const searchTerm = getSearch();
  const filterChain = getString(QUERY_PARAM_KEYS.chainId);
  const filterType = getString(QUERY_PARAM_KEYS.type);
  const page = getNumber(QUERY_PARAM_KEYS.page, 1);
  const [limit] = useState(10);
  const [configSourceChainId, setConfigSourceChainId] = useState('');
  const [configDestChainId, setConfigDestChainId] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    contractAddress: '',
    chainId: '',
    type: 'GATEWAY',
    version: '1.0.0',
    startBlock: 0,
    abi: '',
    deployerAddress: '',
    token0Address: '',
    token1Address: '',
    feeTier: 0,
    hookAddress: '',
    metadata: '',
    isActive: true,
  });

  const debouncedSearch = useDebounce(searchTerm, 500);

  // Fetch Data
  const { data: contractsData, isLoading: isContractsLoading, refetch: refetchContracts } = useAdminContractsQuery(
    page,
    limit,
    filterChain || undefined,
    filterType || undefined
  );
  const { data: chains } = useAdminChains();
  const { data: tokensData } = useTokensQuery();
  const { data: configCheckResult, isLoading: isConfigCheckLoading, refetch: refetchConfigCheck } = useAdminContractConfigCheck(
    configSourceChainId || undefined,
    configDestChainId || undefined
  );

  const createContract = useCreateContract();
  const updateContract = useUpdateContract();
  const deleteContract = useDeleteContract();

  const contracts = contractsData?.items || [];
  const meta = contractsData?.meta;
  const chainItems = chains?.items || [];
  const tokenItems = tokensData?.items || [];

  const normalizeAddress = (value?: string | null) => (value || '').trim().toLowerCase();

  const getTokenByContractAddress = (address?: string | null) => {
    const normalized = normalizeAddress(address);
    if (!normalized) return undefined;

    return tokenItems.find((token: any) => {
      const candidates = [
        token?.contractAddress,
        token?.address,
      ]
        .filter(Boolean)
        .map((v) => normalizeAddress(String(v)));
      return candidates.includes(normalized);
    });
  };

  const getPoolTokensByContract = (contract: any) => {
    const token0 = getTokenByContractAddress(contract?.token0Address);
    const token1 = getTokenByContractAddress(contract?.token1Address);
    return { token0, token1 };
  };
  const resolveSelectedChainId = (contract: any): string => {
    const rawCandidates = [
      contract?.chainUuid,
      contract?.chainUUID,
      contract?.chain_id,
      contract?.chainId,
      contract?.blockchainId,
      contract?.networkId,
    ]
      .filter(Boolean)
      .map((v) => String(v));

    if (rawCandidates.length === 0) return '';

    // Prefer direct UUID-like match to selector option id.
    const directMatch = chainItems.find((chain: any) =>
      rawCandidates.some((candidate) => candidate === String(chain.id) || candidate === String(chain.uuid))
    );
    if (directMatch) return String(directMatch.id || directMatch.uuid);

    // Fallback: contract has blockchain/network id, map it to chain UUID option.
    const mappedMatch = chainItems.find((chain: any) =>
      rawCandidates.some(
        (candidate) =>
          candidate === String(chain.chainId) ||
          candidate === String(chain.networkId) ||
          candidate === String(chain.id)
      )
    );
    if (mappedMatch) return String(mappedMatch.id || mappedMatch.uuid);

    return rawCandidates[0];
  };

  const filteredContracts = contracts.filter((c: any) => {
    const matchesSearch = c.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                          c.contractAddress?.toLowerCase().includes(debouncedSearch.toLowerCase());
    return matchesSearch;
  });

  const getAbiSummary = (abiRaw: any) => {
    try {
      const abi = typeof abiRaw === 'string' ? JSON.parse(abiRaw) : abiRaw;
      if (!Array.isArray(abi)) return { functions: [], generatedFields: [] };
      const functionNames: string[] = [];
      const generated = new Set<string>();
      for (const entry of abi) {
        if (!entry || entry.type !== 'function' || !entry.name) continue;
        functionNames.push(entry.name);
        if (entry.name.startsWith('set') && entry.name.length > 3) {
          const field = entry.name.charAt(3).toLowerCase() + entry.name.slice(4);
          if (field) generated.add(field);
        }
        const mutability = String(entry.stateMutability || '').toLowerCase();
        const isWriteFunction = mutability !== 'view' && mutability !== 'pure';
        if (isWriteFunction && Array.isArray(entry.inputs)) {
          for (const input of entry.inputs) {
            const inputName = String(input?.name || '').trim();
            if (!inputName || inputName === '_') continue;
            generated.add(inputName);
          }
        }
      }
      return {
        functions: [...new Set(functionNames)].sort(),
        generatedFields: [...generated].sort(),
      };
    } catch {
      return { functions: [], generatedFields: [] };
    }
  };

  const contractAbiSummaryMap = useMemo(() => {
    const map: Record<string, { functions: string[]; generatedFields: string[] }> = {};
    for (const contract of filteredContracts) {
      map[contract.id] = getAbiSummary(contract.abi ?? []);
    }
    return map;
  }, [filteredContracts]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      contractAddress: '',
      chainId: '',
      type: 'GATEWAY',
      version: '1.0.0',
      startBlock: 0,
      abi: '',
      deployerAddress: '',
      token0Address: '',
      token1Address: '',
      feeTier: 0,
      hookAddress: '',
      metadata: '',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (contract: any) => {
    setEditingId(contract.id);
    setFormData({
      name: contract.name,
      contractAddress: contract.contractAddress,
      chainId: resolveSelectedChainId(contract),
      type: contract.type || 'GATEWAY',
      version: contract.version || '1.0.0',
      startBlock: contract.startBlock || 0,
      abi: contract.abi ? JSON.stringify(contract.abi, null, 2) : '',
      deployerAddress: contract.deployerAddress || '',
      token0Address: contract.token0Address || '',
      token1Address: contract.token1Address || '',
      feeTier: contract.feeTier || 0,
      hookAddress: contract.hookAddress || '',
      metadata: contract.metadata ? JSON.stringify(contract.metadata, null, 2) : '',
      isActive: contract.isActive ?? true,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    // Prepare data
    let abiObj = null;
    try {
      if (formData.abi) abiObj = JSON.parse(formData.abi);
    } catch (err) {
      return toast.error(t('admin.contracts_view.toasts.invalid_abi_json'));
    }

    let metadataObj = null;
    try {
      if (formData.metadata) metadataObj = JSON.parse(formData.metadata);
    } catch (err) {
      return toast.error(t('admin.contracts_view.toasts.invalid_metadata_json'));
    }

    const payload: Record<string, any> = {
      ...formData,
      abi: abiObj,
      metadata: metadataObj,
      startBlock: Number(formData.startBlock),
      feeTier: Number(formData.feeTier),
    };

    // Only keep pool-specific fields for POOL contracts.
    if (!POOL_ONLY_TYPES.has(formData.type)) {
      payload.token0Address = '';
      payload.token1Address = '';
      payload.feeTier = 0;
      payload.hookAddress = '';
    } else {
      if (!formData.token0Address || !formData.token1Address) {
        return toast.error(t('admin.contracts_view.toasts.pool_tokens_required'));
      }
      if (Number.isNaN(payload.feeTier) || payload.feeTier < 0) {
        return toast.error(t('admin.contracts_view.toasts.fee_tier_invalid'));
      }
    }

    if (editingId) {
      updateContract.mutate({ id: editingId, data: payload }, {
        onSuccess: () => {
          handleCloseModal();
          toast.success(t('admin.contracts_view.toasts.update_success'));
          refetchContracts();
        },
        onError: (err: any) => toast.error(err.message || t('admin.contracts_view.toasts.update_failed')),
      });
    } else {
      createContract.mutate(payload, {
        onSuccess: () => {
          handleCloseModal();
          toast.success(t('admin.contracts_view.toasts.create_success'));
          refetchContracts();
        },
        onError: (err: any) => toast.error(err.message || t('admin.contracts_view.toasts.create_failed')),
      });
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteContract.mutate(deleteId, {
        onSuccess: () => {
          setDeleteId(null);
          toast.success(t('admin.contracts_view.toasts.delete_success'));
          refetchContracts();
        },
        onError: (err: any) => toast.error(err.message || t('admin.contracts_view.toasts.delete_failed')),
      });
    }
  };

  return {
    state: {
      searchTerm,
      filterChain,
      filterType,
      contracts,
      meta,
      chains,
      configSourceChainId,
      configDestChainId,
      configCheckResult,
      isConfigCheckLoading,
      filteredContracts,
      contractAbiSummaryMap,
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
      setSearchTerm: (term: string) =>
        setMany({
          [QUERY_PARAM_KEYS.q]: term,
          [QUERY_PARAM_KEYS.legacySearch]: null,
          [QUERY_PARAM_KEYS.page]: 1,
        }),
      setFilterChain: (chain: string) => setMany({ [QUERY_PARAM_KEYS.chainId]: chain, [QUERY_PARAM_KEYS.page]: 1 }),
      setFilterType: (type: string) => setMany({ [QUERY_PARAM_KEYS.type]: type, [QUERY_PARAM_KEYS.page]: 1 }),
      setConfigSourceChainId,
      setConfigDestChainId,
      setFormData,
      setDeleteId,
      setPage: (value: number | ((prev: number) => number)) => {
        const next = typeof value === 'function' ? value(page) : value;
        setMany({ [QUERY_PARAM_KEYS.page]: next });
      },
      handleOpenAdd,
      handleOpenEdit,
      handleCloseModal,
      handleSubmit,
      handleDelete,
      refetchConfigCheck,
      getTokenByContractAddress,
      getPoolTokensByContract,
    }
  };
};
