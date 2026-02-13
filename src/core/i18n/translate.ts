import type { Dictionary } from './types';

export function translate(dictionary: Dictionary, key: string): string {
  const keys = key.split('.');
  let value: unknown = dictionary;

  for (const k of keys) {
    if (value && typeof value === 'object' && k in (value as Record<string, unknown>)) {
      value = (value as Record<string, unknown>)[k];
      continue;
    }
    return key;
  }

  return typeof value === 'string' ? value : key;
}
