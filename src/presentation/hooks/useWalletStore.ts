'use client';

// Stub hook - TODO: implement with proper data layer
const noop = (_arg?: unknown) => {};
const asyncNoop = async (_arg?: unknown) => {};

export function useWalletStore() {
  return {
    primaryWallet: null as { address: string; chainId: string; chainType: string } | null,
    wallets: [] as { address: string; chainId: string; chainType: string }[],
    syncWithServer: noop,
    connectWallet: asyncNoop,
    disconnectWallet: asyncNoop,
    setPrimaryWallet: noop,
  };
}
