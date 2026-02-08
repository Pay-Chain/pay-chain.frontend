'use client';

import { useAdminMerchants, useUpdateMerchantStatus } from '@/data/usecase/useAdmin';
import { Card } from '@/presentation/components/atoms';
import { CheckCircle, XCircle, Store, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function MerchantsPage() {
  const { data: merchants, isLoading } = useAdminMerchants();
  const { mutate: updateStatus, isPending } = useUpdateMerchantStatus();
  const [search, setSearch] = useState('');

  const filteredMerchants = merchants?.filter((m: any) => 
    m.businessName.toLowerCase().includes(search.toLowerCase()) ||
    m.businessEmail.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const handleStatusUpdate = (id: string, status: string) => {
    if (confirm(`Are you sure you want to mark this merchant as ${status}?`)) {
      updateStatus({ id, status });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Merchant Management</h1>
          <p className="text-muted">Review and manage merchant applications</p>
        </div>
        <input
          type="text"
          placeholder="Search merchants..."
          className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 w-full md:w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {filteredMerchants.length === 0 && (
          <div className="text-center p-12 border border-white/10 rounded-xl bg-white/5">
            <p className="text-muted">No merchants found.</p>
          </div>
        )}
        
        {filteredMerchants.map((merchant: any) => (
          <Card key={merchant.id} className="p-6 bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/20 text-primary">
                  <Store className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-lg">{merchant.businessName}</h3>
                  <div className="text-sm text-muted space-y-1 mt-1">
                    <p>Email: {merchant.businessEmail}</p>
                    <p className="flex items-center gap-2">
                       Type: <span className="text-foreground capitalize">{merchant.merchantType}</span>
                    </p>
                    {merchant.taxId && <p>Tax ID: {merchant.taxId}</p>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end md:self-center">
                <div className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center gap-2 ${
                  merchant.status === 'verified' || merchant.status === 'active' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                  merchant.status === 'rejected' || merchant.status === 'suspended' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                  'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                }`}>
                  {merchant.status === 'verified' || merchant.status === 'active' ? <CheckCircle className="w-3 h-3" /> :
                   merchant.status === 'rejected' || merchant.status === 'suspended' ? <XCircle className="w-3 h-3" /> :
                   <AlertCircle className="w-3 h-3" />}
                  <span className="uppercase">{merchant.status}</span>
                </div>

                {merchant.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusUpdate(merchant.id, 'verified')}
                      disabled={isPending}
                      className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors disabled:opacity-50"
                      title="Approve"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(merchant.id, 'rejected')}
                      disabled={isPending}
                      className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50"
                      title="Reject"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
