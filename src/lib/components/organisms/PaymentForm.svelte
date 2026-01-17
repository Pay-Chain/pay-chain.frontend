<script lang="ts">
  import Button from '../atoms/Button.svelte';
  import ChainSelector from '../molecules/ChainSelector.svelte';
  import TokenSelector from '../molecules/TokenSelector.svelte';
  import AmountInput from '../molecules/AmountInput.svelte';
  import Input from '../atoms/Input.svelte';
  import Icon from '../atoms/Icon.svelte';
  import type { Chain, Token } from '$lib/services/api';
  import { createEventDispatcher } from 'svelte';

  export let chains: Chain[] = [];
  export let tokens: Token[] = [];
  export let loading = false;

  const dispatch = createEventDispatcher();

  let sourceChain: Chain | null = null;
  let destChain: Chain | null = null;
  let sourceToken: Token | null = null;
  let destToken: Token | null = null;
  let amount = '';
  let receiverAddress = '';
  let balance = '1000.00';

  // Fee calculation (simplified)
  $: baseFee = 0.50;
  $: percentageFee = parseFloat(amount || '0') * 0.003;
  $: platformFee = baseFee + percentageFee;
  $: bridgeFee = sourceChain?.caip2 !== destChain?.caip2 ? 0.10 : 0;
  $: totalFee = platformFee + bridgeFee;
  $: netAmount = Math.max(0, parseFloat(amount || '0') - totalFee);

  $: isValid = 
    sourceChain && destChain && 
    sourceToken && destToken && 
    parseFloat(amount) > 0 && 
    receiverAddress.length > 0;

  function swapChains() {
    const temp = sourceChain;
    sourceChain = destChain;
    destChain = temp;
  }

  function handleSubmit() {
    if (!isValid) return;
    
    dispatch('submit', {
      sourceChainId: sourceChain?.caip2,
      destChainId: destChain?.caip2,
      sourceTokenAddress: '0x...', // Would come from supported tokens
      destTokenAddress: '0x...',
      amount: amount,
      receiverAddress,
      decimals: 6,
    });
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-6">
  <!-- Source Chain & Token -->
  <div class="p-4 rounded-xl border border-gray-800 bg-gray-900/50">
    <p class="text-sm text-gray-400 mb-3">From</p>
    <div class="grid grid-cols-2 gap-4 mb-4">
      <ChainSelector bind:selected={sourceChain} {chains} label="" />
      <TokenSelector bind:selected={sourceToken} {tokens} label="" />
    </div>
    <AmountInput 
      bind:value={amount} 
      tokenSymbol={sourceToken?.symbol || 'USDT'} 
      {balance}
      label=""
    />
  </div>

  <!-- Swap Button -->
  <div class="flex justify-center -my-3 relative z-10">
    <button
      type="button"
      on:click={swapChains}
      class="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center hover:bg-gray-700 transition-colors"
    >
      <Icon name="arrow-down" size={20} className="text-gray-400" />
    </button>
  </div>

  <!-- Destination Chain & Token -->
  <div class="p-4 rounded-xl border border-gray-800 bg-gray-900/50">
    <p class="text-sm text-gray-400 mb-3">To</p>
    <div class="grid grid-cols-2 gap-4 mb-4">
      <ChainSelector bind:selected={destChain} {chains} label="" />
      <TokenSelector bind:selected={destToken} {tokens} label="" />
    </div>
    <div class="px-4 py-4 rounded-lg bg-gray-800">
      <p class="text-2xl font-medium text-white">
        ≈ {netAmount.toFixed(2)} <span class="text-gray-400">{destToken?.symbol || 'USDT'}</span>
      </p>
    </div>
  </div>

  <!-- Receiver Address -->
  <Input 
    bind:value={receiverAddress}
    label="Receiver Address"
    placeholder="0x... or wallet address"
    required
  />

  <!-- Fee Summary -->
  <div class="p-4 rounded-xl border border-gray-800 bg-gray-900/50 space-y-2">
    <div class="flex justify-between text-sm">
      <span class="text-gray-400">Platform Fee (0.3% + $0.50)</span>
      <span class="text-white">${platformFee.toFixed(2)}</span>
    </div>
    {#if bridgeFee > 0}
      <div class="flex justify-between text-sm">
        <span class="text-gray-400">Bridge Fee</span>
        <span class="text-white">${bridgeFee.toFixed(2)}</span>
      </div>
    {/if}
    <div class="flex justify-between text-sm pt-2 border-t border-gray-800">
      <span class="text-gray-300 font-medium">Total Fee</span>
      <span class="text-white font-medium">${totalFee.toFixed(2)}</span>
    </div>
    <div class="flex justify-between text-sm">
      <span class="text-gray-300 font-medium">You Receive</span>
      <span class="text-primary-400 font-medium">{netAmount.toFixed(2)} {destToken?.symbol || 'USDT'}</span>
    </div>
  </div>

  <!-- Submit Button -->
  <Button 
    type="submit" 
    variant="primary" 
    size="lg" 
    fullWidth 
    disabled={!isValid}
    {loading}
  >
    {#if loading}
      Processing...
    {:else}
      Create Payment
    {/if}
  </Button>
</form>
