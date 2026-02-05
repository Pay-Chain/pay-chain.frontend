'use client';

import { useHome } from './useHome';
import { Button } from '@/presentation/components/atoms';
import { RefreshCw, ArrowRight, AlertTriangle, CreditCard } from 'lucide-react';

export function HomeView() {
  const { payments, isLoading, error, handleRefresh } = useHome();

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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 animate-fade-in">
        <div className="spinner-gradient mb-4" />
        <p className="text-muted">Loading payments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-16 gap-6 animate-fade-in">
        <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </div>
        <div className="text-center">
          <h3 className="heading-3 text-foreground mb-2">Something went wrong</h3>
          <p className="text-red-400">{error}</p>
        </div>
        <Button onClick={handleRefresh} variant="secondary">
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-purple/10 border border-accent-purple/20 mb-3">
            <CreditCard className="w-4 h-4 text-accent-purple" />
            <span className="text-xs text-accent-purple font-medium uppercase tracking-wider">
              Overview
            </span>
          </div>
          <h1 className="heading-2 text-foreground">Payments</h1>
        </div>
        <Button onClick={handleRefresh} variant="secondary">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Content */}
      {payments.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-20 h-20 bg-surface border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CreditCard className="w-10 h-10 text-muted" />
          </div>
          <h3 className="heading-3 text-foreground mb-2">No payments found</h3>
          <p className="body max-w-sm mx-auto">
            Your payment history will appear here once you make your first transaction.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((payment, index) => (
            <div 
              key={payment.paymentId} 
              className="card-hover group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center group-hover:shadow-glow-sm transition-all duration-300">
                    <CreditCard className="w-6 h-6 text-accent-purple" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-foreground font-medium">
                      <span>{payment.sourceAmount}</span>
                      <ArrowRight className="w-4 h-4 text-muted" />
                      <span>{payment.destAmount}</span>
                    </div>
                    <p className="text-sm text-muted font-mono">
                      {payment.paymentId.slice(0, 8)}...{payment.paymentId.slice(-6)}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusStyles(payment.status)}`}>
                  {payment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
