'use client';

import React from 'react';
import { Smartphone, Wallet, QrCode } from 'lucide-react';

export type MethodType = 'dompetku' | 'wallet' | 'manual';

interface MethodSelectorProps {
  activeMethod: MethodType;
  onChange: (method: MethodType) => void;
}

const Tab = ({ active, onClick, label, icon: Icon }: { active: boolean, onClick: () => void, label: string, icon: any }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 ${
      active 
        ? 'bg-pk-brand text-white shadow-lg scale-105 z-10' 
        : 'text-pk-text-secondary hover:bg-white/5 hover:text-pk-text-primary'
    }`}
  >
    <Icon className={`w-6 h-6 mb-2 ${active ? 'animate-pulse' : ''}`} />
    <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
  </button>
);

export const MethodSelector = ({ activeMethod, onChange }: MethodSelectorProps) => {
  return (
    <div className="flex space-x-2 bg-slate-900/50 p-1.5 rounded-2xl border border-pk-border backdrop-blur-sm">
      <Tab 
        active={activeMethod === 'dompetku'} 
        onClick={() => onChange('dompetku')}
        label="DompetKu"
        icon={Smartphone}
      />
      <Tab 
        active={activeMethod === 'wallet'} 
        onClick={() => onChange('wallet')}
        label="Wallet"
        icon={Wallet}
      />
      <Tab 
        active={activeMethod === 'manual'} 
        onClick={() => onChange('manual')}
        label="Manual"
        icon={QrCode}
      />
    </div>
  );
};
