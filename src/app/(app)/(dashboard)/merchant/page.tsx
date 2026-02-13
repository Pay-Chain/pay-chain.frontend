'use client';

import { useTranslation } from '@/presentation/hooks';

export default function MerchantPage() {
    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">{t('merchant_dashboard_view.title')}</h1>
            <div className="text-white/50">{t('merchant_dashboard_view.subtitle')}</div>
        </div>
    )
}
