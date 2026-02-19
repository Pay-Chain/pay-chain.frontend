'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { useAppKit } from '@reown/appkit/react';
import { useAccount, useDisconnect, usePublicClient, useSwitchChain } from 'wagmi';
import { WalletReadyState } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { formatUnits } from 'viem';

type WalletEcosystem = 'evm' | 'svm' | null;

interface BalanceResult {
  raw: string;
  formatted: string;
  decimals: number;
  symbol: string;
}

interface NativeBalanceOptions {
  ecosystem?: Exclude<WalletEcosystem, null>;
  address?: string;
}

interface Erc20BalanceOptions {
  address?: `0x${string}`;
  decimals?: number;
}

interface SplBalanceOptions {
  ownerAddress?: string;
}

interface UnifiedWalletContextValue {
  isConnected: boolean;
  isEvmConnected: boolean;
  isSvmConnected: boolean;
  activeWallet: WalletEcosystem;
  address: string | null;
  evmAddress: `0x${string}` | null;
  svmAddress: string | null;
  evmChainId?: number;
  switchEvmChain: (targetChainId: number) => Promise<boolean>;
  connectEvm: () => Promise<void>;
  connectSvm: () => Promise<boolean>;
  disconnectActiveWallet: () => Promise<void>;
  getNativeBalance: (options?: NativeBalanceOptions) => Promise<BalanceResult | null>;
  getErc20Balance: (
    tokenAddress: `0x${string}`,
    options?: Erc20BalanceOptions
  ) => Promise<BalanceResult | null>;
  getSplTokenBalance: (
    mintAddress: string,
    options?: SplBalanceOptions
  ) => Promise<BalanceResult | null>;
}

const erc20Abi = [
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'decimals',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  },
  {
    type: 'function',
    name: 'symbol',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
  },
] as const;

const UnifiedWalletContext = createContext<UnifiedWalletContextValue | null>(null);

