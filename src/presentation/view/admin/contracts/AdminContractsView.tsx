'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAdminContracts } from './useAdminContracts';
import { Card, Button, Input, TokenIcon } from '@/presentation/components/atoms';
import { BaseModal, DeleteConfirmationModal, Pagination } from '@/presentation/components/molecules';
import { ChainSelector } from '@/presentation/components/organisms';
import { useTranslation } from '@/presentation/hooks';
import { Plus, Trash2, Code, ShieldCheck, ArrowRightLeft, Search, Edit2, LayoutGrid, Copy, Check, AlertTriangle, RefreshCw } from 'lucide-react';
import { shortenAddress } from '@/core/utils/format';

const POOL_ONLY_TYPES = new Set(['POOL']);

const metadataPlaceholderByType: Record<string, string> = {
  GATEWAY: '{"vault":"0x...","router":"0x...","tokenRegistry":"0x...","swapper":"0x..."}',
  ROUTER: '{"adapters":{"ccip":"0x...","hyperbridge":"0x..."}}',
  TOKEN_SWAPPER: '{"universalRouter":"0x...","poolManager":"0x...","bridgeToken":"0x..."}',
  ADAPTER_CCIP: '{"router":"0x...","chainSelector":"..."}',
  ADAPTER_HYPERBRIDGE: '{"host":"0x...","dispatcher":"0x..."}',
  ADAPTER_LAYERZERO: '{"endpoint":"0x...","dstEid":"...","peer":"0x..."}',
  TOKEN_REGISTRY: '{"description":"Token support registry"}',
  VAULT: '{"description":"Custody vault"}',
  POOL: '{"tickSpacing":60,"dex":"uniswap_v4"}',
  MOCK: '{"description":"Testing contract"}',
};

