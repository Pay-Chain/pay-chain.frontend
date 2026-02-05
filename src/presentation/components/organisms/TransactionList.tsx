'use client';

import { formatCurrency, formatDate } from '@/core/utils';
import type { Payment } from '@/data/model/entity';
import { ArrowRight, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface TransactionListProps {
  payments: Payment[];
  showAll?: boolean;
  title?: string;
}

export default function TransactionList({ 
  payments, 
  showAll = false,
  title = 'Recent Transactions' 
}: TransactionListProps) {
  const displayPayments = showAll ? payments : payments.slice(0, 5);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-accent-green" />;
      case 'pending':
      case 'processing':
        return <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />;
      default:
        return <XCircle className="w-4 h-4 text-red-400" />;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-accent-green/10 text-accent-green border-accent-green/20';
      case 'pending':
      case 'processing':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-red-500/10 text-red-400 border-red-500/20';
    }
  };

  if (payments.length === 0) {
    return (
      <div className="card p-12 text-center animate-fade-in">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface border border-white/10 flex items-center justify-center">
          <Clock className="w-8 h-8 text-muted" />
        </div>
        <p className="text-muted text-lg">No transactions yet</p>
        <p className="text-muted/60 text-sm mt-1">Your payment history will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="heading-3 text-foreground">{title}</h2>
      <div className="space-y-3">
        {displayPayments.map((payment, index) => (
          <div
            key={payment.paymentId}
            className="card-hover p-4 flex items-center justify-between group"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-gradient-purple-blue/10 border border-accent-purple/20 flex items-center justify-center group-hover:shadow-glow-sm transition-all duration-300">
                <span className="text-accent-purple text-sm font-bold uppercase">
                  {payment.sourceChainId?.slice(0, 2) ?? 'TX'}
                </span>
              </div>
              
              {/* Transaction Details */}
              <div>
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <span>{payment.sourceAmount}</span>
                  <ArrowRight className="w-4 h-4 text-muted" />
                  <span>{payment.destAmount}</span>
                </div>
                <p className="text-muted text-sm mt-0.5">
                  {formatDate(payment.createdAt)}
                </p>
              </div>
            </div>
            
            {/* Amount & Status */}
            <div className="text-right flex flex-col items-end gap-2">
              <p className="text-foreground font-semibold">
                {formatCurrency(parseFloat(payment.sourceAmount ?? '0'))}
              </p>
              <span
                className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border ${getStatusStyles(payment.status)}`}
              >
                {getStatusIcon(payment.status)}
                <span className="capitalize">{payment.status}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
