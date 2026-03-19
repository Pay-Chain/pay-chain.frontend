import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.resolve ??= {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "pino-pretty": false,
      porto: false,
      "porto/internal": false,
      "@coinbase/wallet-sdk": false,
      "@gemini-wallet/core": false,
      "@metamask/sdk": false,
      "@walletconnect/ethereum-provider": false,
    };
    return config;
  },
};

export default nextConfig;
