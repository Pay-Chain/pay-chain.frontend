'use client';

import { useEffect } from 'react';
import { Button } from '@/presentation/components/atoms';
import { useTranslation } from '@/presentation/hooks';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-[50vh] w-full flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-2xl font-bold text-white">{t('error_page.title')}</h2>
      <p className="text-white/60">{t('error_page.desc')}</p>
      <div className="flex gap-4">
        <Button onClick={() => (window.location.href = '/')}>{t('error_page.go_home')}</Button>
        <Button variant="secondary" onClick={() => reset()}>
          {t('error_page.try_again')}
        </Button>
      </div>
    </div>
  );
}
