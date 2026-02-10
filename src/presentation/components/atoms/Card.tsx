import { ReactNode } from 'react';

export type CardVariant = 'default' | 'glass' | 'outlined' | 'solid';
export type CardSize = 'sm' | 'md' | 'lg';

interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  size?: CardSize;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-white/5 backdrop-blur-sm border border-white/10',
  glass: 'bg-white/5 backdrop-blur-xl border border-white/10',
  outlined: 'bg-transparent border border-white/20',
  solid: 'bg-surface border border-white/10',
};

const sizeStyles: Record<CardSize, string> = {
  sm: 'p-4 rounded-xl',
  md: 'p-6 rounded-2xl',
  lg: 'p-8 rounded-2xl',
};

export function Card({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  hoverable = false,
  onClick,
}: CardProps) {
  const baseStyles = 'transition-all duration-300';
  const hoverStyles = hoverable
    ? 'hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-white/5 cursor-pointer'
    : '';

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${hoverStyles} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}
