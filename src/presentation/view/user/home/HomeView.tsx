'use client';

import { useHome } from './useHome';

export function HomeView() {
  const { payments, isLoading, error, handleRefresh } = useHome();

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-4">
        <p className="text-red-500">{error}</p>
        <button onClick={handleRefresh} className="px-4 py-2 bg-blue-600 text-white rounded">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Payments</h1>
        <button onClick={handleRefresh} className="px-4 py-2 bg-blue-600 text-white rounded">
          Refresh
        </button>
      </div>

      {payments.length === 0 ? (
        <div className="text-center text-gray-500 py-12">No payments found</div>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment.paymentId} className="p-4 border rounded-lg bg-white shadow-sm">
              <div className="flex justify-between">
                <span className="font-medium">{payment.paymentId}</span>
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    payment.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : payment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {payment.status}
                </span>
              </div>
              <div className="text-sm text-gray-600 mt-2">
                Amount: {payment.sourceAmount} → {payment.destAmount}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
