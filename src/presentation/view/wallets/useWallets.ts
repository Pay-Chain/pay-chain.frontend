'use client';

import { useWalletStore } from '@/presentation/hooks';
import { useWalletsQuery } from '@/data/usecase';
import { useEffect } from 'react';

export function useWallets() {
  const { 
    wallets, 
    primaryWallet, 
    disconnectWallet, 
    setPrimaryWallet,
    syncWithServer
  } = useWalletStore();

  const { data: walletsData, isLoading } = useWalletsQuery();

  useEffect(() => {
    if (walletsData?.wallets) {
      syncWithServer(walletsData.wallets);
    }
  }, [walletsData, syncWithServer]);

  return {
    wallets,
    primaryWallet,
    isLoading,
    disconnectWallet,
    setPrimaryWallet,
  };
}
