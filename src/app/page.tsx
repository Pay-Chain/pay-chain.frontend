'use client';

import Link from 'next/link';
import { useAuthStore } from '@/presentation/hooks';
import { Button, Card } from '@/presentation/components/atoms';
import Navbar from '@/presentation/components/organisms/Navbar';
import { ArrowRight, Zap, Coins, Link as LinkIcon, Shield, Sparkles, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated } = useAuthStore();

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Cross-Chain Payments',
      description: 'Send stablecoins across Base, BSC, and Solana seamlessly',
      color: 'purple',
    },
    {
      icon: <Coins className="w-8 h-8" />,
      title: 'Low Fees',
      description: 'Hybrid fee model: 0.3% + $0.50 base fee with merchant discounts',
      color: 'green',
    },
    {
      icon: <LinkIcon className="w-8 h-8" />,
      title: 'Multiple Bridges',
      description: 'Automatic bridge selection: CCIP, Hyperlane, and Hyperbridge',
      color: 'blue',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Secure',
      description: 'Non-custodial smart contracts with multi-layer security',
      color: 'amber',
    },
  ];

  const getFeatureColors = (color: string) => {
    const colors: Record<string, { bg: string; icon: string; border: string }> = {
      purple: { bg: 'bg-accent-purple/10', icon: 'text-accent-purple', border: 'group-hover:border-accent-purple/30' },
      green: { bg: 'bg-accent-green/10', icon: 'text-accent-green', border: 'group-hover:border-accent-green/30' },
      blue: { bg: 'bg-accent-blue/10', icon: 'text-accent-blue', border: 'group-hover:border-accent-blue/30' },
      amber: { bg: 'bg-amber-500/10', icon: 'text-amber-400', border: 'group-hover:border-amber-500/30' },
    };
    return colors[color] || colors.purple;
  };

  const supportedChains = [
    { name: 'Base', logo: '🔵', color: 'from-blue-500 to-blue-600' },
    { name: 'BSC', logo: '🟡', color: 'from-yellow-500 to-yellow-600' },
    { name: 'Solana', logo: '🟣', color: 'from-purple-500 to-purple-600' },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20">
        <div className="section-padding">
          <div className="container-app text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-green/10 border border-accent-green/30 mb-8 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
              <span className="text-sm text-accent-green font-medium">Live on Mainnet</span>
              <Sparkles className="w-4 h-4 text-accent-green" />
            </div>

            {/* Headline */}
            <h1 className="heading-display animate-fade-in-up">
              <span className="block text-foreground">Cross-Chain</span>
              <span className="block text-transparent bg-clip-text bg-gradient-solana">
                Stablecoin Payments
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-8 max-w-2xl body-lg animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              Send and receive stablecoin payments across multiple blockchains. Low fees, fast
              settlement, automatic bridge selection.
            </p>

            {/* CTAs */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <Link href={isAuthenticated ? '/dashboard' : '/register'}>
                <Button variant="primary" size="lg" glow className="group">
                  Start Building
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/docs">
                <Button variant="secondary" size="lg">
                  View Documentation
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>

            {/* Supported chains */}
            <div className="mt-24 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <p className="label mb-6 uppercase tracking-wider">Supported Networks</p>
              <div className="flex flex-wrap justify-center gap-4">
                {supportedChains.map((chain, index) => (
                  <div
                    key={chain.name}
                    className="card-hover flex items-center gap-3 px-5 py-3 cursor-default"
                    style={{ animationDelay: `${400 + index * 50}ms` }}
                  >
                    <span className="text-2xl">{chain.logo}</span>
                    <span className="text-foreground font-medium">{chain.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 relative z-10">
        <div className="container-app">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-purple/10 border border-accent-purple/20 mb-4">
              <Zap className="w-4 h-4 text-accent-purple" />
              <span className="text-xs text-accent-purple font-medium uppercase tracking-wider">Features</span>
            </div>
            <h2 className="heading-1 text-foreground">Why Pay-Chain?</h2>
            <p className="mt-4 body-lg">Built for the multi-chain future</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const colorStyles = getFeatureColors(feature.color);
              return (
                <Card
                  key={feature.title}
                  variant="glass"
                  size="md"
                  hoverable
                  className={`h-full flex flex-col ${colorStyles.border}`}
                >
                  <div className={`w-12 h-12 rounded-xl ${colorStyles.bg} ${colorStyles.icon} flex items-center justify-center mb-4 transition-all duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted leading-relaxed flex-1">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <div className="container-app">
          <div className="text-center max-w-2xl mx-auto card-glass px-8 py-12 sm:px-12 shadow-glass">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-green/10 border border-accent-green/20 mb-6">
              <Sparkles className="w-4 h-4 text-accent-green" />
              <span className="text-xs text-accent-green font-medium">Get Started</span>
            </div>
            <h2 className="heading-2 text-foreground mb-4">Ready to get started?</h2>
            <p className="body-lg mb-8">
              Create your account and start accepting cross-chain payments today.
            </p>
            <Link href={isAuthenticated ? '/dashboard' : '/register'}>
              <Button variant="primary" size="lg" glow>
                Create Account
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="container-app text-center">
          <p className="text-muted text-sm">
            © {new Date().getFullYear()} Pay-Chain. Built for the future of payments.
          </p>
        </div>
      </footer>
    </div>
  );
}
