'use client';

import { Card, Badge, Button } from '@/presentation/components/atoms';
import { StatCard } from '@/presentation/components/molecules';
import { useTranslation } from '@/presentation/hooks';
import { Activity, Zap, TrendingUp, ShieldCheck, BarChart3 } from 'lucide-react';

export function MerchantDashboardView() {
  const { t } = useTranslation();

  return (
    <div className="space-y-12 animate-fade-in group/merchant pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
            <h1 className="text-5xl font-black tracking-tight text-white italic">
                {t('merchant_dashboard_view.title')}
                <span className="text-primary">.</span>
            </h1>
            <p className="text-xl text-white/50 max-w-2xl font-medium tracking-tight">
                {t('merchant_dashboard_view.subtitle')}
            </p>
        </div>
        <Button variant="outline" className="h-14 px-8 rounded-2xl bg-white/5 border-white/10 font-bold hover:bg-white/10 transition-all flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-primary" />
            Full Performance Analysis
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <Card variant="glass" className="lg:col-span-2 p-12 rounded-[3rem] group hover:border-primary/30 transition-all duration-500 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                <ShieldCheck className="w-64 h-64 -rotate-12" />
            </div>
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <Badge variant="success" className="px-4 py-1.5 rounded-full border-accent-green/20 text-[10px] font-black uppercase tracking-[0.2em]">Institutional Status: Active</Badge>
                    <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest italic">Syncing with Node Cluster...</div>
                </div>
                <div className="space-y-6">
                    <h2 className="text-3xl font-black text-white">Institutional Overview</h2>
                    <p className="text-white/40 leading-relaxed text-sm max-w-xl">
                        Your merchant engine is fully operational. We are currently processing settlements with zero latency across Ethereum, Base, and Solana clusters.
                    </p>
                    <div className="pt-6 flex gap-4">
                        <Button className="h-14 px-10 rounded-2xl bg-primary hover:bg-primary/80 font-black shadow-glow-purple text-lg">
                            Monitor Real-time Flow
                        </Button>
                    </div>
                </div>
            </div>
        </Card>

        <StatCard 
            label="Network Reliability"
            value="99.9%"
            icon={Activity}
            color="text-accent-green"
            bg="bg-accent-green/5"
            glow="shadow-glow-green/10"
            trend="High Availability Cluster"
        />
      </div>

      {/* Quick Action Dashboard Area */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
                label="Daily Receipts"
                value="2.4k"
                icon={TrendingUp}
                color="text-accent-blue"
                bg="bg-accent-blue/5"
                glow="shadow-glow-blue/10"
                onClick={() => {}}
            />
            <StatCard 
                label="Active Webhooks"
                value="12"
                icon={Zap}
                color="text-warning"
                bg="bg-warning/5"
                glow="shadow-glow-orange/10"
                onClick={() => {}}
            />
      </div>
    </div>
  );
}
