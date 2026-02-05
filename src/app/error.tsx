'use client';

import { useEffect } from 'react';
import { Button } from '@/presentation/components/atoms';
import { useTranslation } from '@/presentation/hooks';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

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
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center gap-6 text-center px-4 animate-fade-in">
      {/* Icon */}
      <div className="w-24 h-24 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
        <AlertTriangle className="w-12 h-12 text-red-400" />
      </div>
      
      {/* Text */}
      <div className="max-w-md">
        <h2 className="heading-2 text-foreground mb-2">{t('error_page.title')}</h2>
        <p className="body">{t('error_page.desc')}</p>
        {error.digest && (
          <p className="text-xs text-muted/50 font-mono mt-4">
            Error ID: {error.digest}
          </p>
        )}
      </div>
      
      {/* Actions */}
      <div className="flex gap-4 mt-2">
        <Button onClick={() => (window.location.href = '/')} variant="secondary">
          <Home className="w-4 h-4" />
          {t('error_page.go_home')}
        </Button>
        <Button variant="primary" onClick={() => reset()} glow>
          <RefreshCw className="w-4 h-4" />
          {t('error_page.try_again')}
        </Button>
      </div>
    </div>
  );
}
