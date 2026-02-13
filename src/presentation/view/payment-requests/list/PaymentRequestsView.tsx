'use client';

import { Button } from '@/presentation/components/atoms';
import { usePaymentRequests } from './usePaymentRequests';
import { ArrowUpRight, Copy, Check, Plus, Link as LinkIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from '@/presentation/hooks';

export function PaymentRequestsView() {
  const { paymentRequests, isLoading, pagination, page, setPage } = usePaymentRequests();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { t } = useTranslation();

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-accent-green/10 text-accent-green border-accent-green/20';
      case 'pending':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-muted/10 text-muted border-white/10';
    }
  };

  const getStatusLabel = (status: string) => {
    const normalized = status.toLowerCase();
    if (normalized === 'completed') return t('payments.status.completed');
    if (normalized === 'pending') return t('payments.status.pending');
    if (normalized === 'failed') return t('payments.status.failed');
    if (normalized === 'expired') return t('payments.status.expired');
    return status;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-blue/10 border border-accent-blue/20 mb-3">
            <LinkIcon className="w-4 h-4 text-accent-blue" />
            <span className="text-xs text-accent-blue font-medium uppercase tracking-wider">
              {t('payment_requests.badge')}
            </span>
          </div>
          <h1 className="heading-2 text-foreground">{t('payment_requests.title')}</h1>
          <p className="body mt-1">{t('payment_requests.subtitle')}</p>
        </div>
        <Button variant="primary" glow>
          <Plus className="w-4 h-4" />
          {t('payment_requests.create')}
        </Button>
      </div>

      {/* Content */}
      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <div className="spinner-gradient mb-4" />
            <p className="text-muted">{t('payment_requests.loading')}</p>
          </div>
        ) : paymentRequests.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-surface border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ArrowUpRight className="w-10 h-10 text-muted" />
            </div>
            <h3 className="heading-3 text-foreground mb-2">{t('payment_requests.no_requests_title')}</h3>
            <p className="body max-w-sm mx-auto mb-6">
              {t('payment_requests.no_requests_desc')}
            </p>
            <Button variant="secondary">
              <Plus className="w-4 h-4" />
              {t('payment_requests.create')}
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {paymentRequests.map((request, index) => (
              <div 
                key={request.id} 
                className="p-5 hover:bg-white/5 transition-all duration-300 flex items-center justify-between group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent-blue/10 border border-accent-blue/20 text-accent-blue flex items-center justify-center group-hover:shadow-glow-blue transition-all duration-300">
                    <ArrowUpRight className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-foreground text-lg">
                        {request.amount} {request.tokenAddress ? t('payment_requests.token') : t('payment_requests.native')}
                      </h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles(request.status)}`}>
                        {getStatusLabel(request.status)}
                      </span>
                    </div>
                    <p className="text-sm text-muted">
                      {request.description || t('payment_requests.no_description')} • {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => copyToClipboard(`${window.location.origin}/pay/${request.id}`, request.id)}
                  >
                    {copiedId === request.id ? (
                      <>
                        <Check className="w-4 h-4 text-accent-green" />
                        {t('payment_requests.copied')}
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        {t('payment_requests.copy_link')}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-white/10">
            <p className="text-sm text-muted">
              {t('common.page_of')} <span className="text-foreground font-medium">{page}</span> {t('common.of')}{' '}
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
      </div>
    </div>
  );
}
