'use client';

import Link from 'next/link';
import { Button } from '@/presentation/components/atoms';
import TransactionList from '@/presentation/components/organisms/TransactionList';
import { usePayments } from './usePayments';
import { useTranslation } from '@/presentation/hooks';

export function PaymentsView() {
  const { payments, isLoading, pagination, page, setPage } = usePayments();
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{t('payments.title')}</h1>
        <Link href="/payments/new">
          <Button>{t('payments.new_payment')}</Button>
        </Link>
      </div>

      <div className="rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm overflow-hidden">
        <TransactionList payments={payments} />
        
        {/* Simple pagination controls if needed */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-white/5">
             <Button 
               variant="ghost" 
               size="sm" 
               disabled={page <= 1}
               onClick={() => setPage(p => Math.max(1, p - 1))}
             >
               {t('common.previous')}
             </Button>
             <span className="flex items-center text-sm text-white/50">
               {t('common.page_of')} {page} {t('common.of')} {pagination.totalPages}
             </span>
             <Button 
               variant="ghost" 
               size="sm" 
               disabled={page >= pagination.totalPages}
               onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
             >
               {t('common.next')}
             </Button>
          </div>
        )}

      </div>
    </div>
  );
}
