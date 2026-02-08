'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/presentation/hooks';
import { Button, Card } from '@/presentation/components/atoms';
import Navbar from '@/presentation/components/organisms/Navbar';
import {
  ArrowRight,
  Zap,
  Coins,
  Link as LinkIcon,
  Shield,
  Sparkles,
  ChevronRight,
  Globe,
  RefreshCw,
  Wallet,
  CheckCircle2,
  Clock,
  Activity
} from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated } = useAuthStore();

  const paymentRequestExample = `{
  "id": "prq_01H…",
  "chainId": "eip155:8453",
  "contractAddress": "0xGateway…",
  "amount": "1000000",
  "decimals": 6,
  "txData": { "to": "0xGateway…", "hex": "0x…" },
  "expiresAt": "2026-01-18T12:34:56Z"
}

// Solana variant:
// txData: { "base64": "…" }`;

  const feeFormulaExample = `Total Charged = Amount + Total Fee
Total Fee = max(Fixed Base Fee, Percentage Fee) + Bridge Fee + Gas Fee

If FAILED:
→ Refund = Amount (100% returned)
→ Fee is NOT refunded`;

  const features = [
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Multi-Chain Support',
      description: 'Send payments across EVM chains and Solana using CCIP & Hyperbridge with consistent CAIP-2 chain identifiers.',
      color: 'blue',
    },
    {
      icon: <RefreshCw className="w-8 h-8" />,
      title: 'Auto-Swap',
      description: 'Pay in USDT, settle in USDC. DEX routing (Uniswap v4 / Jupiter) swaps stablecoins automatically.',
      color: 'green',
    },
    {
      icon: <LinkIcon className="w-8 h-8" />,
      title: 'Payment Requests',
      description: 'Create a shareable pay link. Backend returns ready-to-sign txData (EVM hex / Solana base64) with 15-minute expiry.',
      color: 'purple',
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: 'Real-time Tracking',
      description: 'Track request and payment status (pending/completed/expired) from dashboard, powered by on-chain events + indexer.',
      color: 'blue',
    },
    {
      icon: <RefreshCw className="w-8 h-8" />,
      title: 'RPC Failover',
      description: 'Multiple RPC providers per chain with automatic failover to keep payments reliable during network outages.',
      color: 'amber',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: '100% Refund Guarantee',
      description: 'If a cross-chain attempt fails, the full amount is refunded to the sender automatically (fees excluded).',
      color: 'amber',
    },
    {
      icon: <CheckCircle2 className="w-8 h-8" />,
      title: 'Verified Merchants',
      description: 'Transact with confidence. Only verified Partner, Corporate, UMKM, and Retail merchants can receive payments.',
      color: 'purple',
    },
    {
      icon: <Wallet className="w-8 h-8" />,
      title: 'Wallet-First Security',
      description: 'Wallet is mandatory on registration. Adding a new wallet triggers verification checks (KYC), except admin accounts.',
      color: 'green',
    },
  ];

  const steps = [
    {
      icon: <Wallet className="w-6 h-6" />,
      title: 'Connect Wallet',
      description: 'Connect your EVM or Solana wallet (non-custodial by design).',
    },
    {
      icon: <Coins className="w-6 h-6" />,
      title: 'Create Request',
      description: 'Define amount/token. Get contract + txData (hex/base64) that expires in 15 minutes.',
    },
    {
      icon: <ArrowRight className="w-6 h-6" />,
      title: 'Sign & Pay',
      description: 'Open the pay link and sign the prepared transaction inside your wallet.',
    },
    {
      icon: <CheckCircle2 className="w-6 h-6" />,
      title: 'Track & Settle',
      description: 'Indexer confirms on-chain events and updates status. If failed, amount is refunded automatically.',
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
    { name: 'Base', logo: '/chain/base-icon.svg', width: 28, height: 28 },
    { name: 'Arbitrum', logo: '/chain/arbitrum-icon.svg', width: 28, height: 28 },
    { name: 'Solana', logo: '/chain/solana-icon.svg', width: 24, height: 24 },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[10%] left-[20%] w-96 h-96 bg-accent-purple/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-accent-blue/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '6s' }} />
        </div>

        <div className="section-padding">
          <div className="container-app text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-green/10 border border-accent-green/30 mb-8 animate-fade-in backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
              <span className="text-sm text-accent-green font-medium">Mainnet is Live</span>
              <Sparkles className="w-4 h-4 text-accent-green" />
            </div>

            {/* Headline */}
            <h1 className="heading-display animate-fade-in-up mx-auto max-w-4xl">
              <img
                src="/logo.png"
                alt="Pay-Chain Logo"
                className="block mx-auto h-50 w-50 object-contain transition-transform duration-300 group-hover:scale-110"
              />
              <span className="block text-foreground mb-2 text-6xl">Pay-Chain</span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-6 max-w-2xl body-lg text-muted animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              Pay-Chain is a non-custodial cross-chain stablecoin payment gateway for EVM chains and Solana.
              Generate payment requests with ready-to-sign transaction data (EVM hex / Solana base64),
              auto-swap stablecoins via DEX routing, and track every payment end-to-end in real time.
            </p>

            {/* Quick Highlights */}
            <div className="mx-auto mt-10 max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
              <Card variant="glass" size="sm" className="text-left">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-purple/10 text-accent-purple flex items-center justify-center">
                    <LinkIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-foreground font-semibold">Payment Requests</p>
                    <p className="text-sm text-muted mt-1">
                      Share a pay link with contract + txData, ready for wallet signing.
                    </p>
                  </div>
                </div>
              </Card>
              <Card variant="glass" size="sm" className="text-left">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-green/10 text-accent-green flex items-center justify-center">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-foreground font-semibold">Bridge + Swap</p>
                    <p className="text-sm text-muted mt-1">
                      Automatic stablecoin conversion and bridge selection for best execution.
                    </p>
                  </div>
                </div>
              </Card>
              <Card variant="glass" size="sm" className="text-left">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-foreground font-semibold">Refund Policy</p>
                    <p className="text-sm text-muted mt-1">
                      If a cross-chain attempt fails, your amount is refunded (fees excluded).
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Supported chains */}
            <div className="mt-20 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <p className="label mb-6 uppercase tracking-wider text-muted/60">Supported Networks</p>
              <div className="flex flex-wrap justify-center gap-6">
                {supportedChains.map((chain, index) => (
                  <div
                    key={chain.name}
                    className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-default animate-fade-in hover:scale-105 duration-300"
                    style={{ animationDelay: `${400 + index * 100}ms` }}
                  >
                    <Image
                      src={chain.logo}
                      alt={chain.name}
                      width={chain.width}
                      height={chain.height}
                      className="object-contain"
                    />
                    <span className="text-foreground font-medium">{chain.name}</span>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-xs text-muted/70 max-w-2xl mx-auto">
                Plus Ethereum, Polygon, Optimism, and more EVM networks — with CAIP-2 chain IDs for consistent routing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative z-10 bg-black/20 backdrop-blur-sm">
        <div className="container-app">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-purple/10 border border-accent-purple/20 mb-4">
              <Zap className="w-4 h-4 text-accent-purple" />
              <span className="text-xs text-accent-purple font-medium uppercase tracking-wider">Features</span>
            </div>
            <h2 className="heading-1 text-foreground">Why Pay-Chain?</h2>
            <p className="mt-4 body-lg text-muted">Built for the multi-chain future</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const colorStyles = getFeatureColors(feature.color);
              return (
                <div key={feature.title} className="animate-fade-in-up h-full" style={{ animationDelay: `${index * 100}ms` }}>
                  <Card
                    variant="glass"
                    size="md"
                    hoverable
                    className={`h-full flex flex-col ${colorStyles.border}`}
                  >
                    <div className={`w-12 h-12 rounded-xl ${colorStyles.bg} ${colorStyles.icon} flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted leading-relaxed flex-1">{feature.description}</p>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container-app">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-blue/10 border border-accent-blue/20 mb-4">
              <RefreshCw className="w-4 h-4 text-accent-blue" />
              <span className="text-xs text-accent-blue font-medium uppercase tracking-wider">How It Works</span>
            </div>
            <h2 className="heading-1 text-foreground">Seamless Experience</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden lg:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-linear-to-r from-accent-purple/20 via-accent-blue/20 to-accent-green/20 -z-10" />

            {steps.map((step, index) => (
              <div key={step.title} className="relative flex flex-col items-center text-center animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-glass backdrop-blur-md z-10 group hover:scale-110 transition-transform duration-300">
                  <div className="text-accent-blue group-hover:text-accent-purple transition-colors">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted text-sm max-w-[200px]">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 max-w-3xl mx-auto text-center animate-fade-in-up" style={{ animationDelay: '700ms' }}>
            <p className="text-muted leading-relaxed">
              Payment requests expire in <strong className="text-foreground">15 minutes</strong>.
              If the cross-chain execution fails, the protocol refunds the <strong className="text-foreground">amount</strong> automatically
              (fees are used for gas/bridge attempts and are not refunded).
            </p>
          </div>
        </div>
      </section>

      {/* Payment Requests Section */}
      <section className="py-24 relative z-10 bg-black/20 backdrop-blur-sm overflow-hidden">
        <div className="container-app">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-purple/10 border border-accent-purple/20 mb-4">
              <LinkIcon className="w-4 h-4 text-accent-purple" />
              <span className="text-xs text-accent-purple font-medium uppercase tracking-wider">Payment Requests</span>
            </div>
            <h2 className="heading-1 text-foreground">Ready-to-Sign Transaction Data</h2>
            <p className="mt-4 body-lg text-muted max-w-3xl mx-auto">
              Merchants generate a pay link that includes everything a wallet needs to sign: contract address, amount, decimals, chainId, and txData.
              EVM uses <strong className="text-foreground">hex calldata</strong>; Solana uses <strong className="text-foreground">base64 transaction</strong>.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <div className="card-glass p-8">
                <h3 className="heading-3 mb-4">What you get</h3>
                <ul className="space-y-4">
                  {[
                    'A shareable URL (e.g., /pay/{requestId}) for a one-click payment experience.',
                    'txData is pre-built: the payer only reviews and signs in their wallet.',
                    'Chain identifiers follow CAIP-2 format (eip155:* / solana:*).',
                    'Requests are time-boxed to reduce price/routing drift and limit risk.'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted">
                      <div className="mt-2 w-1.5 h-1.5 rounded-full bg-accent-purple" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card-glass p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-5 h-5 text-accent-green" />
                  <h3 className="heading-3">Expiration by design</h3>
                </div>
                <p className="text-muted leading-relaxed">
                  Every request expires in <strong className="text-foreground">15 minutes</strong>.
                  This keeps execution deterministic and helps prevent stuck or stale requests during volatile network conditions.
                </p>
              </div>
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="card-glass p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-accent-blue/10 rounded-full blur-[100px] -mr-32 -mt-32" />
                <div className="bg-black/40 rounded-xl p-6 border border-white/5 font-mono text-sm leading-relaxed overflow-x-auto custom-scrollbar">
                  <div className="text-accent-purple mb-2">// Example backend response</div>
                  <pre className="text-muted/90 whitespace-pre-wrap">{paymentRequestExample}</pre>
                </div>
                <p className="mt-4 text-xs text-muted/70">
                  Tip: The pay page will automatically prompt the correct wallet flow (EVM or Solana) based on <code className="text-foreground">chainId</code>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fees & Refund Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container-app">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
              <Shield className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-amber-400 font-medium uppercase tracking-wider">Fees & Refund</span>
            </div>
            <h2 className="heading-1 text-foreground">Transparent Fees, Amount-Back Guarantee</h2>
            <p className="mt-4 body-lg text-muted max-w-3xl mx-auto">
              Pay-Chain charges a fee for execution (gas/bridge/swap).
              If execution fails, the protocol refunds the <strong className="text-foreground">amount</strong> — fees are excluded.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="card-glass p-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <h3 className="heading-3 mb-4">Fee & refund formula</h3>
              <div className="bg-black/40 rounded-xl p-6 border border-white/5 font-mono text-sm leading-relaxed overflow-x-auto custom-scrollbar">
                <pre className="text-muted/90 whitespace-pre-wrap">{feeFormulaExample}</pre>
              </div>
              <p className="mt-4 text-sm text-muted leading-relaxed">
                Fees cover bridge attempts, on-chain execution, and routing. If you need deterministic accounting, use payment requests so the payer signs a pre-quoted transaction.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <Card variant="glass" size="md" className="h-full">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-green/10 text-accent-green flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-foreground font-semibold">Request TTL</p>
                    <p className="text-sm text-muted mt-1">15-minute expiry to prevent stale or risky execution.</p>
                  </div>
                </div>
              </Card>

              <Card variant="glass" size="md" className="h-full">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-blue/10 text-accent-blue flex items-center justify-center">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-foreground font-semibold">Settlement target</p>
                    <p className="text-sm text-muted mt-1">Designed for under ~2 minutes average settlement.</p>
                  </div>
                </div>
              </Card>

              <Card variant="glass" size="md" className="h-full">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-purple/10 text-accent-purple flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-foreground font-semibold">Success target</p>
                    <p className="text-sm text-muted mt-1">Built to exceed 99% execution success rate.</p>
                  </div>
                </div>
              </Card>

              <Card variant="glass" size="md" className="h-full">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-foreground font-semibold">Refund scope</p>
                    <p className="text-sm text-muted mt-1">100% amount refunded on failure (fees excluded).</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="container-app">
          <div className="text-center max-w-3xl mx-auto card-glass px-8 py-16 shadow-glass relative group animate-fade-in-up">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-linear-to-r from-accent-purple/10 to-accent-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-green/10 border border-accent-green/20 mb-6">
                <Sparkles className="w-4 h-4 text-accent-green" />
                <span className="text-xs text-accent-green font-medium">Get Started</span>
              </div>
              <h2 className="heading-2 text-foreground mb-6">Ready to transform your payments?</h2>
              <p className="body-lg text-muted mb-10 max-w-xl mx-auto">
                Join verified merchants and users leveraging the power of cross-chain liquidity.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href={isAuthenticated ? '/dashboard' : '/register'}>
                  <Button variant="primary" size="lg" glow>
                    Start Accepting Crypto
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 bg-black/40">
        <div className="container-app">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-muted text-sm">
              © {new Date().getFullYear()} Pay-Chain. All rights reserved.
            </p>
            <div className="flex gap-8 text-sm text-muted">
              <Link href="/about" className="hover:text-white transition-colors">About Protocol</Link>
              <Link href="/team" className="hover:text-white transition-colors">Team</Link>
              <Link href="/docs" className="hover:text-white transition-colors">Documentation</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
