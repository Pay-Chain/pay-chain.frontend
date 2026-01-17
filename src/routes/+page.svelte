<script lang="ts">
  import { goto } from '$app/navigation';
  import { isAuthenticated } from '$lib/stores/auth';

  // Features list
  const features = [
    {
      icon: '⚡',
      title: 'Cross-Chain Payments',
      description: 'Send stablecoins across Base, BSC, and Solana seamlessly'
    },
    {
      icon: '💰',
      title: 'Low Fees',
      description: 'Hybrid fee model: 0.3% + $0.50 base fee with merchant discounts'
    },
    {
      icon: '🔗',
      title: 'Multiple Bridges',
      description: 'Automatic bridge selection: CCIP, Hyperlane, and Hyperbridge'
    },
    {
      icon: '🛡️',
      title: 'Secure',
      description: 'Non-custodial smart contracts with multi-layer security'
    }
  ];

  const supportedChains = [
    { name: 'Base', logo: '🔵' },
    { name: 'BSC', logo: '🟡' },
    { name: 'Solana', logo: '🟣' },
  ];

  function handleGetStarted() {
    if ($isAuthenticated) {
      goto('/dashboard');
    } else {
      goto('/register');
    }
  }
</script>

<svelte:head>
  <title>Pay-Chain - Cross-Chain Stablecoin Payments</title>
</svelte:head>

<!-- Hero Section -->
<div class="relative bg-gray-900 overflow-hidden">
  <!-- Background gradient -->
  <div class="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-gray-900 to-accent-900/20"></div>
  
  <div class="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
    <div class="text-center">
      <h1 class="text-4xl font-bold tracking-tight text-white sm:text-6xl">
        <span class="block">Cross-Chain</span>
        <span class="block bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
          Stablecoin Payments
        </span>
      </h1>
      <p class="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
        Send and receive stablecoin payments across multiple blockchains. 
        Low fees, fast settlement, automatic bridge selection.
      </p>
      <div class="mt-10 flex items-center justify-center gap-4">
        <button on:click={handleGetStarted} class="btn-primary text-base px-8 py-3">
          Get Started
        </button>
        <a href="/docs" class="btn-secondary text-base px-8 py-3">
          View Docs
        </a>
      </div>

      <!-- Supported chains -->
      <div class="mt-16">
        <p class="text-gray-500 text-sm mb-4">Supported Networks</p>
        <div class="flex justify-center gap-8">
          {#each supportedChains as chain}
            <div class="flex items-center gap-2 text-gray-400">
              <span class="text-2xl">{chain.logo}</span>
              <span>{chain.name}</span>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Features Section -->
<div class="bg-gray-950 py-24">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-16">
      <h2 class="text-3xl font-bold text-white">Why Pay-Chain?</h2>
      <p class="mt-4 text-gray-400">Built for the multi-chain future</p>
    </div>

    <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {#each features as feature}
        <div class="card bg-gray-900 border-gray-800 hover:border-primary-500/50 transition-colors">
          <div class="text-4xl mb-4">{feature.icon}</div>
          <h3 class="text-lg font-semibold text-white mb-2">{feature.title}</h3>
          <p class="text-gray-400 text-sm">{feature.description}</p>
        </div>
      {/each}
    </div>
  </div>
</div>

<!-- CTA Section -->
<div class="bg-gradient-to-r from-primary-900/50 to-accent-900/50 py-16">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
    <h2 class="text-2xl font-bold text-white mb-4">Ready to get started?</h2>
    <p class="text-gray-300 mb-8">Create your account and start accepting cross-chain payments today.</p>
    <button on:click={handleGetStarted} class="btn-primary text-base px-8 py-3">
      Create Account
    </button>
  </div>
</div>
