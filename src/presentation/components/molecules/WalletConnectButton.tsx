'use client';

import * as React from 'react';
import { Button } from '@/presentation/components/atoms';
import { ChevronDown, LogOut, Wallet } from 'lucide-react';
import { useWalletConnectModal } from '@/presentation/hooks';
import { useTranslation } from '@/presentation/hooks';
import { useUnifiedWallet } from '@/presentation/providers/UnifiedWalletProvider';
import { shortenAddress } from '@/core/utils/format';
import { cn } from '@/core/utils';

export interface WalletConnectButtonProps {
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  connectLabel?: string;
  compact?: boolean;
  dropdownAlign?: 'left' | 'right' | 'auto';
}

export function WalletConnectButton({
  size = 'default',
  className = '',
  connectLabel,
  compact = false,
  dropdownAlign = 'auto',
}: WalletConnectButtonProps) {
  const { t } = useTranslation();
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);
  const [isLoadingBalance, setIsLoadingBalance] = React.useState(false);
  const [nativeTicker, setNativeTicker] = React.useState<string>('-');
  const [nativeBalance, setNativeBalance] = React.useState<string>('0');

  const openWalletConnectModal = useWalletConnectModal((state) => state.open);
  const {
    isConnected,
    address,
    activeWallet,
    evmChainId,
    getNativeBalance,
    disconnectActiveWallet,
  } = useUnifiedWallet();

  const getNetworkIcon = React.useCallback(() => {
    if (activeWallet === 'svm') return '/chain/solana-icon.svg';
    if (evmChainId === 8453) return '/chain/base-icon.svg';
    if (evmChainId === 42161) return '/chain/arbitrum-icon.svg';
    return null;
  }, [activeWallet, evmChainId]);

  const getNetworkLabel = React.useCallback(() => {
    if (activeWallet === 'svm') return t('wallets.network.solana');
    if (evmChainId === 8453) return t('wallets.network.base');
    if (evmChainId === 42161) return t('wallets.network.arbitrum');
    if (activeWallet === 'evm') return t('wallets.network.evm');
    return '-';
  }, [activeWallet, evmChainId, t]);

  const fetchNativeBalance = React.useCallback(async () => {
    if (!isConnected) return;
    try {
      setIsLoadingBalance(true);
      const balance = await getNativeBalance();
      setNativeTicker(balance?.symbol || '-');
      setNativeBalance(balance?.formatted ? Number(balance.formatted).toFixed(4) : '0');
    } catch {
      setNativeTicker(activeWallet === 'svm' ? 'SOL' : 'ETH');
      setNativeBalance('0');
    } finally {
      setIsLoadingBalance(false);
    }
  }, [isConnected, getNativeBalance, activeWallet]);

  const handleTriggerClick = () => {
    if (!isConnected) {
      openWalletConnectModal();
      return;
    }
    setOpen((prev) => !prev);
  };

  const handleDisconnect = async () => {
    await disconnectActiveWallet();
    setOpen(false);
  };

  React.useEffect(() => {
    if (isConnected) {
      void fetchNativeBalance();
      return;
    }
    setOpen(false);
    setNativeTicker('-');
    setNativeBalance('0');
  }, [isConnected, fetchNativeBalance]);

  React.useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const resolvedConnectLabel = connectLabel || t('common.connect');
  const addressLabel = address ? shortenAddress(address) : resolvedConnectLabel;
  const networkIcon = getNetworkIcon();
  const networkLabel = getNetworkLabel();
  const dropdownPositionClass =
    dropdownAlign === 'left'
      ? 'left-0'
      : dropdownAlign === 'right'
        ? 'right-0'
        : 'right-0 max-sm:left-0 max-sm:right-auto';

  return (
    <div ref={wrapperRef} className={cn('relative', className)}>
      <Button
        variant="primary"
        size={size}
        onClick={handleTriggerClick}
        className={cn('group gap-2', className.includes('w-full') ? 'w-full justify-between' : '')}
      >
        {networkIcon ? (
          <img src={networkIcon} alt="chain" className="h-4 w-4 rounded-full object-contain" />
        ) : (
          <Wallet className="w-4 h-4" />
        )}
        <span>{isConnected ? addressLabel : resolvedConnectLabel}</span>
        {isConnected && <ChevronDown className={cn('w-4 h-4 transition-transform', open && 'rotate-180')} />}
      </Button>

      {isConnected && open && (
        <div className={cn('absolute z-50 mt-2 w-72 animate-fade-in rounded-2xl border border-white/15 bg-surface/95 p-3 shadow-2xl backdrop-blur-xl', dropdownPositionClass)}>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-wider text-muted">{t('wallets.wallet_label')}</p>
              <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-muted">
                {networkIcon ? (
                  <img src={networkIcon} alt={networkLabel} className="h-3 w-3 rounded-full object-contain" />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-accent-purple" />
                )}
                <span className="font-medium text-foreground">{networkLabel}</span>
              </div>
            </div>
            <p className="mt-1 truncate font-mono text-xs text-foreground">{address}</p>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-muted">{t('wallets.native_label')}</p>
              <p className="text-sm font-semibold text-foreground">
                {isLoadingBalance ? `${t('common.loading')}` : `${nativeBalance} ${nativeTicker}`}
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={handleDisconnect}
            className="mt-3 w-full justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            {t('common.disconnect')}
          </Button>
        </div>
      )}
    </div>
  );
}

export default WalletConnectButton;
