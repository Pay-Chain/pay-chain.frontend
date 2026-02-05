'use client';

import Link from 'next/link';
import { Button, Input } from '@/presentation/components/atoms';
import { useRegister } from './useRegister';
import { useTranslation } from '@/presentation/hooks';
import { Rocket, Wallet, Check, ArrowLeft } from 'lucide-react';

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
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 relative overflow-hidden bg-mesh">
      {/* Animated background orbs */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-accent-purple/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-accent-green/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-2/3 left-1/2 w-48 h-48 bg-accent-blue/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="relative w-full max-w-md animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-green/10 border border-accent-green/20 mb-6">
            <Rocket className="w-4 h-4 text-accent-green" />
            <span className="text-sm text-accent-green font-medium">Get Started Today</span>
          </div>
          <h1 className="heading-1 text-foreground">{t('auth.create_account')}</h1>
          <p className="body-lg mt-3">{t('auth.create_account_subtitle')}</p>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  step >= 1 
                    ? 'bg-gradient-purple-green text-foreground shadow-glow-sm' 
                    : 'bg-surface border border-white/10 text-muted'
                }`}
              >
                {step > 1 ? <Check className="w-5 h-5" /> : '1'}
              </div>
              <span className={`text-sm font-medium transition-colors ${step >= 1 ? 'text-foreground' : 'text-muted'}`}>
                {t('auth.steps.account')}
              </span>
            </div>
            <div className={`w-12 h-0.5 transition-colors duration-300 ${step >= 2 ? 'bg-gradient-purple-green' : 'bg-white/10'}`} />
            <div className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  step >= 2 
                    ? 'bg-gradient-purple-green text-foreground shadow-glow-sm' 
                    : 'bg-surface border border-white/10 text-muted'
                }`}
              >
                <Wallet className="w-5 h-5" />
              </div>
              <span className={`text-sm font-medium transition-colors ${step >= 2 ? 'text-foreground' : 'text-muted'}`}>
                {t('auth.steps.wallet')}
              </span>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="card-glass p-8 shadow-glass">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm mb-6 animate-fade-in">
              {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleAccountSubmit} className="space-y-5 animate-fade-in">
              <Input
                label={t('auth.name')}
                id="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                label={t('auth.email')}
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <Input
                label={t('auth.password')}
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <Input
                label={t('auth.confirm_password')}
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
              <Button type="submit" variant="primary" className="w-full" glow>
                {t('auth.continue_wallet')}
              </Button>
            </form>
          ) : (
            <div className="space-y-5 animate-fade-in">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
                type="button"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('common.back')}
              </button>

              <div className="text-center py-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-purple-blue/10 border border-accent-purple/20 flex items-center justify-center">
                  <Wallet className="w-8 h-8 text-accent-purple" />
                </div>
                <h2 className="heading-3 text-foreground mb-2">{t('wallets.connect')}</h2>
                <p className="body text-muted">{t('auth.wallet_required')}</p>
              </div>

              {isConnected && address ? (
                <div className="bg-accent-green/10 border border-accent-green/30 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
                  <div className="w-12 h-12 bg-accent-green/20 rounded-xl flex items-center justify-center">
                    <Check className="w-6 h-6 text-accent-green" />
                  </div>
                  <div>
                    <p className="text-foreground font-medium">{t('wallets.connected')}</p>
                    <p className="text-accent-green text-sm font-mono">{truncateAddress(address)}</p>
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
                variant="primary"
                className="w-full"
                glow
              >
                {t('auth.create_account_action')}
              </Button>
            </div>
          )}

          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-sm text-muted">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="text-center">
            <p className="text-sm text-muted">
              {t('auth.have_account')}{' '}
              <Link href="/login" className="text-accent-purple hover:text-accent-purple/80 font-medium transition-colors">
                {t('auth.sign_in')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
