import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-[#9945FF] text-white border-transparent shadow-lg shadow-[#9945FF]/20',
    secondary: 'bg-white/10 text-primary-foreground border-white/5',
    destructive: 'bg-red-500/10 text-red-500 border-red-500/20',
    outline: 'bg-transparent text-primary-foreground border-white/20',
    success: 'bg-green-500/10 text-green-500 border-green-500/20',
    warning: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

function cn(...classes: (string | undefined | null | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}
