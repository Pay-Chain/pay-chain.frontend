'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore, useTranslation } from '@/presentation/hooks';
import { Button } from '@/presentation/components/atoms';
import { Globe, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { t, locale, setLocale } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'id' : 'en');
  };

  const publicNav = [
    { href: '/', label: 'Home' },
    { href: '/login', label: t('auth.login') },
    { href: '/register', label: t('auth.register') },
  ];

  const authNav = [
    { href: '/dashboard', label: t('common.dashboard') },
    { href: '/payments', label: t('common.payments') },
    { href: '/wallets', label: t('common.wallets') },
  ];

  const navItems = isAuthenticated ? authNav : publicNav;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-navbar animate-fade-in">
      {/* Optional gradient accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-solana opacity-30" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <img
                  src="/logo.png"
                  alt="Pay-Chain Logo"
                  className="h-9 w-9 object-contain transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-accent-purple/30 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <span className="text-foreground font-bold text-xl tracking-tight">
                Pay-Chain
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                  pathname === item.href
                    ? 'bg-white/10 text-foreground'
                    : 'text-muted hover:text-foreground hover:bg-white/5'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {item.label}
              </Link>
            ))}

            <div className="flex items-center gap-3 ml-2 pl-2 border-l border-white/10">
              {/* Language Switcher */}
              <button
                onClick={toggleLocale}
                className="flex items-center gap-1 text-sm text-muted hover:text-foreground transition-all duration-300 px-3 py-2 rounded-full hover:bg-white/5"
              >
                <Globe className="w-4 h-4" />
                <span className="uppercase font-medium">{locale}</span>
              </button>
            </div>

            {isAuthenticated ? (
              <>
                {/* User menu */}
                <div className="flex items-center gap-3 ml-2 pl-2 border-l border-white/10">
                  <span className="text-muted text-sm hidden lg:block">
                    {user?.email}
                  </span>
                  <button
                    onClick={() => logout()}
                    className="text-sm text-muted hover:text-foreground transition-all duration-300 px-3 py-2 rounded-full hover:bg-white/5"
                  >
                    {t('common.logout')}
                  </button>
                </div>

                {/* Wallet Connect */}
                <div className="flex items-center gap-2 ml-4 pl-4 border-l border-white/10">
                  <appkit-button />
                </div>
              </>
            ) : (
              <Link href="/register" className="ml-2">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-muted hover:text-foreground transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass border-t border-white/10 animate-fade-in">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                  pathname === item.href
                    ? 'bg-white/10 text-foreground'
                    : 'text-muted hover:text-foreground hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={toggleLocale}
                className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors px-4 py-2"
              >
                <Globe className="w-4 h-4" />
                <span className="uppercase">{locale}</span>
              </button>
              
              {!isAuthenticated && (
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
