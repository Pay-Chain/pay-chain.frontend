'use client';

import { useAuthStore, useTranslation } from '@/presentation/hooks';
import { Button } from '@/presentation/components/atoms';
import { Bell, Search, Menu, Wallet } from 'lucide-react';
import { useState } from 'react';
import { useAppKit } from '@reown/appkit/react';

interface DashboardToolbarProps {
  onMenuClick?: () => void;
}

export default function DashboardToolbar({ onMenuClick }: DashboardToolbarProps) {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const { open } = useAppKit();
  const [searchFocused, setSearchFocused] = useState(false);

  const handleConnectWallet = () => {
    open({ view: 'Connect' });
  };

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-[272px] z-30 py-3 px-3 sm:px-4 lg:px-6 mt-2 lg:mt-5">
      <div className="w-full max-w-7xl mx-auto">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-2.5">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Menu button (mobile) + Search */}
          <div className="flex items-center gap-3 flex-1">
            {/* Mobile menu button */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 text-muted hover:text-foreground transition-colors rounded-xl hover:bg-white/5"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search */}
            <div className={`relative flex-1 max-w-md transition-all duration-300 ${searchFocused ? 'max-w-lg' : ''}`}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                placeholder={t('common.search') || 'Search...'}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent-purple/50 focus:bg-white/10 transition-all duration-300"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <button className="relative p-2 text-muted hover:text-foreground transition-colors rounded-xl hover:bg-white/5">
              <Bell className="w-5 h-5" />
              {/* Notification badge */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent-green rounded-full" />
            </button>

            {/* Custom Connect Wallet Button */}
            <Button
              variant="primary"
              size="sm"
              onClick={handleConnectWallet}
              className="hidden sm:inline-flex gap-2"
            >
              <Wallet className="w-4 h-4" />
              <span>Connect Wallet</span>
            </Button>

            {/* User Avatar */}
            <button className="flex items-center gap-2 p-1 pr-2.5 rounded-xl hover:bg-white/5 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-accent-purple to-accent-green flex items-center justify-center text-white text-sm font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <span className="hidden md:block text-sm text-foreground font-medium truncate max-w-[80px]">
                {user?.name || 'User'}
              </span>
            </button>
          </div>
        </div>
      </div>
      </div>
    </header>
  );
}
