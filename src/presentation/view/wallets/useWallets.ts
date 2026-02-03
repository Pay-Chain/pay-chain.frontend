'use client';

import { useWalletStore } from '@/presentation/hooks';
import { useWalletsQuery } from '@/data/usecase';
import { useEffect } from 'react';

export function useWallets() {
  const { 
    wallets, 
    primaryWallet, 
    connectWallet, 
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

  const handleConnect = async () => {
    // This would typically trigger the wallet connection modal/logic
    // For now, we'll rely on the store's connectWallet which might be a stub or partial impl
    // Real implementation would use wagmi/appkit
    console.log('Connect wallet clicked');
  };

  return {
    wallets,
    primaryWallet,
    isLoading,
    connectWallet: handleConnect,
    disconnectWallet,
    setPrimaryWallet,
  };
}
