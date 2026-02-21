'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Locale, Dictionary } from '@/core/i18n/types';
import { en } from '@/core/i18n/locales/en';
import { id } from '@/core/i18n/locales/id';

// Dictionary map
const dictionaries: Record<Locale, Dictionary> = {
  en,
  id,
};

// Context
type I18nContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, defaultValue?: string) => string;
  dictionary: Dictionary;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Provider
export function I18nProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>('en');

  // Persist locale preference
  useEffect(() => {
    const cookieLocale = document.cookie
      .split('; ')
      .find((value) => value.startsWith('locale='))
      ?.split('=')[1] as Locale | undefined;
    if (cookieLocale === 'en' || cookieLocale === 'id') {
      setLocale(cookieLocale);
      return;
    }

    const saved = localStorage.getItem('locale') as Locale;
    if (saved && (saved === 'en' || saved === 'id')) {
      setLocale(saved);
      document.cookie = `locale=${saved}; path=/; max-age=31536000; samesite=lax`;
    }
  }, []);

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000; samesite=lax`;
    // Re-fetch server components that render translated text from server dictionary.
    router.refresh();
  };

  const dictionary = dictionaries[locale];

  // Nested key access helper (e.g. 'common.dashboard')
  const t = (key: string, defaultValue?: string): string => {
    const keys = key.split('.');
    let value: any = dictionary;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return defaultValue || key; // Fallback to defaultValue or key if not found
      }
    }
    
    return typeof value === 'string' ? value : (defaultValue || key);
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale: handleSetLocale, t, dictionary }}>
      {children}
    </I18nContext.Provider>
  );
}

// Hook
export function useTranslation() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
}
