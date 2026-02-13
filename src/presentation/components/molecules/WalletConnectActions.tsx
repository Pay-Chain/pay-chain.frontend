'use client';

import { WalletNetworkOptionCard } from '@/presentation/components/molecules/WalletNetworkOptionCard';
import { useTranslation } from '@/presentation/hooks';

interface WalletConnectActionsProps {
  onConnectEvm: () => void;
  onConnectSvm: () => void;
  isEvmLoading?: boolean;
  isSvmLoading?: boolean;
  isEvmDisabled?: boolean;
  isSvmDisabled?: boolean;
  isEvmConnected?: boolean;
  isSvmConnected?: boolean;
}

export function WalletConnectActions({
  onConnectEvm,
  onConnectSvm,
  isEvmLoading = false,
  isSvmLoading = false,
  isEvmDisabled = false,
  isSvmDisabled = false,
  isEvmConnected = false,
  isSvmConnected = false,
}: WalletConnectActionsProps) {
  const { t } = useTranslation();

  return (
    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
      <WalletNetworkOptionCard
        network="evm"
        title={t('wallets.modal.evm_title')}
        subtitle={t('wallets.modal.evm_subtitle')}
        onClick={onConnectEvm}
        disabled={isEvmDisabled}
        loading={isEvmLoading}
        connected={isEvmConnected}
      />

      <WalletNetworkOptionCard
        network="svm"
        title={t('wallets.modal.svm_title')}
        subtitle={t('wallets.modal.svm_subtitle')}
        onClick={onConnectSvm}
        disabled={isSvmDisabled}
        loading={isSvmLoading}
        connected={isSvmConnected}
      />
    </div>
  );
}
