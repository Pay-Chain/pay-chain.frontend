'use client';

import Link from 'next/link';
import { useState } from 'react';
import { KeyRound, Lock, ArrowRight } from 'lucide-react';
import { Button, Input } from '@/presentation/components/atoms';
import { ROUTES } from '@/core/constants/routes';
import { useChangePasswordMutation } from '@/data/usecase';
import { useTranslation } from '@/presentation/hooks';
import { toast } from 'sonner';

export default function SettingsView() {
  const { t } = useTranslation();
  const changePasswordMutation = useChangePasswordMutation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error(t('settings.toasts.fill_all_password_fields'));
      return;
    }
    if (newPassword.length < 8) {
      toast.error(t('settings.toasts.new_password_min_8'));
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(t('settings.toasts.confirmation_not_match'));
      return;
    }

    try {
      const res = await changePasswordMutation.mutateAsync({
        currentPassword,
        newPassword,
      });
      if (res.error) {
        toast.error(res.error);
        return;
      }
      toast.success(t('settings.toasts.password_updated'));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e: any) {
      toast.error(e?.message || t('settings.toasts.update_password_failed'));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('settings.title')}</h1>
        <p className="text-muted">{t('settings.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-sm text-accent-green">
                <KeyRound className="w-4 h-4" />
                {t('settings.api_keys_card.badge')}
              </div>
              <h2 className="text-lg font-semibold text-foreground">{t('settings.api_keys_card.title')}</h2>
              <p className="text-sm text-muted">
                {t('settings.api_keys_card.description')}
              </p>
            </div>
            <Link href={ROUTES.API_KEYS}>
              <Button variant="secondary" size="sm" className="gap-2">
                {t('settings.api_keys_card.open')}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4">
          <div className="inline-flex items-center gap-2 text-sm text-accent-purple">
            <Lock className="w-4 h-4" />
            {t('settings.password_card.badge')}
          </div>
          <h2 className="text-lg font-semibold text-foreground">{t('settings.password_card.title')}</h2>
          <div className="space-y-3">
            <Input
              label={t('settings.password_card.current_password')}
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <Input
              label={t('settings.password_card.new_password')}
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              label={t('settings.password_card.confirm_new_password')}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="pt-2">
            <Button
              variant="primary"
              onClick={handleChangePassword}
              loading={changePasswordMutation.isPending}
            >
              {t('settings.password_card.update_password')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
