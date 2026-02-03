import { cookieStorage, createStorage } from 'wagmi';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { mainnet, arbitrum, base, optimism, polygon, sepolia } from '@reown/appkit/networks';
import { ENV } from '@/core/config/env';


// Get projectId from env
export const projectId = ENV.WALLETCONNECT_PROJECT_ID;

// Define networks
export const networks = [mainnet, arbitrum, base, optimism, polygon, sepolia];

// Create wagmiAdapter
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});
