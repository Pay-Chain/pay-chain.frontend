'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/core/utils';
import { ChevronDown, Search, X } from 'lucide-react';
import { 
  ChainListItem, 
  ChainItemData 
} from '@/presentation/components/molecules/ChainListItem';
import { ChainSearchInput } from '@/presentation/components/molecules/ChainSearchInput';
import { ChainIcon } from '@/presentation/components/atoms/ChainIcon';
import { useTranslation } from '@/presentation/hooks';

export interface ChainSelectorProps {
  chains: ChainItemData[];
  selectedChainId?: string;
  onSelect: (chain?: ChainItemData) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
}

const ChainSelector = React.forwardRef<HTMLDivElement, ChainSelectorProps>(
  ({ chains, selectedChainId, onSelect, placeholder, label, className, disabled }, ref) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [dropdownStyles, setDropdownStyles] = React.useState<React.CSSProperties>({});
    
    // Internal ref for the trigger button to calculate position
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    const selectedChain = React.useMemo(() => 
      chains.find(c => c.id === selectedChainId), 
    [chains, selectedChainId]);
    const resolvedPlaceholder = placeholder ?? t('payments.select_chain');

    const filteredChains = React.useMemo(() => {
      if (!searchQuery) return chains;
      const lowerQuery = searchQuery.toLowerCase();
      return chains.filter(chain => 
        chain.name.toLowerCase().includes(lowerQuery) || 
        chain.networkId.toString().includes(lowerQuery)
      );
    }, [chains, searchQuery]);

    // Update dropdown position
    const updatePosition = React.useCallback(() => {
      if (isOpen && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const height = Math.min(320, filteredChains.length * 40 + 60); // approx height
        
        // Decide whether to show above or below
        const showBelow = spaceBelow >= height || spaceBelow > spaceAbove;
        
        setDropdownStyles({
          position: 'fixed',
          top: showBelow ? `${rect.bottom + 8}px` : 'auto',
          bottom: showBelow ? 'auto' : `${window.innerHeight - rect.top + 8}px`,
          left: `${rect.left}px`,
          width: `${rect.width}px`,
          zIndex: 9999, // Ensure it's on top of everything including modals
        });
      }
    }, [isOpen, filteredChains.length]);

    React.useEffect(() => {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }, [updatePosition]);

    // Close on click outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
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
        document.addEventListener('mousedown', handleClickOutside);
      }
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, buttonRef]);

    const handleSelect = (chain: ChainItemData) => {
        // Toggle logic: if clicking the already selected chain, deselect it
        if (selectedChainId === chain.id) {
            onSelect(undefined);
        } else {
            onSelect(chain);
        }
        setIsOpen(false);
        setSearchQuery('');
    };

    return (
      <div className={cn('relative w-full', className)}>
        {label && (
          <label className="text-sm font-medium text-foreground/80 mb-1.5 block ml-1">
            {label}
          </label>
        )}
        
        {/* Trigger Button */}
        <button
          ref={buttonRef}
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            'flex items-center justify-between w-full h-11 px-4 py-2 rounded-full',
            'bg-background border border-white/10 text-left transition-all duration-300',
            'hover:border-primary/50 hover:bg-white/5 hover:shadow-glow-sm hover:shadow-primary/20',
            'focus:outline-none focus:ring-1 focus:ring-primary/50',
            isOpen ? 'border-primary/50 ring-1 ring-primary/50 shadow-glow-sm shadow-primary/20' : '',
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          )}
        >
          {selectedChain ? (
            <div className="flex items-center gap-2.5">
              <ChainIcon 
                logoUrl={selectedChain.logoUrl} 
                name={selectedChain.name} 
                size="sm" 
              />
              <span className="font-medium text-sm text-foreground">
                {selectedChain.name}
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground text-sm">{resolvedPlaceholder}</span>
          )}
          
          <ChevronDown 
            size={16} 
            className={cn(
              "text-muted-foreground transition-transform duration-300", 
              isOpen && "rotate-180 text-primary"
            )} 
          />
        </button>

        {/* Dropdown Menu - Rendered in Portal */}
        {isOpen && createPortal(
          <div 
            ref={dropdownRef}
            style={dropdownStyles}
            className={cn(
              'flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200',
              'rounded-xl border border-white/10',
              'bg-[#09090b]', // Solid background to prevent transparency issues
              'shadow-[0_0_40px_rgba(153,69,255,0.3)]', // Stronger external glow to be visible without blocking backdrop
              'before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_50%_0%,rgba(153,69,255,0.1),transparent_70%)] before:opacity-50 before:pointer-events-none' // Top highlight
            )}
          >
            {/* Animated Background Glow - adjust opacity for solid bg */}
            <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(153,69,255,0.08)_0%,transparent_50%)] pointer-events-none animate-pulse" />

            {/* Search Header */}
            <div className="p-3 border-b border-white/5 sticky top-0 bg-[#0a0a0b]/50 backdrop-blur-md z-10">
              {/* Search Header */}
            <div className="p-3 border-b border-white/10 sticky top-0 bg-[#09090b] z-10">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  ref={(input) => {
                    // Manual focus handling to prevent scroll jumping
                    if (input && isOpen) {
                      setTimeout(() => {
                        input.focus({ preventScroll: true });
                      }, 10);
                    }
                  }}
                  type="text"
                  placeholder={t('common.search_chains')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-8 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all font-sans"
                />
                {searchQuery && (
                    <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
              </div>
            </div>
            </div>
            
            {/* Chain List */}
            <div className="flex-1 overflow-y-auto p-1.5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent max-h-[240px]">
              {filteredChains.length > 0 ? (
                <div className="space-y-0.5">
                  {filteredChains.map((chain) => (
                    <ChainListItem
                      key={chain.id}
                      chain={chain}
                      isSelected={chain.id === selectedChainId}
                      onSelect={handleSelect}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center flex flex-col items-center justify-center text-muted-foreground">
                  <Search className="w-8 h-8 opacity-20 mb-2" />
                  <span className="text-xs">{t('common.no_chains_found')}</span>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
      </div>
    );
  }
);

ChainSelector.displayName = 'ChainSelector';

export { ChainSelector };
