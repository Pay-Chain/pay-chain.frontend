'use client';

// Stub hook - TODO: implement with proper data layer
export function useWalletStore() {
  return {
    primaryWallet: null as { address: string; chainId: string; chainType: string } | null,
    wallets: [] as { address: string; chainId: string; chainType: string }[],
    syncWithServer: (_wallets: unknown[]) => {},
    connectWallet: async () => {},
    disconnectWallet: async (_address: string) => {},
    setPrimaryWallet: (_wallet: unknown) => {},

  };
}
