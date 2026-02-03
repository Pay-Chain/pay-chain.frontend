'use client';

import { Button } from '@/presentation/components/atoms';
import { useWallets } from './useWallets';
import { Wallet, LogOut } from 'lucide-react';
import { shortenAddress } from '@/core/utils';
import { useTranslation } from '@/presentation/hooks';

export function WalletsView() {
  const { wallets, primaryWallet, isLoading, connectWallet, disconnectWallet, setPrimaryWallet } = useWallets();
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{t('wallets.title')}</h1>
        <Button onClick={connectWallet}>{t('wallets.connect')}</Button>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <div className="text-white/50">{t('wallets.loading')}</div>
        ) : wallets.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white/5 border border-white/5 text-center text-white/50">
            {t('wallets.no_wallets')}
          </div>
        ) : (
          wallets.map((wallet) => {
            const isPrimary = primaryWallet?.address === wallet.address;
            
            return (
              <div 
                key={wallet.address}
                className={`p-4 rounded-xl border transition-all ${
                  isPrimary 
                    ? 'bg-blue-500/10 border-blue-500/30' 
                    : 'bg-white/5 border-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isPrimary ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-white/50'}`}>
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-white text-lg">{shortenAddress(wallet.address)}</span>
                        {isPrimary && (
                          <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium">
                            {t('wallets.primary')}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-white/50 capitalize">{wallet.chainType} • {wallet.chainId}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isPrimary && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setPrimaryWallet(wallet)}
                        className="text-white/50 hover:text-white"
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
