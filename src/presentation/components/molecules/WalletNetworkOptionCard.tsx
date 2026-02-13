'use client';

import { Button, WalletNetworkIcon, type WalletNetwork } from '@/presentation/components/atoms';
import { cn } from '@/core/utils';
import { useTranslation } from '@/presentation/hooks';

interface WalletNetworkOptionCardProps {
  network: WalletNetwork;
  title: string;
  subtitle: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  connected?: boolean;
}

export function WalletNetworkOptionCard({
  network,
  title,
  subtitle,
  onClick,
  disabled = false,
  loading = false,
  connected = false,
}: WalletNetworkOptionCardProps) {
  const { t } = useTranslation();

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={onClick}
      disabled={disabled}
      loading={loading}
      className={cn(
        'h-auto w-full justify-start rounded-2xl border border-white/15 px-4 py-4 text-left',
        connected && 'ring-2 ring-[#14F195]/50'
      )}
    >
      <div className="flex w-full items-center gap-3">
        <WalletNetworkIcon network={network} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{title}</p>
          <p className="truncate text-xs text-muted">{subtitle}</p>
        </div>
        {connected && (
          <span className="rounded-full bg-[#14F195]/15 px-2 py-0.5 text-[10px] font-semibold text-[#14F195] ring-1 ring-[#14F195]/40">
            {t('wallets.modal.connected_badge')}
          </span>
        )}
      </div>
    </Button>
  );
}
