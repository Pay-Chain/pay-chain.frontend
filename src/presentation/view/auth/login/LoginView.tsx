'use client';

import Link from 'next/link';
import { Button, Input } from '@/presentation/components/atoms';
import { useLogin } from './useLogin';
import { useTranslation } from '@/presentation/hooks';

export function LoginView() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isPending,
    handleSubmit
  } = useLogin();
  const { t } = useTranslation();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">{t('auth.welcome')}</h1>
          <p className="text-white/50 mt-3">{t('auth.sign_in_subtitle')}</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-2">
                {t('auth.email')}
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/70 mb-2">
                {t('auth.password')}
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                />
                <span className="text-sm text-white/50">{t('auth.remember_me')}</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                {t('auth.forgot_password')}
              </Link>
            </div>

            <Button type="submit" loading={isPending} className="w-full">
              {t('auth.sign_in')}
            </Button>
          </form>

          <div className="my-6 border-t border-white/10"></div>

          <div className="text-center">
            <p className="text-sm text-white/50">
              {t('auth.no_account')}{' '}
              <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                {t('auth.create_one')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
