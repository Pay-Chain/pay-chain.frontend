<script lang="ts">
  import TransactionCard from '../molecules/TransactionCard.svelte';
  import Icon from '../atoms/Icon.svelte';
  import type { Payment } from '$lib/services/api';

  export let payments: Payment[] = [];
  export let loading = false;
  export let title = 'Recent Transactions';
  export let emptyMessage = 'No transactions yet';
</script>

<div class="space-y-4">
  <div class="flex items-center justify-between">
    <h3 class="text-lg font-semibold text-white">{title}</h3>
    {#if payments.length > 0}
      <a href="/payments" class="text-primary-400 text-sm hover:text-primary-300 flex items-center gap-1">
        View all
        <Icon name="chevron-right" size={16} />
      </a>
    {/if}
  </div>

  {#if loading}
    <div class="space-y-3">
      {#each [1, 2, 3] as _}
        <div class="p-4 rounded-lg border border-gray-800 bg-gray-900/50 animate-pulse">
          <div class="flex items-start justify-between mb-3">
            <div>
              <div class="h-6 w-24 bg-gray-700 rounded"></div>
              <div class="h-4 w-32 bg-gray-800 rounded mt-2"></div>
            </div>
            <div class="h-6 w-20 bg-gray-700 rounded-full"></div>
          </div>
          <div class="h-4 w-40 bg-gray-800 rounded"></div>
        </div>
      {/each}
    </div>
  {:else if payments.length === 0}
    <div class="text-center py-12">
      <div class="w-16 h-16 mx-auto rounded-full bg-gray-800 flex items-center justify-center mb-4">
        <Icon name="wallet" size={32} className="text-gray-600" />
      </div>
      <p class="text-gray-500">{emptyMessage}</p>
      <a href="/payments/new" class="text-primary-400 text-sm hover:text-primary-300 mt-2 inline-block">
        Create your first payment →
      </a>
    </div>
  {:else}
    <div class="space-y-3">
      {#each payments as payment}
        <TransactionCard {payment} />
      {/each}
    </div>
  {/if}
</div>
