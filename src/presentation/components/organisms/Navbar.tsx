'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore, useTranslation } from '@/presentation/hooks';
import { Button } from '@/presentation/components/atoms';
import { Globe } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { t, locale, setLocale } = useTranslation();

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'id' : 'en');
  };

  const publicNav = [
    { href: '/', label: 'Home' }, // 'Home' not in dictionary yet
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
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl">
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
                <div className="absolute inset-0 bg-blue-500/30 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <span className="text-white font-bold text-xl tracking-tight">Pay-Chain</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  pathname === item.href
                    ? 'bg-white/10 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            ))}

            <div className="flex items-center gap-3 ml-2 pl-2 border-l border-white/10">
               {/* Language Switcher */}
              <button
                onClick={toggleLocale}
                className="flex items-center gap-1 text-sm text-white/60 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/5"
              >
                <Globe className="w-4 h-4" />
                <span className="uppercase">{locale}</span>
              </button>
            </div>

            {isAuthenticated ? (
              <>
                {/* User menu */}
                <div className="flex items-center gap-3 ml-2 pl-2 border-l border-white/10">
                  <span className="text-white/50 text-sm hidden md:block">{user?.email}</span>
                  <button
                    onClick={() => logout()}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {t('common.logout')}
                  </button>
                </div>

                {/* Connect Buttons would be here */}
                <div className="flex items-center gap-2 ml-4 pl-4 border-l border-white/10">
                  <appkit-button />
                </div>
              </>
            ) : (
              <Link href="/register" className="ml-2">
                <Button variant="secondary" size="sm">Get Started</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

