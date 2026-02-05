'use client';

import { useWalletStore } from '@/presentation/hooks';
import { useWalletsQuery } from '@/data/usecase';
import { useAppKit } from '@reown/appkit/react';
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
  const { open } = useAppKit();

  useEffect(() => {
    if (walletsData?.wallets) {
      syncWithServer(walletsData.wallets);
    }
  }, [walletsData, syncWithServer]);

  const connectWallet = () => {
    // Open AppKit modal for wallet connection
    open({ view: 'Connect' });
  };

  return {
    wallets,
    primaryWallet,
    isLoading,
    connectWallet,
    disconnectWallet,
    setPrimaryWallet,
  };
}
