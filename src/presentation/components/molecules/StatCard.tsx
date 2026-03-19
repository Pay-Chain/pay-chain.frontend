'use client';

import { LucideIcon, ArrowUpRight } from 'lucide-react';
import { Card } from '@/presentation/components/atoms';
import { cn } from '@/core/utils/cn';

export interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendVariant?: 'success' | 'warning' | 'destructive';
  color?: string;
  bg?: string;
  glow?: string;
  className?: string;
  onClick?: () => void;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  color = 'text-primary',
  bg = 'bg-primary/5',
  glow = 'shadow-glow-purple/10',
  className,
  onClick,
}: StatCardProps) {
  return (
    <Card 
      onClick={onClick}
      hoverable={!!onClick}
      className={cn(
        "p-8 bg-white/5 border-white/10 rounded-[2.5rem] group hover:border-white/20 transition-all duration-500 relative overflow-hidden h-full flex flex-col justify-between", 
        glow,
        className
      )}
    >
      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon className="w-24 h-24 rotate-12" />
      </div>
      
      <div className="space-y-6 relative z-10">
        <div className={cn("p-4 rounded-3xl w-fit transition-transform group-hover:scale-110 duration-500", bg)}>
          <Icon className={cn("w-7 h-7", color)} />
        </div>
        
        <div>
          <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-1 opacity-60 group-hover:opacity-100 transition-opacity">
            {label}
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-black text-foreground tracking-tighter">
              {value}
            </p>
            {onClick && (
              <ArrowUpRight className="w-4 h-4 text-accent-green opacity-0 group-hover:opacity-100 transition-all transform group-hover:-translate-y-1" />
            )}
          </div>
        </div>
      </div>
      
      {trend && (
        <div className="mt-8 pt-6 border-t border-white/5 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
            <span className="text-[10px] font-bold text-accent-green uppercase tracking-widest italic">{trend}</span>
          </div>
        </div>
      )}
    </Card>
  );
}
