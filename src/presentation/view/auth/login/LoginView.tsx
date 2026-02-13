'use client';

import Link from 'next/link';
import { Button, Input } from '@/presentation/components/atoms';
import { useLogin } from './useLogin';
import { useTranslation } from '@/presentation/hooks';
import { Sparkles } from 'lucide-react';

export function LoginView() {
  const { form, isPending, onSubmit } = useLogin();
  const { t } = useTranslation();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 relative overflow-hidden bg-mesh">
      {/* Animated background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-purple/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent-green/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-accent-blue/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="relative w-full max-w-md animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-purple/10 border border-accent-purple/20 mb-6">
            <Sparkles className="w-4 h-4 text-accent-purple" />
            <span className="text-sm text-accent-purple font-medium">{t('auth.login_badge')}</span>
          </div>
          <h1 className="heading-1 text-foreground">{t('auth.welcome')}</h1>
          <p className="body-lg mt-3">{t('auth.sign_in_subtitle')}</p>
        </div>

        {/* Form Card */}
        <div className="card-glass p-8 shadow-glass">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label={t('auth.email')}
              id="email"
              type="email"
              placeholder={t('auth.email_placeholder')}
              {...form.register('email')}
              error={form.formState.errors.email?.message}
            />

            <Input
              label={t('auth.password')}
              id="password"
              type="password"
              placeholder={t('auth.password_placeholder')}
              {...form.register('password')}
              error={form.formState.errors.password?.message}
            />

            {form.formState.errors.root && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm animate-fade-in">
                {form.formState.errors.root.message}
              </div>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/20 bg-surface text-accent-purple focus:ring-accent-purple focus:ring-offset-0 focus:ring-offset-background"
                />
                <span className="text-sm text-muted group-hover:text-foreground transition-colors">
                  {t('auth.remember_me')}
                </span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-accent-purple hover:text-accent-purple/80 transition-colors"
              >
                {t('auth.forgot_password')}
              </Link>
            </div>

            <Button 
              type="submit" 
              loading={isPending} 
              variant="primary"
              className="w-full"
              glow
            >
              {t('auth.sign_in')}
            </Button>
          </form>

          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-sm text-muted">{t('common.or')}</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="text-center">
            <p className="text-sm text-muted">
              {t('auth.no_account')}{' '}
              <Link 
                href="/register" 
                className="text-accent-green hover:text-accent-green/80 font-medium transition-colors"
              >
                {t('auth.create_one')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
