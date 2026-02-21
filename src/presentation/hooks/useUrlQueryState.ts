'use client';

import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { QUERY_PARAM_KEYS } from '@/core/constants';

type QueryPatchValue = string | number | null | undefined;

export function useUrlQueryState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getString = useCallback(
    (key: string, fallback = '') => searchParams.get(key) ?? fallback,
    [searchParams]
  );

  const getNumber = useCallback(
    (key: string, fallback: number) => {
      const raw = Number(searchParams.get(key));
      if (!Number.isFinite(raw) || raw <= 0) return fallback;
      return Math.floor(raw);
    },
    [searchParams]
  );

  const getSearch = useCallback(
    () => getString(QUERY_PARAM_KEYS.q) || getString(QUERY_PARAM_KEYS.legacySearch),
    [getString]
  );

  const setMany = useCallback(
    (patch: Record<string, QueryPatchValue>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(patch).forEach(([key, value]) => {
        if (value === null || value === undefined || String(value).trim() === '') {
          params.delete(key);
          return;
        }
        params.set(key, String(value));
      });

      const next = params.toString();
      router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  return { getString, getNumber, getSearch, setMany };
}
