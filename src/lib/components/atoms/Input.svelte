<script lang="ts">
  export let type: 'text' | 'email' | 'password' | 'number' = 'text';
  export let value = '';
  export let placeholder = '';
  export let label = '';
  export let error = '';
  export let disabled = false;
  export let required = false;
  export let name = '';
  export let id = name;

  let focused = false;
</script>

<div class="w-full">
  {#if label}
    <label for={id} class="block text-sm font-medium text-gray-300 mb-2">
      {label}
      {#if required}<span class="text-red-400">*</span>{/if}
    </label>
  {/if}
  
  <input
    {type}
    {id}
    {name}
    {placeholder}
    {disabled}
    {required}
    bind:value
    on:focus={() => focused = true}
    on:blur={() => focused = false}
    on:input
    class="w-full px-4 py-2.5 rounded-lg border transition-colors duration-200
      bg-gray-800 text-white placeholder-gray-500
      {error ? 'border-red-500 focus:border-red-500' : focused ? 'border-primary-500' : 'border-gray-700'}
      focus:outline-none focus:ring-1 focus:ring-primary-500
      disabled:opacity-50 disabled:cursor-not-allowed"
  />
  
  {#if error}
    <p class="mt-1 text-sm text-red-400">{error}</p>
  {/if}
</div>
