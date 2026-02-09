'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { Modal, ModalProps } from '../atoms/Modal';
import { Button } from '../atoms/Button';
import { cn } from '@/core/utils';

interface BaseModalProps extends Omit<ModalProps, 'children'> {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onConfirm?: () => void;
  confirmLabel?: string;
  isConfirmLoading?: boolean;
  isConfirmDisabled?: boolean;
}

const BaseModal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  className,
  onConfirm,
  confirmLabel = 'Save Changes',
  isConfirmLoading = false,
  isConfirmDisabled = false,
}: BaseModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className={className}>
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-8 border-b border-white/5">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight leading-none">{title}</h2>
          {description && <p className="text-sm text-muted mt-2 font-medium leading-relaxed max-w-[90%]">{description}</p>}
        </div>
        <button 
          onClick={onClose}
          className="p-2 text-muted hover:text-foreground hover:bg-white/10 rounded-full transition-all duration-300 hover:rotate-90 active:scale-95 bg-white/5 border border-white/5"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 p-8 pt-6">
        {children}
      </div>

      {/* Footer */}
      {(footer || onConfirm) && (
        <div className="relative z-10 flex items-center justify-end gap-3 p-8 pt-2">
          {footer ? footer : (
            <>
              <Button variant="ghost" onClick={onClose} className="text-muted hover:text-foreground px-6">
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={onConfirm}
                loading={isConfirmLoading}
                disabled={isConfirmLoading || isConfirmDisabled}
                glow
                className="min-w-[140px] rounded-full py-3 shadow-glow-sm"
              >
                {confirmLabel}
              </Button>
            </>
          )}
        </div>
      )}
    </Modal>
  );
};

export { BaseModal };
