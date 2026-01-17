<script lang="ts">
  import { onMount } from 'svelte';
  import Button from '$lib/components/atoms/Button.svelte';
  import Icon from '$lib/components/atoms/Icon.svelte';
  import TransactionList from '$lib/components/organisms/TransactionList.svelte';
  import { authStore, isAuthenticated } from '$lib/stores/auth';
  import { paymentStore } from '$lib/stores/payment';
  import { walletStore, primaryWallet } from '$lib/stores/wallet';
  import { api } from '$lib/services/api';
  import { formatCurrency, shortenAddress } from '$lib/utils/format';
  import type { Payment } from '$lib/services/api';
  import { goto } from '$app/navigation';

  let loading = true;
  let payments: Payment[] = [];
  let stats = {
    totalPayments: 0,
    totalVolume: 0,
    activeWallets: 0,
    pendingPayments: 0,
  };

  $: user = $authStore.user;
  $: wallet = $primaryWallet;

  onMount(async () => {
    if (!$isAuthenticated) {
      goto('/login');
      return;
    }

    await loadDashboardData();
  });

  async function loadDashboardData() {
    loading = true;
    
    try {
      api.setAccessToken($authStore.accessToken);
      
      const [paymentsRes, walletsRes] = await Promise.all([
        api.listPayments(1, 5),
        api.listWallets(),
      ]);

      if (paymentsRes.data) {
        payments = paymentsRes.data.payments || [];
        paymentStore.setPayments(payments, paymentsRes.data.pagination);
        
        // Calculate stats
        stats.totalPayments = paymentsRes.data.pagination?.total || payments.length;
        stats.totalVolume = payments.reduce((sum, p) => sum + parseFloat(p.sourceAmount || '0'), 0);
        stats.pendingPayments = payments.filter(p => p.status === 'pending' || p.status === 'processing').length;
      }

      if (walletsRes.data) {
        stats.activeWallets = walletsRes.data.wallets?.length || 0;
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Dashboard | Pay-Chain</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-8">
  <!-- Header -->
  <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
    <div>
      <h1 class="text-2xl font-bold text-white">
        Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}! 👋
      </h1>
      <p class="text-gray-400 mt-1">
        Here's what's happening with your payments
      </p>
    </div>
    <div class="flex items-center gap-3 mt-4 md:mt-0">
      {#if wallet}
        <div class="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700">
          <div class="w-2 h-2 rounded-full bg-green-500"></div>
          <span class="text-gray-300 font-mono text-sm">{shortenAddress(wallet.address)}</span>
        </div>
      {/if}
      <Button variant="primary" on:click={() => goto('/payments/new')}>
        <Icon name="plus" size={18} />
        New Payment
      </Button>
    </div>
  </div>

  <!-- Stats Grid -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    <div class="p-4 rounded-xl border border-gray-800 bg-gray-900/50">
      <p class="text-gray-400 text-sm mb-1">Total Payments</p>
      <p class="text-2xl font-bold text-white">{stats.totalPayments}</p>
    </div>
    <div class="p-4 rounded-xl border border-gray-800 bg-gray-900/50">
      <p class="text-gray-400 text-sm mb-1">Total Volume</p>
      <p class="text-2xl font-bold text-white">{formatCurrency(stats.totalVolume)}</p>
    </div>
    <div class="p-4 rounded-xl border border-gray-800 bg-gray-900/50">
      <p class="text-gray-400 text-sm mb-1">Connected Wallets</p>
      <p class="text-2xl font-bold text-white">{stats.activeWallets}</p>
    </div>
    <div class="p-4 rounded-xl border border-gray-800 bg-gray-900/50">
      <p class="text-gray-400 text-sm mb-1">Pending</p>
      <p class="text-2xl font-bold text-yellow-400">{stats.pendingPayments}</p>
    </div>
  </div>

  <!-- Quick Actions -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    <a href="/payments/new" class="p-4 rounded-xl border border-gray-800 bg-gray-900/50 hover:border-primary-500 transition-colors group">
      <div class="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center mb-3">
        <Icon name="plus" size={20} className="text-primary-400" />
      </div>
      <p class="text-white font-medium group-hover:text-primary-400">Create Payment</p>
      <p class="text-gray-500 text-sm">Send cross-chain</p>
    </a>
    <a href="/wallets" class="p-4 rounded-xl border border-gray-800 bg-gray-900/50 hover:border-primary-500 transition-colors group">
      <div class="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-3">
        <Icon name="wallet" size={20} className="text-blue-400" />
      </div>
      <p class="text-white font-medium group-hover:text-primary-400">Manage Wallets</p>
      <p class="text-gray-500 text-sm">Connect & view</p>
    </a>
    <a href="/payments" class="p-4 rounded-xl border border-gray-800 bg-gray-900/50 hover:border-primary-500 transition-colors group">
      <div class="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center mb-3">
        <Icon name="refresh" size={20} className="text-green-400" />
      </div>
      <p class="text-white font-medium group-hover:text-primary-400">Transaction History</p>
      <p class="text-gray-500 text-sm">View all payments</p>
    </a>
    <a href="/settings" class="p-4 rounded-xl border border-gray-800 bg-gray-900/50 hover:border-primary-500 transition-colors group">
      <div class="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-3">
        <Icon name="external-link" size={20} className="text-purple-400" />
      </div>
      <p class="text-white font-medium group-hover:text-primary-400">Settings</p>
      <p class="text-gray-500 text-sm">Account & preferences</p>
    </a>
  </div>

  <!-- Recent Transactions -->
  <div class="p-6 rounded-xl border border-gray-800 bg-gray-900/50">
    <TransactionList {payments} {loading} title="Recent Transactions" />
  </div>
</div>
