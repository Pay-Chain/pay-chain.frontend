'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/core/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  showClose?: boolean;
}

const Modal = ({ isOpen, onClose, children, className, showClose = true }: ModalProps) => {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isMounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-500" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className={cn(
        "relative w-full max-w-lg bg-background/60 backdrop-blur-2xl border border-white/10 rounded-4xl shadow-2xl overflow-hidden",
        "animate-in zoom-in-95 fade-in slide-in-from-bottom-8 duration-500 ease-out",
        "before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_50%_0%,rgba(153,69,255,0.1),transparent_70%)] before:opacity-50 before:pointer-events-none",
        "after:absolute after:inset-0 after:rounded-4xl after:ring-1 after:ring-inset after:ring-white/10 after:pointer-events-none",
        "shadow-[0_0_50px_rgba(153,69,255,0.2)]",
        className
      )}>
        {/* Animated Background Glow */}
        <div className="absolute -top-[20%] -left-[20%] w-[140%] h-[140%] bg-[radial-gradient(circle,rgba(153,69,255,0.15)_0%,transparent_60%)] pointer-events-none animate-pulse" />
        
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export { Modal };
