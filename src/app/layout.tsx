import type { Metadata } from 'next';
import { headers } from 'next/headers';
import './globals.css';
import { I18nProvider } from '@/presentation/providers';
import Web3Provider from '@/presentation/providers/Web3Provider';
import SolanaProvider from '@/presentation/providers/SolanaProvider';

export const metadata: Metadata = {
  title: 'Pay-Chain',
  description: 'Cross-chain Stablecoin Payment Gateway',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookies = (await headers()).get('cookie');

  return (
    <html lang="en">
      <body className={`antialiased font-sans`}>
        <I18nProvider>
          <Web3Provider cookies={cookies}>
            <SolanaProvider>{children}</SolanaProvider>
          </Web3Provider>
        </I18nProvider>
      </body>
    </html>
  );
}

