'use client';

import * as React from 'react';
import { Button } from '@/presentation/components/atoms';
import { Wallet } from 'lucide-react';
import { useAppKit } from '@reown/appkit/react';

export type ChainType = 'evm' | 'svm';

export interface WalletConnectButtonProps {
  chainType: ChainType;
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const chainConfig: Record<ChainType, { label: string; icon: string; gradient: string }> = {
  evm: {
    label: 'Connect EVM',
    icon: '⟠', // Ethereum symbol
    gradient: 'from-[#627EEA] via-[#8B9FEF] to-[#627EEA]',
  },
  svm: {
    label: 'Connect SVM',
    icon: '◎', // Solana symbol
    gradient: 'from-[#9945FF] via-[#14F195] to-[#9945FF]',
  },
};

export function WalletConnectButton({ 
  chainType, 
  size = 'default',
  className = '',
}: WalletConnectButtonProps) {
  const { open } = useAppKit();
  
  const config = chainConfig[chainType];
  
  const handleConnect = () => {
    // Open AppKit modal - it will handle the chain selection
    open({ view: 'Connect' });
  };

  return (
    <Button
      variant="primary"
      size={size}
      onClick={handleConnect}
      className={`group ${className}`}
    >
      <span className="text-lg mr-1">{config.icon}</span>
      <span>{config.label}</span>
      <Wallet className="w-4 h-4 ml-1 opacity-70 group-hover:opacity-100 transition-opacity" />
    </Button>
  );
}

export default WalletConnectButton;
