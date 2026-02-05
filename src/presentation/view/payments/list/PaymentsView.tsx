'use client';

import Link from 'next/link';
import { Button } from '@/presentation/components/atoms';
import TransactionList from '@/presentation/components/organisms/TransactionList';
import { usePayments } from './usePayments';
import { useTranslation } from '@/presentation/hooks';
import { Plus, ChevronLeft, ChevronRight, CreditCard } from 'lucide-react';

export function PaymentsView() {
  const { payments, isLoading, pagination, page, setPage } = usePayments();
  const { t } = useTranslation();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-purple/10 border border-accent-purple/20 mb-3">
            <CreditCard className="w-4 h-4 text-accent-purple" />
            <span className="text-xs text-accent-purple font-medium uppercase tracking-wider">
              Transactions
            </span>
          </div>
          <h1 className="heading-2 text-foreground">{t('payments.title')}</h1>
        </div>
        <Link href="/payments/new">
          <Button variant="primary" glow>
            <Plus className="w-4 h-4" />
            {t('payments.new_payment')}
          </Button>
        </Link>
      </div>

      {/* Transaction List */}
      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <div className="spinner-gradient mb-4" />
            <p className="text-muted">Loading transactions...</p>
          </div>
        ) : (
          <>
            <TransactionList payments={payments} showAll={true} title="" />
            
            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-white/10">
                <p className="text-sm text-muted">
                  Page <span className="text-foreground font-medium">{page}</span> of{' '}
                  <span className="text-foreground font-medium">{pagination.totalPages}</span>
                </p>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    disabled={page <= 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    {t('common.previous')}
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    disabled={page >= pagination.totalPages}
                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                  >
                    {t('common.next')}
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