export function UnifiedWalletProvider({ children }: { children: React.ReactNode }) {
  const { open } = useAppKit();
  const { address: evmAddress, isConnected: isEvmConnected, chainId } = useAccount();
  const { disconnectAsync: disconnectEvm } = useDisconnect();
  const { switchChainAsync } = useSwitchChain();
  const publicClient = usePublicClient({ chainId });
  const { connection } = useConnection();
  const {
    wallets,
    wallet,
    select,
    connect: connectSvmWallet,
    disconnect: disconnectSvmWallet,
    connected: isSvmConnected,
    publicKey,
  } = useWallet();
  const walletRef = useRef(wallet);

  useEffect(() => {
    walletRef.current = wallet;
  }, [wallet]);

  const activeWallet: WalletEcosystem = isEvmConnected ? 'evm' : isSvmConnected ? 'svm' : null;
  const svmAddress = publicKey?.toBase58() ?? null;
  const address = evmAddress ?? svmAddress;
  const isConnected = Boolean(activeWallet);

  const connectEvm = useCallback(async () => {
    if (isSvmConnected && !isEvmConnected) {
      await disconnectSvmWallet();
    }
    await open({ view: 'Connect' });
  }, [isSvmConnected, isEvmConnected, disconnectSvmWallet, open]);

  const switchEvmChain = useCallback(
    async (targetChainId: number): Promise<boolean> => {
      if (!Number.isFinite(targetChainId) || targetChainId <= 0) return false;
      if (!isEvmConnected) return false;
      if (chainId === targetChainId) return true;
      if (!switchChainAsync) return false;
      try {
        await switchChainAsync({ chainId: targetChainId });
        return true;
      } catch {
        return false;
      }
    },
    [isEvmConnected, chainId, switchChainAsync]
  );

  const connectRef = useRef(connectSvmWallet);
  useEffect(() => {
    connectRef.current = connectSvmWallet;
  }, [connectSvmWallet]);

  const connectSvm = useCallback(async (): Promise<boolean> => {
    if (isEvmConnected && !isSvmConnected) {
      await disconnectEvm();
    }
    if (isSvmConnected) return true;

    const uniqueWallets = Array.from(
      new Map(wallets.map((item) => [item.adapter.name, item])).values()
    );
    const installed = uniqueWallets.filter((item) => item.readyState === WalletReadyState.Installed);
    const loadable = uniqueWallets.filter((item) => item.readyState === WalletReadyState.Loadable);
    const candidates = installed.length > 0 ? installed : loadable;

    if (candidates.length === 0) {
      throw new Error('No Solana wallet is available');
    }

    const preferred = ['Phantom', 'Solflare'];
    const target =
      candidates.find((item) => preferred.includes(String(item.adapter.name))) ?? candidates[0];

    const isWalletNotSelectedError = (error: unknown) => {
      if (!error) return false;
      const maybe = error as { name?: unknown; message?: unknown };
      const errorName = typeof maybe.name === 'string' ? maybe.name : '';
      const errorMessage = typeof maybe.message === 'string' ? maybe.message : '';
      return (
        errorName === 'WalletNotSelectedError' ||
        errorMessage.includes('WalletNotSelectedError') ||
        errorMessage.toLowerCase().includes('wallet not selected')
      );
    };

    const maxAttempts = 10;
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      try {
        // Ensure adapter selection is applied before connect call.
        if (!walletRef.current || walletRef.current.adapter.name !== target.adapter.name) {
          select(target.adapter.name);
          // Wait for state update to propagate
          await new Promise((resolve) => setTimeout(resolve, 150));
        }

        // Wait for selected wallet state to settle before connect.
        if (!walletRef.current || walletRef.current.adapter.name !== target.adapter.name) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          continue;
        }

        // Use the ref to ensure we call the latest connect function
        // which is bound to the currently selected adapter
        await connectRef.current();
        return true;
      } catch (error) {
        if (!isWalletNotSelectedError(error)) {
          // Start: Specific handling for when the wallet is already connected but
          // the state hasn't fully propagated or there's a race condition
          const msg = error instanceof Error ? error.message : String(error);
          if (msg.includes('already connected') || msg.includes('Wallet is connected')) {
            return true;
          }
          // End: Specific handling
          console.error('Connection error:', error);
          // If it's a different error, we might still want to retry a bit if it's transient,
          // but usually other errors are fatal.
          // However, sometimes "WalletDisconnectedError" happens if the popup is closed.
          // Let's rethrow if it's not a selection error.
          if (msg.includes('User rejected') || msg.includes('Hammer')) { // Hammer is sometimes used for "User rejected"
            throw error;
          }
        }

        // If it IS a WalletNotSelectedError, we retry.
        if (attempt === maxAttempts - 1) {
          // Last attempt failed
          return false;
        }
        await new Promise((resolve) => setTimeout(resolve, 200 + attempt * 50));
      }
    }
    return false;
  }, [isEvmConnected, isSvmConnected, wallets, select, disconnectEvm]);

  const disconnectActiveWallet = useCallback(async () => {
    if (isEvmConnected) {
      await disconnectEvm();
      return;
    }
    if (isSvmConnected) {
      await disconnectSvmWallet();
    }
  }, [disconnectEvm, disconnectSvmWallet, isEvmConnected, isSvmConnected]);

  useEffect(() => {
    if (isEvmConnected && isSvmConnected) {
      void disconnectSvmWallet();
    }
  }, [isEvmConnected, isSvmConnected, disconnectSvmWallet]);

  const getNativeBalance = useCallback(
    async (options?: NativeBalanceOptions): Promise<BalanceResult | null> => {
      const ecosystem = options?.ecosystem ?? activeWallet;
      if (!ecosystem) return null;

      if (ecosystem === 'evm') {
        const targetAddress = (options?.address ?? evmAddress) as `0x${string}` | undefined;
        if (!targetAddress || !publicClient) return null;
        const raw = await publicClient.getBalance({ address: targetAddress });
        return {
          raw: raw.toString(),
          formatted: formatUnits(raw, 18),
          decimals: 18,
          symbol: 'ETH',
        };
      }

      const owner = options?.address ?? svmAddress;
      if (!owner) return null;
      const lamports = await connection.getBalance(new PublicKey(owner));
      const raw = BigInt(lamports);
      return {
        raw: raw.toString(),
        formatted: formatUnits(raw, 9),
        decimals: 9,
        symbol: 'SOL',
      };
    },
    [activeWallet, evmAddress, publicClient, svmAddress, connection]
  );

  const getErc20Balance = useCallback(
    async (
      tokenAddress: `0x${string}`,
      options?: Erc20BalanceOptions
    ): Promise<BalanceResult | null> => {
      const owner = options?.address ?? evmAddress;
      if (!owner || !publicClient) return null;

      const [rawBalance, tokenDecimals, symbol] = await Promise.all([
        publicClient.readContract({
          address: tokenAddress,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [owner],
        }),
        typeof options?.decimals === 'number'
          ? Promise.resolve(options.decimals)
          : publicClient.readContract({
            address: tokenAddress,
            abi: erc20Abi,
            functionName: 'decimals',
          }).then((v) => Number(v)),
        publicClient
          .readContract({
            address: tokenAddress,
            abi: erc20Abi,
            functionName: 'symbol',
          })
          .catch(() => 'TOKEN'),
      ]);

      const raw = rawBalance as bigint;
      const decimals = Number(tokenDecimals);
      return {
        raw: raw.toString(),
        formatted: formatUnits(raw, decimals),
        decimals,
        symbol: String(symbol),
      };
    },
    [evmAddress, publicClient]
  );

  const getSplTokenBalance = useCallback(
    async (mintAddress: string, options?: SplBalanceOptions): Promise<BalanceResult | null> => {
      const ownerAddress = options?.ownerAddress ?? svmAddress;
      if (!ownerAddress) return null;

      const ownerPublicKey = new PublicKey(ownerAddress);
      const mintPublicKey = new PublicKey(mintAddress);
      const accounts = await connection.getParsedTokenAccountsByOwner(ownerPublicKey, {
        mint: mintPublicKey,
      });

      if (!accounts.value.length) {
        return {
          raw: '0',
          formatted: '0',
          decimals: 0,
          symbol: 'SPL',
        };
      }

      let raw = BigInt(0);
      let decimals = 0;

      for (const account of accounts.value) {
        const parsed = account.account.data.parsed?.info?.tokenAmount;
        const amount = parsed?.amount ?? '0';
        const tokenDecimals = Number(parsed?.decimals ?? 0);
        raw += BigInt(amount);
        decimals = tokenDecimals;
      }

      return {
        raw: raw.toString(),
        formatted: formatUnits(raw, decimals),
        decimals,
        symbol: 'SPL',
      };
    },
    [connection, svmAddress]
  );

  const value = useMemo<UnifiedWalletContextValue>(
    () => ({
      isConnected,
      isEvmConnected,
      isSvmConnected,
      activeWallet,
      address,
      evmAddress: evmAddress ?? null,
      svmAddress,
      evmChainId: chainId,
      switchEvmChain,
      connectEvm,
      connectSvm,
      disconnectActiveWallet,
      getNativeBalance,
      getErc20Balance,
      getSplTokenBalance,
    }),
    [
      isConnected,
      isEvmConnected,
      isSvmConnected,
      activeWallet,
      address,
      evmAddress,
      svmAddress,
      chainId,
      switchEvmChain,
      connectEvm,
      connectSvm,
      disconnectActiveWallet,
      getNativeBalance,
      getErc20Balance,
      getSplTokenBalance,
    ]
  );

  return <UnifiedWalletContext.Provider value={value}>{children}</UnifiedWalletContext.Provider>;
}

export function useUnifiedWallet() {
  const context = useContext(UnifiedWalletContext);
  if (!context) {
    throw new Error('useUnifiedWallet must be used within UnifiedWalletProvider');
  }
  return context;
}
