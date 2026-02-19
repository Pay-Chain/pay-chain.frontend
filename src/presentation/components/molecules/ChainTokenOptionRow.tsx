'use client';

import * as React from 'react';
import { ExternalLink, Plus } from 'lucide-react';
import { Button } from '@/presentation/components/atoms/Button';
import { ChainTokenIcon } from '@/presentation/components/atoms/ChainTokenIcon';
import { shortenAddress } from '@/core/utils/format';
import { cn } from '@/core/utils';

export interface ChainTokenOptionRowItem {
  id: string;
  tokenName: string;
  tokenSymbol: string;
  tokenAddress: string;
  tokenLogoUrl?: string;
  chainName: string;
  chainLogoUrl?: string;
  explorerTokenUrl?: string;
}

export interface ChainTokenOptionRowProps {
  item: ChainTokenOptionRowItem;
  selected?: boolean;
  selectAriaLabel?: string;
  onSelect: (item: ChainTokenOptionRowItem) => void;
}

export function ChainTokenOptionRow({ item, selected, selectAriaLabel, onSelect }: ChainTokenOptionRowProps) {
  return (
    <div
      className={cn(
        'group flex items-center justify-between rounded-2xl border p-3 transition-all duration-200',
        'border-transparent hover:border-white/10 hover:bg-white/[0.04]',
        selected && 'border-primary/40 bg-primary/10 shadow-glow-sm shadow-primary/20'
      )}
    >
      <div className="min-w-0 flex items-center gap-3">
        <ChainTokenIcon
          tokenSymbol={item.tokenSymbol}
          tokenLogoUrl={item.tokenLogoUrl}
          chainName={item.chainName}
          chainLogoUrl={item.chainLogoUrl}
          size="lg"
        />

        <div className="min-w-0">
          <p className="truncate text-xl font-semibold leading-tight text-foreground">
            {item.tokenSymbol} <span className="text-base font-medium text-muted">{item.chainName}</span>
          </p>
          <div className="mt-1 flex items-center gap-1.5 text-sm text-muted">
            <span className="font-mono underline underline-offset-2">
              {shortenAddress(item.tokenAddress, 4)}
            </span>
            {item.explorerTokenUrl ? (
              <a
                href={item.explorerTokenUrl}
                target="_blank"
                rel="noreferrer"
                className="text-muted transition-colors hover:text-foreground"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : null}
          </div>
        </div>
      </div>

      <Button
        type="button"
        variant="primary"
        size="icon"
        className="h-10 w-10 shrink-0 rounded-xl"
        onClick={() => onSelect(item)}
        aria-label={selectAriaLabel || `Select ${item.tokenSymbol} on ${item.chainName}`}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
