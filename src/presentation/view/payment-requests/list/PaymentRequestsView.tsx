'use client';

import { Button } from '@/presentation/components/atoms';
import { usePaymentRequests } from './usePaymentRequests';
import { ArrowUpRight, Copy, Check } from 'lucide-react';
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{t('payment_requests.title')}</h1>
        <Button>{t('payment_requests.create')}</Button>
      </div>

      <div className="text-white/50 mb-4">{t('payment_requests.subtitle')}</div>

      <div className="bg-white/5 border border-white/5 rounded-2xl backdrop-blur-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-white/50">{t('payment_requests.loading')}</div>
        ) : paymentRequests.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowUpRight className="w-8 h-8 text-white/20" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">{t('payment_requests.no_requests_title')}</h3>
            <p className="text-white/50 mb-6 max-w-sm mx-auto">
              {t('payment_requests.no_requests_desc')}
            </p>
            <Button>{t('payment_requests.create')}</Button>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {paymentRequests.map((request) => (
              <div key={request.id} className="p-4 hover:bg-white/5 transition-colors flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                       <h4 className="font-medium text-white">
                         {request.amount} {request.tokenAddress ? t('payment_requests.token') : t('payment_requests.native')}
                       </h4>
                       <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                         request.status === 'pending' ? 'bg-amber-500/20 text-amber-300' :
                         request.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' :
                         'bg-gray-500/20 text-gray-400'
                       }`}>
                         {request.status}
                       </span>
                    </div>
                    <p className="text-sm text-white/50">
                      {request.description || 'No description'} • {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyToClipboard(`${window.location.origin}/pay/${request.id}`, request.id)}
                    className="text-white/50 hover:text-white"
                  >
                    {copiedId === request.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    <span className="ml-2">{copiedId === request.id ? t('payment_requests.copied') : t('payment_requests.copy_link')}</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
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
