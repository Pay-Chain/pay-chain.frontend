'use client';

import * as React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from '../atoms/Modal';
import { Button } from '../atoms/Button';
import { useTranslation } from '@/presentation/hooks';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  isLoading?: boolean;
}

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description = 'This action cannot be undone. This will permanently delete the item.',
  isLoading = false,
}: DeleteConfirmationModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md shadow-red-500/20 shadow-2xl border-red-500/20">
      <div className="p-6 text-center relative z-10">
        <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 ring-1 ring-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        
        <h2 className="text-xl font-bold text-foreground mb-2">{title}</h2>
        <p className="text-muted text-sm mb-6">{description}</p>
        
        <div className="flex flex-col gap-2">
          <Button 
            variant="danger" 
            onClick={onConfirm} 
            loading={isLoading}
            className="w-full shadow-red-500/20 hover:shadow-red-500/40"
            glow
          >
            {t('common.delete')}
          </Button>
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="w-full text-muted hover:text-foreground"
          >
            {t('common.cancel')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export { DeleteConfirmationModal };
