'use client';

import * as React from 'react';
import { Clock } from 'lucide-react';
import { useTranslation } from '@/presentation/hooks';
import { BaseModal } from './BaseModal';
import { Button } from '../atoms/Button';

interface SessionTimeoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExtend: () => void;
  isLoading?: boolean;
}

export const SessionTimeoutModal = ({
  isOpen,
  onClose,
  onExtend,
  isLoading = false,
}: SessionTimeoutModalProps) => {
  const { t } = useTranslation();

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('session_modal.title')}
      description={t('session_modal.description')}
      className="max-w-md"
      footer={
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex-1 text-muted"
          >
            {t('session_modal.logout')}
          </Button>
          <Button
            variant="primary"
            onClick={onExtend}
            loading={isLoading}
            className="flex-1"
            glow
          >
            {t('session_modal.extend')}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col items-center justify-center py-4">
        <div className="w-16 h-16 bg-accent-purple/10 rounded-full flex items-center justify-center mb-4 ring-1 ring-accent-purple/20">
          <Clock className="w-8 h-8 text-accent-purple animate-pulse" />
        </div>
        <p className="text-sm text-center text-muted">
          {t('session_modal.body')}
        </p>
      </div>
    </BaseModal>
  );
};
