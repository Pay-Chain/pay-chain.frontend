'use client';

import { Cable, RefreshCcw, Save } from 'lucide-react';
import { Button, Card, Input } from '@/presentation/components/atoms';
import { ChainSelector } from '@/presentation/components/organisms';
import { useAdminOnchainAdapters } from './useAdminOnchainAdapters';
import { useTranslation } from '@/presentation/hooks';

export const AdminOnchainAdaptersView = () => {
  const { t } = useTranslation();
  const { state, actions } = useAdminOnchainAdapters();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Cable className="w-6 h-6 text-primary" />
          {t('admin.onchain_adapters_view.title')}
        </h1>
        <p className="text-sm text-muted">{t('admin.onchain_adapters_view.subtitle')}</p>
      </div>

      <Card className="p-5 bg-white/5 border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <ChainSelector
            label={t('admin.onchain_adapters_view.source_chain')}
            chains={state.chains}
            selectedChainId={state.sourceChainId}
            onSelect={(chain) => actions.setSourceChainId(chain?.id || '')}
            placeholder={t('admin.onchain_adapters_view.source_chain')}
          />
          <ChainSelector
            label={t('admin.onchain_adapters_view.dest_chain')}
            chains={state.chains}
            selectedChainId={state.destChainId}
            onSelect={(chain) => actions.setDestChainId(chain?.id || '')}
            placeholder={t('admin.onchain_adapters_view.dest_chain')}
          />
          <div className="flex items-end">
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => actions.refreshStatus()}
              disabled={!state.sourceChainId || !state.destChainId}
            >
              <RefreshCcw className="w-4 h-4" />
              {t('admin.onchain_adapters_view.refresh')}
            </Button>
          </div>
        </div>
      </Card>

      {state.status && (
        <Card className="p-5 bg-white/5 border-white/10 space-y-2">
          <p className="text-sm"><span className="text-muted">{t('admin.onchain_adapters_view.gateway')}:</span> {state.status.gatewayAddress}</p>
          <p className="text-sm"><span className="text-muted">{t('admin.onchain_adapters_view.router')}:</span> {state.status.routerAddress}</p>
          <p className="text-sm"><span className="text-muted">{t('admin.onchain_adapters_view.default_bridge_type')}:</span> {state.status.defaultBridgeType}</p>
          <p className="text-sm"><span className="text-muted">{t('admin.onchain_adapters_view.has_adapter_0')}:</span> {String(state.status.hasAdapterType0)}</p>
          <p className="text-sm"><span className="text-muted">{t('admin.onchain_adapters_view.has_adapter_1')}:</span> {String(state.status.hasAdapterType1)}</p>
          <p className="text-sm"><span className="text-muted">{t('admin.onchain_adapters_view.adapter_0')}:</span> {state.status.adapterType0}</p>
          <p className="text-sm"><span className="text-muted">{t('admin.onchain_adapters_view.adapter_1')}:</span> {state.status.adapterType1}</p>
          <p className="text-sm"><span className="text-muted">{t('admin.onchain_adapters_view.hyperbridge_configured')}:</span> {String(state.status.hyperbridgeConfigured)}</p>
          <p className="text-sm"><span className="text-muted">{t('admin.onchain_adapters_view.hyperbridge_state_machine')}:</span> {state.status.hyperbridgeStateMachineId || '-'}</p>
          <p className="text-sm"><span className="text-muted">{t('admin.onchain_adapters_view.hyperbridge_destination_contract')}:</span> {state.status.hyperbridgeDestinationContract || '-'}</p>
          <p className="text-sm"><span className="text-muted">{t('admin.onchain_adapters_view.ccip_chain_selector')}:</span> {String(state.status.ccipChainSelector ?? 0)}</p>
          <p className="text-sm"><span className="text-muted">{t('admin.onchain_adapters_view.ccip_destination_adapter')}:</span> {state.status.ccipDestinationAdapter || '-'}</p>
        </Card>
      )}

      <Card className="p-5 bg-white/5 border-white/10 space-y-4">
        <h3 className="text-base font-semibold">{t('admin.onchain_adapters_view.register_title')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground/80 ml-1">{t('admin.onchain_adapters_view.bridge_type')}</label>
            <select
              className="h-11 rounded-full bg-white/5 border border-white/10 px-3 text-sm w-full"
              value={state.registerBridgeType}
              onChange={(e) => actions.setRegisterBridgeType(e.target.value)}
            >
              <option value="0">0 - Hyperbridge</option>
              <option value="1">1 - CCIP</option>
            </select>
          </div>
          <Input
            label={t('admin.onchain_adapters_view.adapter_address')}
            placeholder="0x..."
            value={state.registerAdapterAddress}
            onChange={(e) => actions.setRegisterAdapterAddress(e.target.value)}
          />
        </div>
        <Button
          variant="primary"
          onClick={() => actions.registerAdapter()}
          loading={state.isPending}
          disabled={!state.sourceChainId || !state.destChainId || !state.registerAdapterAddress}
        >
          <Save className="w-4 h-4" />
          {t('admin.onchain_adapters_view.register_button')}
        </Button>
      </Card>

      <Card className="p-5 bg-white/5 border-white/10 space-y-4">
        <h3 className="text-base font-semibold">{t('admin.onchain_adapters_view.default_title')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground/80 ml-1">{t('admin.onchain_adapters_view.bridge_type')}</label>
            <select
              className="h-11 rounded-full bg-white/5 border border-white/10 px-3 text-sm w-full"
              value={state.defaultBridgeType}
              onChange={(e) => actions.setDefaultBridgeType(e.target.value)}
            >
              <option value="0">0 - Hyperbridge</option>
              <option value="1">1 - CCIP</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button
              variant="ghost"
              className="w-full"
              onClick={actions.syncFromStatus}
              disabled={!state.status}
            >
              {t('admin.onchain_adapters_view.use_current_default')}
            </Button>
          </div>
        </div>
        <Button
          variant="primary"
          onClick={() => actions.setDefaultBridge()}
          loading={state.isPending}
          disabled={!state.sourceChainId || !state.destChainId}
        >
          <Save className="w-4 h-4" />
          {t('admin.onchain_adapters_view.set_default_button')}
        </Button>
      </Card>

      <Card className="p-5 bg-white/5 border-white/10 space-y-4">
        <h3 className="text-base font-semibold">{t('admin.onchain_adapters_view.hyperbridge_title')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            label={t('admin.onchain_adapters_view.state_machine_id_hex')}
            placeholder="0x45564d2d3432313631"
            value={state.stateMachineIdHex}
            onChange={(e) => actions.setStateMachineIdHex(e.target.value)}
          />
          <Input
            label={t('admin.onchain_adapters_view.destination_contract_hex')}
            placeholder="0x000000000000000000000000..."
            value={state.destinationContractHex}
            onChange={(e) => actions.setDestinationContractHex(e.target.value)}
          />
        </div>
        <Button
          variant="primary"
          onClick={() => actions.setHyperbridgeConfig()}
          loading={state.isPending}
          disabled={!state.sourceChainId || !state.destChainId || (!state.stateMachineIdHex && !state.destinationContractHex)}
        >
          <Save className="w-4 h-4" />
          {t('admin.onchain_adapters_view.save_hyperbridge')}
        </Button>
      </Card>

      <Card className="p-5 bg-white/5 border-white/10 space-y-4">
        <h3 className="text-base font-semibold">{t('admin.onchain_adapters_view.ccip_title')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            label={t('admin.onchain_adapters_view.chain_selector')}
            type="number"
            placeholder="4949039107694359620"
            value={state.ccipChainSelector}
            onChange={(e) => actions.setCcipChainSelector(e.target.value)}
          />
          <Input
            label={t('admin.onchain_adapters_view.destination_adapter_hex')}
            placeholder="0x000000000000000000000000..."
            value={state.destinationAdapterHex}
            onChange={(e) => actions.setDestinationAdapterHex(e.target.value)}
          />
        </div>
        <Button
          variant="primary"
          onClick={() => actions.setCCIPConfig()}
          loading={state.isPending}
          disabled={!state.sourceChainId || !state.destChainId || (!state.ccipChainSelector && !state.destinationAdapterHex)}
        >
          <Save className="w-4 h-4" />
          {t('admin.onchain_adapters_view.save_ccip')}
        </Button>
      </Card>
    </div>
  );
};
