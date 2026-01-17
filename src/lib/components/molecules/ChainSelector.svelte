<script lang="ts">
  import Icon from '../atoms/Icon.svelte';
  import type { Chain } from '$lib/services/api';

  export let chains: Chain[] = [];
  export let selected: Chain | null = null;
  export let label = 'Select Chain';
  export let disabled = false;

  let open = false;

  const chainIcons: Record<string, string> = {
    'base': '🔵',
    'bsc': '🟡',
    'solana': '🟣',
    'ethereum': '⬛',
    'polygon': '🔷',
  };

  function getChainIcon(name: string): string {
    const lower = name.toLowerCase();
    for (const [key, icon] of Object.entries(chainIcons)) {
      if (lower.includes(key)) return icon;
    }
    return '🔗';
  }

  function selectChain(chain: Chain) {
    selected = chain;
    open = false;
  }
</script>

<div class="relative">
  {#if label}
    <label class="block text-sm font-medium text-gray-300 mb-2">{label}</label>
  {/if}
  
  <button
    type="button"
    {disabled}
    on:click={() => !disabled && (open = !open)}
    class="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-left transition-colors
      {disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-600 cursor-pointer'}"
  >
    {#if selected}
      <div class="flex items-center gap-3">
        <span class="text-2xl">{getChainIcon(selected.name)}</span>
        <div>
          <p class="text-white font-medium">{selected.name}</p>
          <p class="text-gray-400 text-xs font-mono">{selected.caip2}</p>
        </div>
      </div>
    {:else}
      <span class="text-gray-500">Select a chain</span>
    {/if}
    <Icon name="chevron-down" size={20} className="text-gray-400" />
  </button>

  {#if open}
    <div class="absolute z-50 w-full mt-2 py-2 rounded-lg border border-gray-700 bg-gray-900 shadow-xl max-h-60 overflow-y-auto">
      {#each chains as chain}
        <button
          type="button"
          on:click={() => selectChain(chain)}
          class="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors text-left
            {selected?.caip2 === chain.caip2 ? 'bg-gray-800' : ''}"
        >
          <span class="text-2xl">{getChainIcon(chain.name)}</span>
          <div>
            <p class="text-white font-medium">{chain.name}</p>
            <p class="text-gray-400 text-xs font-mono">{chain.caip2}</p>
          </div>
          {#if !chain.isActive}
            <span class="ml-auto text-xs text-yellow-500">Coming soon</span>
          {:else if selected?.caip2 === chain.caip2}
            <Icon name="check" size={16} className="ml-auto text-primary-400" />
          {/if}
        </button>
      {:else}
        <p class="px-4 py-3 text-gray-500 text-sm">No chains available</p>
      {/each}
    </div>
  {/if}
</div>

{#if open}
  <button type="button" class="fixed inset-0 z-40" on:click={() => open = false}></button>
{/if}
