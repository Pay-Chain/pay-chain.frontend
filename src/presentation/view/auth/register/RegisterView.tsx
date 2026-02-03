'use client';

import Link from 'next/link';
import { Button, Input } from '@/presentation/components/atoms';
import { useRegister } from './useRegister';
import { useTranslation } from '@/presentation/hooks';

export function RegisterView() {
  const {
    step,
    setStep,
    formData,
    setFormData,
    error,
    isPending,
    address,
    isConnected,
    open,
    handleAccountSubmit,
    handleFinalSubmit
  } = useRegister();
  const { t } = useTranslation();

  const truncateAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/3 right-1/4 w-56 h-56 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">{t('auth.create_account')}</h1>
          <p className="text-white/50 mt-3">{t('auth.create_account_subtitle')}</p>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="flex items-center gap-2">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-white/10 text-white'}`}
              >
                1
              </div>
              <span className={`text-sm font-medium ${step >= 1 ? 'text-white' : 'text-white/40'}`}>
                {t('auth.steps.account')}
              </span>
            </div>
            <div className={`w-10 h-0.5 transition-colors ${step >= 2 ? 'bg-blue-600' : 'bg-white/10'}`}></div>
            <div className="flex items-center gap-2">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-white/10 text-white'}`}
              >
                2
              </div>
              <span className={`text-sm font-medium ${step >= 2 ? 'text-white' : 'text-white/40'}`}>
                {t('auth.steps.wallet')}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-xl">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm mb-6">
              {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleAccountSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-2">
                  {t('auth.name')}
                </label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-2">
                  {t('auth.email')}
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/70 mb-2">
                  {t('auth.confirm_password')}
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {t('auth.continue_wallet')}
              </Button>
            </form>
          ) : (
            <div className="space-y-5">
              <button
                onClick={() => setStep(1)}
                className="text-white/50 hover:text-white flex items-center gap-2 text-sm transition-colors"
                type="button"
              >
                ← {t('common.back')}
              </button>

              <div className="text-center py-6">
                <h2 className="text-xl font-bold text-white mb-2">{t('wallets.connect')}</h2>
                <p className="text-white/50 text-sm">{t('auth.wallet_required')}</p>
              </div>

              {isConnected && address ? (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <span className="text-emerald-400">✓</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{t('wallets.connected')}</p>
                    <p className="text-emerald-400 text-sm font-mono">{truncateAddress(address)}</p>
                  </div>
                </div>
              ) : (
                <Button onClick={() => open()} variant="secondary" className="w-full py-4">
                  {t('wallets.connect')}
                </Button>
              )}

              <Button
                onClick={handleFinalSubmit}
                disabled={!isConnected || isPending}
                loading={isPending}
                className="w-full"
              >
                {t('auth.create_account_action')}
              </Button>
            </div>
          )}

          <div className="my-6 border-t border-white/10"></div>

          <div className="text-center">
            <p className="text-sm text-white/50">
              {t('auth.have_account')}{' '}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                {t('auth.sign_in')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
