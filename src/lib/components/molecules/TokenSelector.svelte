<script lang="ts">
  import Icon from '../atoms/Icon.svelte';
  import type { Token } from '$lib/services/api';

  export let tokens: Token[] = [];
  export let selected: Token | null = null;
  export let label = 'Select Token';
  export let disabled = false;

  let open = false;

  function selectToken(token: Token) {
    selected = token;
    open = false;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') open = false;
  }
</script>

<svelte:window on:keydown={handleKeydown} />

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
        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-xs">
          {selected.symbol.slice(0, 2)}
        </div>
        <div>
          <p class="text-white font-medium">{selected.symbol}</p>
          <p class="text-gray-400 text-xs">{selected.name}</p>
        </div>
      </div>
    {:else}
      <span class="text-gray-500">Select a token</span>
    {/if}
    <Icon name="chevron-down" size={20} className="text-gray-400" />
  </button>

  {#if open}
    <div class="absolute z-50 w-full mt-2 py-2 rounded-lg border border-gray-700 bg-gray-900 shadow-xl max-h-60 overflow-y-auto">
      {#each tokens as token}
        <button
          type="button"
          on:click={() => selectToken(token)}
          class="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors text-left
            {selected?.symbol === token.symbol ? 'bg-gray-800' : ''}"
        >
          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-xs">
            {token.symbol.slice(0, 2)}
          </div>
          <div>
            <p class="text-white font-medium">{token.symbol}</p>
            <p class="text-gray-400 text-xs">{token.name}</p>
          </div>
          {#if selected?.symbol === token.symbol}
            <Icon name="check" size={16} className="ml-auto text-primary-400" />
          {/if}
        </button>
      {:else}
        <p class="px-4 py-3 text-gray-500 text-sm">No tokens available</p>
      {/each}
    </div>
  {/if}
</div>

{#if open}
  <button type="button" class="fixed inset-0 z-40" on:click={() => open = false}></button>
{/if}
