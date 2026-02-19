import { useMemo } from 'react';
import { useAdminContractById, useAdminContractConfigCheckById } from '@/data/usecase/useAdmin';

export const useAdminContractDetail = (id: string) => {
  const contractQuery = useAdminContractById(id);
  const configQuery = useAdminContractConfigCheckById(id);

  const contract = contractQuery.data;
  const config = configQuery.data;

  const abiFunctions = useMemo(() => {
    const abi = contract?.abi;
    if (!Array.isArray(abi)) return [] as string[];
    const names = abi
      .filter((entry: any) => entry?.type === 'function' && entry?.name)
      .map((entry: any) => String(entry.name));
    return [...new Set(names)].sort();
  }, [contract?.abi]);

  const writableFunctions = useMemo(() => {
    const abi = contract?.abi;
    if (!Array.isArray(abi)) return [] as Array<{ name: string; inputs: Array<{ name: string; type: string }> }>;
    return abi
      .filter((entry: any) => {
        if (!entry || entry.type !== 'function' || !entry.name) return false;
        const mutability = String(entry.stateMutability || '').toLowerCase();
        return mutability !== 'view' && mutability !== 'pure';
      })
      .map((entry: any) => ({
        name: String(entry.name),
        inputs: Array.isArray(entry.inputs)
          ? entry.inputs.map((input: any) => ({
              name: String(input?.name || ''),
              type: String(input?.type || 'string'),
            }))
          : [],
      }));
  }, [contract?.abi]);

  const generatedFields = useMemo(() => {
    const fields = new Set<string>();
    const abi = contract?.abi;
    if (!Array.isArray(abi)) return [] as string[];
    for (const entry of abi) {
      if (!entry || entry?.type !== 'function') continue;
      const fn = String(entry.name || '');
      if (fn.startsWith('set') && fn.length > 3) {
        fields.add(fn.charAt(3).toLowerCase() + fn.slice(4));
      }
      const mutability = String(entry.stateMutability || '').toLowerCase();
      const isWriteFunction = mutability !== 'view' && mutability !== 'pure';
      if (isWriteFunction && Array.isArray(entry.inputs)) {
        for (const input of entry.inputs) {
          const inputName = String(input?.name || '').trim();
          if (!inputName || inputName === '_') continue;
          fields.add(inputName);
        }
      }
    }
    return [...fields].sort();
  }, [contract?.abi]);

  return {
    state: {
      contract,
      config,
      abiFunctions,
      writableFunctions,
      generatedFields,
      isLoading: contractQuery.isLoading || configQuery.isLoading,
      isError: contractQuery.isError || configQuery.isError,
      errorMessage:
        (contractQuery.error as Error | undefined)?.message ||
        (configQuery.error as Error | undefined)?.message ||
        '',
    },
    actions: {
      refetch: () => {
        contractQuery.refetch();
        configQuery.refetch();
      },
    },
  };
};
