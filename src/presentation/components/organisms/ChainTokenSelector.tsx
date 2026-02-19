'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { Search } from 'lucide-react';
import { cn } from '@/core/utils';
import { useTranslation } from '@/presentation/hooks';
import { useUnifiedWallet } from '@/presentation/providers/UnifiedWalletProvider';
import {
  ChainTokenSelectorTrigger,
  ChainTokenSelectorSize,
  ChainTokenOptionRow,
  ChainTokenOptionRowItem,
  ChainTokenFilterChip,
} from '@/presentation/components/molecules';

export interface ChainTokenItem extends ChainTokenOptionRowItem {
  chainId: string;
  chainType?: string;
  evmChainId?: number;
  decimals?: number;
  isNative?: boolean;
}

export interface ChainTokenSelectorProps {
  items: ChainTokenItem[];
  selectedId?: string;
  onSelect: (item: ChainTokenItem) => void;
  isSwitchingChain?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  disabled?: boolean;
  size?: ChainTokenSelectorSize;
}

export function ChainTokenSelector({
  items,
  selectedId,
  onSelect,
  isSwitchingChain = false,
  placeholder,
  searchPlaceholder,
  className,
  disabled,
  size = 'default',
}: ChainTokenSelectorProps) {
  const { t } = useTranslation();
  const { isConnected, activeWallet, isEvmConnected, switchEvmChain } = useUnifiedWallet();
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeChainId, setActiveChainId] = React.useState<string>('all');
  const [dropdownStyles, setDropdownStyles] = React.useState<React.CSSProperties>({});

  const buttonRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const visibleItems = React.useMemo(() => {
    if (!isConnected || !activeWallet) return items;
    if (activeWallet === 'evm') {
      return items.filter((item) => String(item.chainType || '').toUpperCase() === 'EVM');
    }
    if (activeWallet === 'svm') {
      return items.filter((item) => String(item.chainType || '').toUpperCase() === 'SVM');
    }
    return items;
  }, [items, isConnected, activeWallet]);

  const selectedItem = React.useMemo(
    () => visibleItems.find((item) => item.id === selectedId),
    [visibleItems, selectedId]
  );
  const resolvedPlaceholder = placeholder ?? t('payments.select_token');
  const resolvedSearchPlaceholder = searchPlaceholder ?? t('common.search_tokens');

  const chains = React.useMemo(() => {
    const map = new Map<string, { id: string; name: string; logoUrl?: string }>();
    for (const item of visibleItems) {
      if (!map.has(item.chainId)) {
        map.set(item.chainId, {
          id: item.chainId,
          name: item.chainName,
          logoUrl: item.chainLogoUrl,
        });
      }
    }
    return Array.from(map.values());
  }, [visibleItems]);

  const filteredItems = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return visibleItems.filter((item) => {
      const chainMatch = activeChainId === 'all' || item.chainId === activeChainId;
      if (!chainMatch) return false;
      if (!q) return true;

      return (
        item.tokenName.toLowerCase().includes(q) ||
        item.tokenSymbol.toLowerCase().includes(q) ||
        item.tokenAddress.toLowerCase().includes(q) ||
        item.chainName.toLowerCase().includes(q)
      );
    });
  }, [visibleItems, activeChainId, searchQuery]);

  const updatePosition = React.useCallback(() => {
    if (!isOpen || !buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const width = rect.width;
    const maxHeight = Math.min(620, window.innerHeight - 32);
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const showBelow = spaceBelow >= 420 || spaceBelow > spaceAbove;

    setDropdownStyles({
      position: 'fixed',
      left: `${rect.left}px`,
      width: `${width}px`,
      maxHeight: `${maxHeight}px`,
      top: showBelow ? `${rect.bottom + 10}px` : 'auto',
      bottom: showBelow ? 'auto' : `${window.innerHeight - rect.top + 10}px`,
      zIndex: 9999,
    });
  }, [isOpen]);

  React.useEffect(() => {
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [updatePosition]);

  React.useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', onClickOutside);
    }

    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [isOpen]);

  const handleSelect = async (item: ChainTokenOptionRowItem) => {
    const selected = item as ChainTokenItem;
    if (
      isSwitchingChain &&
      isEvmConnected &&
      activeWallet === 'evm' &&
      String(selected.chainType || '').toUpperCase() === 'EVM' &&
      typeof selected.evmChainId === 'number'
    ) {
      const switched = await switchEvmChain(selected.evmChainId);
      if (!switched) return;
    }
    onSelect(item as ChainTokenItem);
    setIsOpen(false);
  };

  return (
    <div ref={buttonRef} className={cn('relative w-full', className)}>
      <ChainTokenSelectorTrigger
        value={
          selectedItem
            ? {
                tokenSymbol: selectedItem.tokenSymbol,
                chainName: selectedItem.chainName,
                tokenLogoUrl: selectedItem.tokenLogoUrl,
                chainLogoUrl: selectedItem.chainLogoUrl,
              }
            : undefined
        }
        placeholder={resolvedPlaceholder}
        relationLabel={t('common.on')}
        isOpen={isOpen}
        disabled={disabled}
        size={size}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
      />

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            style={dropdownStyles}
            className={cn(
              'relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#09090b]',
              'animate-in fade-in zoom-in-95 duration-200',
              'shadow-[0_0_45px_rgba(153,69,255,0.30)]'
            )}
          >
            <div className="pointer-events-none absolute -top-28 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-primary/25 blur-3xl" />

            <div className="relative z-10 space-y-3 border-b border-white/10 p-4">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={resolvedSearchPlaceholder}
                  className={cn(
                    'h-12 w-full rounded-2xl border border-white/10 bg-white/3 pl-10 pr-4 text-sm text-foreground',
                    'placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-primary/50'
                  )}
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                <ChainTokenFilterChip
                  label={t('common.all')}
                  selected={activeChainId === 'all'}
                  onClick={() => setActiveChainId('all')}
                />
                {chains.map((chain) => (
                  <ChainTokenFilterChip
                    key={chain.id}
                    label={chain.name}
                    logoUrl={chain.logoUrl}
                    selected={activeChainId === chain.id}
                    onClick={() => setActiveChainId(chain.id)}
                  />
                ))}
              </div>
            </div>

            <div className="relative z-10 max-h-[360px] space-y-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <ChainTokenOptionRow
                    key={item.id}
                    item={item}
                    selected={item.id === selectedId}
                    selectAriaLabel={t('common.select_token_on_chain')
                      .replace('{token}', item.tokenSymbol)
                      .replace('{chain}', item.chainName)}
                    onSelect={(selected) => {
                      void handleSelect(selected);
                    }}
                  />
                ))
              ) : (
                <div className="rounded-2xl border border-white/10 bg-white/3 px-4 py-8 text-center text-sm text-muted">
                  {t('common.no_tokens_found')}
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
