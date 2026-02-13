'use client';

import React from 'react';
import { useApp } from './useApp';
import { ChainSelector } from '@/presentation/components/organisms/ChainSelector';
import { TokenSelector } from '@/presentation/components/organisms/TokenSelector';
import { Button, Input } from '@/presentation/components/atoms';
import { WalletConnectButton } from '@/presentation/components/molecules';
import { AlertTriangle, CheckCircle2, Send, Wallet } from 'lucide-react';
import { useTranslation } from '@/presentation/hooks';

export default function AppView() {
  const { t } = useTranslation();
  const {
    isConnected, address, chains,
    sourceChainId, setSourceChainId,
    destChainId, setDestChainId,
    amount, setAmount,
    tokenAddress, setTokenAddress,
    receiver, setReceiver,
    decimals, setDecimals,
    filteredTokens, selectedToken,
    isLoading, isSuccess, error, txHash,
    handlePay
  } = useApp();

  const selectedSourceChain = chains.find((chain) => chain.id === sourceChainId);

  const getExplorerUrl = (hash: string) => {
    const explorer = selectedSourceChain?.explorerUrl;
    if (!explorer) return `https://etherscan.io/tx/${hash}`;
    return `${explorer}/tx/${hash}`;
  };

  if (isSuccess) {
    return (
      <div className="min-w-3xl max-w-3xl mx-auto space-y-6 animate-fade-in py-8">
        <div className="card-glass p-8 shadow-glass text-center space-y-4">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30">
            <CheckCircle2 className="h-7 w-7 text-emerald-400" />
          </div>
          <h1 className="heading-2 text-foreground">{t('app_view.payment_sent')}</h1>
          <p className="text-sm text-muted">{t('app_view.transaction_hash')}</p>
          <p className="text-sm text-foreground break-all">{txHash}</p>
          {txHash && (
            <a
              href={getExplorerUrl(txHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex text-sm text-accent-purple hover:text-accent-purple/80 transition-colors"
            >
              {t('app_view.view_explorer')}
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in py-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-purple/10 border border-accent-purple/20 mb-2">
          <Send className="w-3 h-3 text-accent-purple" />
          <span className="text-xs text-accent-purple font-medium">{t('app_view.badge')}</span>
        </div>
        <h1 className="heading-2 text-foreground">{t('app_view.title')}</h1>
      </div>

      <div className="card-glass p-8 shadow-glass space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ChainSelector
            label={t('app_view.source_chain')}
            chains={chains}
            selectedChainId={sourceChainId}
            onSelect={(chain) => {
              const next = chain?.id || '';
              setSourceChainId(next);
              if (!destChainId) setDestChainId(next);
              setTokenAddress('');
            }}
            placeholder={t('app_view.select_source_chain')}
          />

          <ChainSelector
            label={t('app_view.destination_chain')}
            chains={chains}
            selectedChainId={destChainId}
            onSelect={(chain) => setDestChainId(chain?.id || '')}
            placeholder={t('app_view.select_destination_chain')}
          />
        </div>

        <TokenSelector
          label={t('app_view.token')}
          tokens={filteredTokens}
          selectedTokenId={selectedToken?.id}
          onSelect={(token) => {
            const address = token?.address || (token?.isNative ? '0x0000000000000000000000000000000000000000' : '');
            setTokenAddress(address);
            if (token?.decimals) setDecimals(token.decimals);
          }}
          disabled={!sourceChainId}
          placeholder={sourceChainId ? t('app_view.select_token') : t('app_view.select_source_first')}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={t('app_view.amount')}
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Input
            label={t('app_view.decimals')}
            type="number"
            min={0}
            max={18}
            value={decimals}
            onChange={(e) => setDecimals(Number(e.target.value || 0))}
          />
        </div>

        <Input
          label={t('app_view.receiver_address')}
          placeholder="0x..."
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
        />

        {error && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 animate-fade-in">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-red-400 font-medium">{t('app_view.payment_error_title')}</p>
              <p className="text-red-400/80 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {!isConnected && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 animate-fade-in">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
              <Wallet className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-amber-200 font-medium">{t('app_view.connect_wallet_title')}</p>
              <p className="text-amber-200/60 text-sm mt-1">{t('app_view.connect_wallet_subtitle')}</p>
            </div>
          </div>
        )}

        <div className="pt-4 flex flex-wrap items-center justify-end gap-3 border-t border-white/10">
          <WalletConnectButton size="default" />
          {isConnected && (
            <Button type="button" variant="primary" glow loading={isLoading} onClick={handlePay}>
              <Send className="w-4 h-4" />
              {t('app_view.pay_now')}
            </Button>
          )}
        </div>
      </div >
    </div >
  );
}
