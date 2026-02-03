'use client';

import { formatCurrency, formatDate } from '@/core/utils';
import type { Payment } from '@/data/model/entity';

interface TransactionListProps {
  payments: Payment[];
  showAll?: boolean;
}

export default function TransactionList({ payments, showAll = false }: TransactionListProps) {
  const displayPayments = showAll ? payments : payments.slice(0, 5);

  if (payments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white/40">No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
      <div className="space-y-3">
        {displayPayments.map((payment) => (
          <div
            key={payment.paymentId}
            className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <span className="text-blue-400 text-sm font-medium">
                  {payment.sourceChainId?.slice(0, 2).toUpperCase() ?? 'TX'}
                </span>
              </div>
              <div>
                <p className="text-white font-medium">{payment.sourceAmount} → {payment.destAmount}</p>
                <p className="text-white/40 text-sm">{formatDate(payment.createdAt)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-medium">{formatCurrency(parseFloat(payment.sourceAmount ?? '0'))}</p>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  payment.status === 'completed'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : payment.status === 'pending' || payment.status === 'processing'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-red-500/20 text-red-400'
                }`}
              >
                {payment.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
