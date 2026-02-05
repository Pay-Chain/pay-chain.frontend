'use client';

import { Button } from '@/presentation/components/atoms';
import { useWallets } from './useWallets';
import { Wallet, LogOut, Plus, Star, ExternalLink, Copy, Check } from 'lucide-react';
import { shortenAddress } from '@/core/utils';
import { useTranslation } from '@/presentation/hooks';
import { useState } from 'react';

export function WalletsView() {
  const { wallets, primaryWallet, isLoading, connectWallet, disconnectWallet, setPrimaryWallet } = useWallets();
  const { t } = useTranslation();
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const copyToClipboard = async (address: string) => {
    await navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-green/10 border border-accent-green/20 mb-3">
            <Wallet className="w-4 h-4 text-accent-green" />
            <span className="text-xs text-accent-green font-medium uppercase tracking-wider">
              Connected Wallets
            </span>
          </div>
          <h1 className="heading-2 text-foreground">{t('wallets.title')}</h1>
        </div>
        <Button onClick={connectWallet} variant="primary" glow>
          <Plus className="w-4 h-4" />
          {t('wallets.connect')}
        </Button>
      </div>

      {/* Wallets Grid */}
      <div className="grid gap-4">
        {isLoading ? (
          <div className="card p-12 flex flex-col items-center justify-center">
            <div className="spinner-gradient mb-4" />
            <p className="text-muted">{t('wallets.loading')}</p>
          </div>
        ) : wallets.length === 0 ? (
          <div className="card p-12 text-center animate-fade-in">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-surface border border-white/10 flex items-center justify-center">
              <Wallet className="w-10 h-10 text-muted" />
            </div>
            <h3 className="heading-3 text-foreground mb-2">No wallets connected</h3>
            <p className="text-muted mb-6">{t('wallets.no_wallets')}</p>
            <Button onClick={connectWallet} variant="secondary">
              <Plus className="w-4 h-4" />
              Connect your first wallet
            </Button>
          </div>
        ) : (
          wallets.map((wallet, index) => {
            const isPrimary = primaryWallet?.address === wallet.address;
            const isCopied = copiedAddress === wallet.address;
            
            return (
              <div 
                key={wallet.address}
                className={`card-hover group transition-all duration-300 ${
                  isPrimary 
                    ? 'border-accent-purple/30 shadow-glow-sm bg-accent-purple/5' 
                    : ''
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      isPrimary 
                        ? 'bg-gradient-purple-green shadow-glow-sm' 
                        : 'bg-surface border border-white/10 group-hover:border-white/20'
                    }`}>
                      <Wallet className={`w-7 h-7 ${isPrimary ? 'text-foreground' : 'text-muted group-hover:text-foreground transition-colors'}`} />
                    </div>
                    
                    {/* Info */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-foreground text-lg font-medium">
                          {shortenAddress(wallet.address)}
                        </span>
                        {isPrimary && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-purple/20 text-accent-purple text-xs font-medium">
                            <Star className="w-3 h-3" />
                            {t('wallets.primary')}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted capitalize">
                        {wallet.chainType} • Chain {wallet.chainId}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => copyToClipboard(wallet.address)}
                      className="p-2 rounded-lg hover:bg-white/5 text-muted hover:text-foreground transition-all"
                      title="Copy address"
                    >
                      {isCopied ? (
                        <Check className="w-4 h-4 text-accent-green" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <a
                      href={`https://etherscan.io/address/${wallet.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-white/5 text-muted hover:text-foreground transition-all"
                      title="View on explorer"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    {!isPrimary && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setPrimaryWallet(wallet)}
                      >
                        {t('wallets.set_primary')}
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => disconnectWallet(wallet.address)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    >
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
