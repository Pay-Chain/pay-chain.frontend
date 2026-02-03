'use client';

import Link from 'next/link';
import { useAuthStore } from '@/presentation/hooks';
import { Button } from '@/presentation/components/atoms';
import Navbar from '@/presentation/components/organisms/Navbar';
import { ArrowRight, Zap, Coins, Link as LinkIcon, Shield } from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated } = useAuthStore();

  const features = [
    {
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      title: 'Cross-Chain Payments',
      description: 'Send stablecoins across Base, BSC, and Solana seamlessly',
    },
    {
      icon: <Coins className="w-8 h-8 text-emerald-400" />,
      title: 'Low Fees',
      description: 'Hybrid fee model: 0.3% + $0.50 base fee with merchant discounts',
    },
    {
      icon: <LinkIcon className="w-8 h-8 text-blue-400" />,
      title: 'Multiple Bridges',
      description: 'Automatic bridge selection: CCIP, Hyperlane, and Hyperbridge',
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-400" />,
      title: 'Secure',
      description: 'Non-custodial smart contracts with multi-layer security',
    },
  ];

  const supportedChains = [
    { name: 'Base', logo: '🔵' },
    { name: 'BSC', logo: '🟡' },
    { name: 'Solana', logo: '🟣' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-20">
        {/* Decorative gradient blobs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl"></div>

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/20 border border-blue-500/30 mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-sm text-blue-200 font-medium">Live on Mainnet</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white">
              <span className="block">Cross-Chain</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                Stablecoin Payments
              </span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg md:text-xl text-white/60 leading-relaxed">
              Send and receive stablecoin payments across multiple blockchains. Low fees, fast
              settlement, automatic bridge selection.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href={isAuthenticated ? '/dashboard' : '/register'}>
                <Button size="lg" className="px-8 py-6 text-lg">
                  Start Building <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/docs">
                <Button variant="secondary" size="lg" className="px-8 py-6 text-lg">
                  View Documentation
                </Button>
              </Link>
            </div>

            {/* Supported chains */}
            <div className="mt-20">
              <p className="text-white/40 text-sm mb-6 uppercase tracking-wider">Supported Networks</p>
              <div className="flex flex-wrap justify-center gap-8">
                {supportedChains.map((chain) => (
                  <div
                    key={chain.name}
                    className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-default"
                  >
                    <span className="text-2xl">{chain.logo}</span>
                    <span className="text-white/70 font-medium">{chain.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 lg:py-32 relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Why Pay-Chain?</h2>
            <p className="mt-4 text-white/50 text-lg">Built for the multi-chain future</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="mb-5 transition-transform duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-purple-900/10 to-blue-900/20"></div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto p-12 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to get started?</h2>
            <p className="text-white/60 mb-8 text-lg">
              Create your account and start accepting cross-chain payments today.
            </p>
            <Link href={isAuthenticated ? '/dashboard' : '/register'}>
              <Button size="lg" className="px-10 py-4">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
