import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import './globals.css';
import { I18nProvider } from '@/presentation/providers';
import Web3Provider from '@/presentation/providers/Web3Provider';
import SolanaProvider from '@/presentation/providers/SolanaProvider';

export const viewport: Viewport = {
  themeColor: '#0D0D0D',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Pay-Chain | Cross-Chain Stablecoin Payments',
  description: 'The fastest way to send and receive cross-chain stablecoin payments. Built for the future of decentralized finance.',
  keywords: ['crypto', 'payments', 'stablecoin', 'cross-chain', 'defi', 'solana', 'ethereum'],
  openGraph: {
    title: 'Pay-Chain | Cross-Chain Stablecoin Payments',
    description: 'The fastest way to send and receive cross-chain stablecoin payments.',
    type: 'website',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookies = (await headers()).get('cookie');

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased font-sans bg-background text-foreground min-h-screen">
        {/* Background mesh gradient */}
        <div className="fixed inset-0 bg-mesh pointer-events-none" />
        
        {/* Animated gradient orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent-purple/20 rounded-full blur-3xl animate-glow-pulse" />
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-accent-green/10 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: '4s' }} />
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          <I18nProvider>
            <Web3Provider cookies={cookies}>
              <SolanaProvider>{children}</SolanaProvider>
            </Web3Provider>
          </I18nProvider>
        </div>
      </body>
    </html>
  );
}