export const AdminContractsView = () => {
  const { t } = useTranslation();
  const { state, actions } = useAdminContracts();
  const {
    searchTerm,
    filterChain,
    filterType,
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
    isMutationPending,
    page,
    limit,
    meta,
  } = state;
  const { setPage, getPoolTokensByContract } = actions;
  const [copiedContractId, setCopiedContractId] = useState<string | null>(null);
  const selectedChain = chains?.items?.find((chain: any) => chain.id === formData.chainId || chain.uuid === formData.chainId);
  const isPoolType = POOL_ONLY_TYPES.has(formData.type);
  const isEvmChain = selectedChain?.chainType === 'EVM';
  const addressPlaceholder = isEvmChain ? '0x...' : 'Base58 program/account address';
  const isContractAddressMissing = !formData.contractAddress.trim();
  const isChainMissing = !formData.chainId;
  const isNameMissing = !formData.name.trim();
  const isPoolFieldsInvalid = isPoolType && (!formData.token0Address.trim() || !formData.token1Address.trim());
  const isSubmitDisabled = isNameMissing || isChainMissing || isContractAddressMissing || isPoolFieldsInvalid;

  const CONTRACT_TYPES = [
    { value: 'GATEWAY', label: t('admin.contracts_view.contract_types.gateway') },
    { value: 'ROUTER', label: t('admin.contracts_view.contract_types.router') },
    { value: 'TOKEN_REGISTRY', label: t('admin.contracts_view.contract_types.token_registry') },
    { value: 'TOKEN_SWAPPER', label: t('admin.contracts_view.contract_types.token_swapper') },
    { value: 'ADAPTER_CCIP', label: t('admin.contracts_view.contract_types.adapter_ccip') },
    { value: 'ADAPTER_HYPERBRIDGE', label: t('admin.contracts_view.contract_types.adapter_hyperbridge') },
    { value: 'ADAPTER_LAYERZERO', label: t('admin.contracts_view.contract_types.adapter_layerzero') },
    { value: 'POOL', label: t('admin.contracts_view.contract_types.pool') },
    { value: 'VAULT', label: t('admin.contracts_view.contract_types.vault') },
    { value: 'MOCK', label: t('admin.contracts_view.contract_types.mock') },
  ];

  const resolveChainForContract = (contract: any) => {
    const chainItems = chains?.items || [];
    const candidates = [
      contract?.chainUuid,
      contract?.chainUUID,
      contract?.chain_id,
      contract?.chainId,
      contract?.blockchainId,
      contract?.networkId,
    ]
      .filter(Boolean)
      .map((value) => String(value));

    return chainItems.find((chain: any) =>
      candidates.some((candidate) =>
        candidate === String(chain.id) ||
        candidate === String(chain.uuid) ||
        candidate === String(chain.chainId) ||
        candidate === String(chain.networkId)
      )
    );
  };

  const resolveChainIconPath = (chain: any): string | null => {
    const raw = `${chain?.name || ''} ${chain?.chainId || ''} ${chain?.networkId || ''}`.toLowerCase();
    if (raw.includes('base')) return '/chain/base-icon.svg';
    if (raw.includes('arbitrum') || raw.includes('42161')) return '/chain/arbitrum-icon.svg';
    if (raw.includes('polygon') || raw.includes('137')) return '/chain/polygon-icon.svg';
    if (raw.includes('solana') || raw.includes('svm')) return '/chain/solana-icon.svg';
    return null;
  };

  const handleCopyAddress = async (contractId: string, address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedContractId(contractId);
      setTimeout(() => setCopiedContractId((current) => (current === contractId ? null : current)), 1600);
    } catch {
      setCopiedContractId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('admin.contracts_view.title')}</h1>
          <p className="text-muted">{t('admin.contracts_view.subtitle')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder={t('admin.contracts_view.search_placeholder')}
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 w-full md:w-64 transition-all text-sm"
              value={searchTerm}
              onChange={(e) => actions.setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted" />
          </div>

          <div className="w-[200px]">
            <ChainSelector
                chains={chains?.items || []}
                selectedChainId={filterChain}
                onSelect={(chain) => actions.setFilterChain(chain?.id || '')}
                placeholder={t('admin.contracts_view.all_chains')} 
            />
          </div>

          <div className="w-[180px]">
            <select
              value={filterType}
              onChange={(e) => actions.setFilterType(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-full text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            >
              <option value="">{t('admin.contracts_view.all_types')}</option>
              {CONTRACT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <Button onClick={actions.handleOpenAdd} size="sm" glow className="rounded-full px-5">
            <Plus className="w-4 h-4 mr-1" />
            {t('admin.contracts_view.add_contract')}
          </Button>
        </div>
      </div>

      <Card className="p-4 bg-white/5 border-white/10 rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-end">
          <ChainSelector
            label={t('admin.contracts_view.modal.chain')}
            chains={chains?.items || []}
            selectedChainId={configSourceChainId}
            onSelect={(chain) => actions.setConfigSourceChainId(chain?.id || '')}
            placeholder={t('admin.onchain_adapters_view.source_chain')}
          />
          <ChainSelector
            label={t('admin.onchain_adapters_view.dest_chain')}
            chains={chains?.items || []}
            selectedChainId={configDestChainId}
            onSelect={(chain) => actions.setConfigDestChainId(chain?.id || '')}
            placeholder={t('admin.onchain_adapters_view.dest_chain')}
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => actions.refetchConfigCheck()}
            disabled={!configSourceChainId || isConfigCheckLoading}
            className="h-[44px]"
          >
            <RefreshCw className={`w-4 h-4 ${isConfigCheckLoading ? 'animate-spin' : ''}`} />
            {t('admin.onchain_adapters_view.refresh')}
          </Button>
        </div>
        {configCheckResult && (
          <div className="mt-4 space-y-3">
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2 py-1 rounded-full bg-white/10 border border-white/10">{configCheckResult.overallStatus}</span>
              <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">{t('admin.contracts_view.config_status_ok')}: {configCheckResult.summary?.ok ?? 0}</span>
              <span className="px-2 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">{t('admin.contracts_view.config_status_warn')}: {configCheckResult.summary?.warn ?? 0}</span>
              <span className="px-2 py-1 rounded-full bg-red-500/10 text-red-300 border border-red-500/20">{t('admin.contracts_view.config_status_error')}: {configCheckResult.summary?.error ?? 0}</span>
            </div>
            {(configCheckResult.globalChecks || []).length > 0 && (
              <div className="space-y-2">
                {(configCheckResult.globalChecks || []).map((check: any, idx: number) => (
                  <div key={`${check.code}-${idx}`} className={`px-3 py-2 rounded-lg border text-xs flex items-start gap-2 ${
                    check.status === 'ERROR' ? 'bg-red-500/10 border-red-500/20 text-red-200' :
                    check.status === 'WARN' ? 'bg-amber-500/10 border-amber-500/20 text-amber-200' :
                    'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'
                  }`}>
                    <AlertTriangle className="w-3.5 h-3.5 mt-0.5" />
                    <span>{check.message}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isContractsLoading ? (
          <div className="col-span-full p-12 text-center text-muted text-sm flex flex-col items-center justify-center gap-4 border border-white/5 rounded-2xl bg-white/5">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
              <Code className="w-8 h-8 text-primary relative z-10" />
            </div>
            {t('admin.contracts_view.loading')}
          </div>
        ) : filteredContracts.length === 0 ? (
          <div className="col-span-full text-center py-20 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-md">
            <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10 shadow-glow-sm">
              <LayoutGrid className="w-8 h-8 text-muted/50" />
            </div>
            <h3 className="text-lg font-bold text-foreground">{t('admin.contracts_view.empty_title')}</h3>
            <p className="text-muted text-sm max-w-xs mx-auto mt-1">{t('admin.contracts_view.empty_desc')}</p>
          </div>
        ) : (
          filteredContracts.map((contract: any) => {
            const contractChain = resolveChainForContract(contract);
            const chainIconPath = resolveChainIconPath(contractChain);
            const poolTokens = contract.type === 'POOL' ? getPoolTokensByContract(contract) : null;
            return (
             <Card key={contract.id} className="p-0 bg-white/5 border-white/10 hover:border-primary/50 transition-all group relative backdrop-blur-md rounded-2xl flex flex-col overflow-hidden">
                <div className="p-5 flex items-start gap-4">
                  <div className={`relative p-3 rounded-xl ring-1 shrink-0 ${
                    contract.type === 'GATEWAY' ? 'bg-purple-500/20 text-purple-400 ring-purple-500/30' :
                    contract.type === 'POOL' ? 'bg-green-500/20 text-green-400 ring-green-500/30' :
                    'bg-blue-500/20 text-blue-400 ring-blue-500/30'
                  }`}>
                    {contract.type === 'GATEWAY' ? <ShieldCheck className="w-6 h-6" /> :
                     contract.type === 'POOL' ? <ArrowRightLeft className="w-6 h-6" /> :
                     <Code className="w-6 h-6" />}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border border-black/40 bg-black/70 overflow-hidden flex items-center justify-center">
                      {chainIconPath ? (
                        <img src={chainIconPath} alt={contractChain?.name || 'chain'} className="w-4 h-4 object-contain" />
                      ) : (
                        <span className="text-[9px] text-muted font-bold">
                          {contractChain?.name?.[0]?.toUpperCase() || '?'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/admin/contracts/${contract.id}`}
                      className="font-bold text-lg truncate group-hover:text-primary transition-colors hover:underline underline-offset-4 block"
                    >
                      {contract.name}
                    </Link>
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
                      title={t('admin.contracts_view.edit_contract')}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => actions.setDeleteId(contract.id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title={t('admin.contracts_view.delete_contract')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="px-5 pb-5 mt-auto">
                  <div className="mb-2">
                    <div className="text-[11px] text-muted mb-1">{t('admin.contracts_view.abi_label')}</div>
                    <div className="flex flex-wrap gap-1">
                      {(contractAbiSummaryMap?.[contract.id]?.generatedFields || []).slice(0, 4).map((field) => (
                        <span key={`${contract.id}-${field}`} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
                          {field}
                        </span>
                      ))}
                      {(!(contractAbiSummaryMap?.[contract.id]?.generatedFields || []).length) && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-muted">
                          -
                        </span>
                      )}
                    </div>
                  </div>
                  {contract.type === 'POOL' && (
                    <div className="mb-2 py-2 px-3 bg-black/30 rounded-xl border border-white/5 flex items-center justify-between">
                      <div className="flex items-center -space-x-2">
                        <TokenIcon
                          size="sm"
                          symbol={poolTokens?.token0?.symbol || '?'}
                          logoUrl={poolTokens?.token0?.logoUrl}
                          className="ring-2 ring-background"
                        />
                        <TokenIcon
                          size="sm"
                          symbol={poolTokens?.token1?.symbol || '?'}
                          logoUrl={poolTokens?.token1?.logoUrl}
                          className="ring-2 ring-background"
                        />
                      </div>
                      <div className="text-[11px] text-muted font-mono">
                        {(poolTokens?.token0?.symbol || t('admin.contracts_view.token_pair_fallback_0')) + ' <> ' + (poolTokens?.token1?.symbol || t('admin.contracts_view.token_pair_fallback_1'))}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2 py-3 px-3 bg-black/40 rounded-xl border border-white/5">
                    <p
                      className="font-mono text-xs text-muted truncate flex-1 cursor-help select-all"
                      title={contract.contractAddress}
                    >
                      {shortenAddress(contract.contractAddress)}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleCopyAddress(contract.id, contract.contractAddress)}
                      className="p-1.5 rounded-md border border-white/10 text-muted hover:text-foreground hover:border-white/20 transition-colors"
                      title={t('admin.contracts_view.copy_address')}
                    >
                      {copiedContractId === contract.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
             </Card>
          )})
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
        title={editingId ? t('admin.contracts_view.modal.edit_title') : t('admin.contracts_view.modal.add_title')}
        description={editingId ? t('admin.contracts_view.modal.edit_desc') : t('admin.contracts_view.modal.add_desc')}
        onConfirm={actions.handleSubmit}
        confirmLabel={editingId ? t('admin.contracts_view.modal.update_confirm') : t('admin.contracts_view.modal.register_confirm')}
        isConfirmLoading={isMutationPending}
        isConfirmDisabled={isSubmitDisabled}
      >
        <form onSubmit={actions.handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted">{t('admin.contracts_view.modal.contract_type')}</label>
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
              label={t('admin.contracts_view.modal.contract_name')}
              placeholder={t('admin.contracts_view.modal.contract_name_placeholder')}
              value={formData.name}
              onChange={(e) => actions.setFormData({ ...formData, name: e.target.value })}
              required
            />
            <div className="space-y-2">
                <ChainSelector
                    label={t('admin.contracts_view.modal.chain')}
                    chains={chains?.items || []}
                    selectedChainId={formData.chainId}
                    onSelect={(chain) => actions.setFormData({ ...formData, chainId: chain?.id || '' })}
                    placeholder={t('admin.contracts_view.modal.chain_placeholder')}
                />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('admin.contracts_view.modal.version')}
              placeholder="1.0.0"
              value={formData.version}
              onChange={(e) => actions.setFormData({ ...formData, version: e.target.value })}
              required
            />
            <Input
              label={t('admin.contracts_view.modal.start_block')}
              type="number"
              placeholder="0"
              value={formData.startBlock}
              onChange={(e) => actions.setFormData({ ...formData, startBlock: Number(e.target.value) })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted">{t('admin.contracts_view.modal.status')}</label>
            <select
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={formData.isActive ? 'active' : 'inactive'}
              onChange={(e) => actions.setFormData({ ...formData, isActive: e.target.value === 'active' })}
            >
              <option value="active">{t('admin.contracts_view.modal.status_active')}</option>
              <option value="inactive">{t('admin.contracts_view.modal.status_inactive')}</option>
            </select>
          </div>
          
          <Input
            label={t('admin.contracts_view.modal.contract_address')}
            placeholder={addressPlaceholder}
            value={formData.contractAddress}
            onChange={(e) => actions.setFormData({ ...formData, contractAddress: e.target.value })}
            required
            className="font-mono"
          />

          {!isPoolType && (
            <Input
              label={t('admin.contracts_view.modal.deployer_address_optional')}
              placeholder={addressPlaceholder}
              value={formData.deployerAddress}
              onChange={(e) => actions.setFormData({ ...formData, deployerAddress: e.target.value })}
              className="font-mono"
            />
          )}

          {isPoolType && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label={t('admin.contracts_view.modal.token0_address')}
                  placeholder={addressPlaceholder}
                  value={formData.token0Address}
                  onChange={(e) => actions.setFormData({ ...formData, token0Address: e.target.value })}
                  className="font-mono"
                  required
                />
                <Input
                  label={t('admin.contracts_view.modal.token1_address')}
                  placeholder={addressPlaceholder}
                  value={formData.token1Address}
                  onChange={(e) => actions.setFormData({ ...formData, token1Address: e.target.value })}
                  className="font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label={t('admin.contracts_view.modal.fee_tier')}
                  type="number"
                  placeholder="500"
                  value={formData.feeTier}
                  onChange={(e) => actions.setFormData({ ...formData, feeTier: Number(e.target.value) })}
                  required
                />
                <Input
                  label={t('admin.contracts_view.modal.hook_address_optional')}
                  placeholder={addressPlaceholder}
                  value={formData.hookAddress}
                  onChange={(e) => actions.setFormData({ ...formData, hookAddress: e.target.value })}
                  className="font-mono"
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted">{t('admin.contracts_view.modal.abi_json')}</label>
            <textarea
              className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm"
              placeholder={t('admin.contracts_view.modal.abi_placeholder')}
              value={formData.abi}
              onChange={(e) => actions.setFormData({ ...formData, abi: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted">{t('admin.contracts_view.modal.metadata_json_optional')}</label>
            <textarea
              className="w-full h-24 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm"
              placeholder={metadataPlaceholderByType[formData.type] || '{"gasLimit": 1000000}'}
              value={formData.metadata}
              onChange={(e) => actions.setFormData({ ...formData, metadata: e.target.value })}
            />
          </div>
          
          <button type="submit" className="hidden" />
        </form>
      </BaseModal>

      <DeleteConfirmationModal
        isOpen={!!deleteId}
        onClose={() => actions.setDeleteId(null)}
        onConfirm={actions.handleDelete}
        title={t('admin.contracts_view.delete_modal.title')}
        description={t('admin.contracts_view.delete_modal.description')}
        isLoading={isMutationPending}
      />
    </div>
  );
};
