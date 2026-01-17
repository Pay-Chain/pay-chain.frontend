<script lang="ts">
  export let value = '';
  export let label = 'Amount';
  export let tokenSymbol = 'USDT';
  export let balance = '0';
  export let error = '';
  export let disabled = false;

  function setMax() {
    value = balance;
  }

  function handleInput(e: Event) {
    const input = e.target as HTMLInputElement;
    // Only allow numbers and decimals
    value = input.value.replace(/[^0-9.]/g, '');
    // Prevent multiple decimals
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }
  }
</script>

<div class="w-full">
  <div class="flex items-center justify-between mb-2">
    <label class="text-sm font-medium text-gray-300">{label}</label>
    <div class="flex items-center gap-2 text-sm text-gray-400">
      <span>Balance: {parseFloat(balance).toLocaleString()} {tokenSymbol}</span>
      <button
        type="button"
        on:click={setMax}
        class="text-primary-400 hover:text-primary-300 font-medium"
      >
        MAX
      </button>
    </div>
  </div>
  
  <div class="relative">
    <input
      type="text"
      inputmode="decimal"
      {disabled}
      {value}
      on:input={handleInput}
      placeholder="0.00"
      class="w-full px-4 py-4 pr-20 rounded-lg border transition-colors duration-200
        bg-gray-800 text-white text-2xl font-medium placeholder-gray-600
        {error ? 'border-red-500' : 'border-gray-700 focus:border-primary-500'}
        focus:outline-none focus:ring-1 focus:ring-primary-500
        disabled:opacity-50 disabled:cursor-not-allowed"
    />
    <div class="absolute right-4 top-1/2 -translate-y-1/2">
      <span class="text-gray-400 font-medium">{tokenSymbol}</span>
    </div>
  </div>
  
  {#if error}
    <p class="mt-1 text-sm text-red-400">{error}</p>
  {/if}
</div>
