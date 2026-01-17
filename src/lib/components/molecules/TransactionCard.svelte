<script lang="ts">
  import Badge from '../atoms/Badge.svelte';
  import Icon from '../atoms/Icon.svelte';
  import type { Payment } from '$lib/services/api';

  export let payment: Payment;

  const statusVariant: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
    pending: 'warning',
    processing: 'info',
    completed: 'success',
    failed: 'error',
    refunded: 'default',
  };

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function shortenAddress(addr: string): string {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }
</script>

<a
  href="/payments/{payment.paymentId}"
  class="block p-4 rounded-lg border border-gray-800 bg-gray-900/50 hover:border-gray-700 hover:bg-gray-900 transition-colors"
>
  <div class="flex items-start justify-between mb-3">
    <div>
      <p class="text-white font-medium text-lg">
        {payment.sourceAmount}
        <span class="text-gray-400">USDT</span>
      </p>
      <p class="text-gray-500 text-xs font-mono mt-1">
        {shortenAddress(payment.paymentId)}
      </p>
    </div>
    <Badge variant={statusVariant[payment.status] || 'default'}>
      {payment.status}
    </Badge>
  </div>
  
  <div class="flex items-center gap-2 text-sm text-gray-400 mb-3">
    <span>{payment.sourceChainId}</span>
    <Icon name="arrow-right" size={14} />
    <span>{payment.destChainId}</span>
  </div>
  
  <div class="flex items-center justify-between text-xs">
    <span class="text-gray-500">{formatDate(payment.createdAt)}</span>
    {#if payment.bridgeType}
      <span class="text-gray-600">via {payment.bridgeType}</span>
    {/if}
  </div>
</a>
