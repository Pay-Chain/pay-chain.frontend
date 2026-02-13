import { cookies } from 'next/headers';
import { en } from './locales/en';
import { id } from './locales/id';
import type { Dictionary, Locale } from './types';

export async function getServerLocale(): Promise<Locale> {
  const store = await cookies();
  const locale = store.get('locale')?.value;
  return locale === 'id' ? 'id' : 'en';
}

export async function getServerDictionary(): Promise<Dictionary> {
  const locale = await getServerLocale();
  return locale === 'id' ? id : en;
}
