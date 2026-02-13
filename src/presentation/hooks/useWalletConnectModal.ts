'use client';

import { create } from 'zustand';

interface WalletConnectModalState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useWalletConnectModal = create<WalletConnectModalState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

