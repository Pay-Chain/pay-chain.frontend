<script lang="ts">
  import { auth } from '$lib/stores/auth';
  import { goto } from '$app/navigation';

  let email = '';
  let password = '';
  let error = '';
  let isLoading = false;

  async function handleSubmit() {
    error = '';
    isLoading = true;

    try {
      await auth.login(email, password);
      goto('/dashboard');
    } catch (e: any) {
      error = e.message || 'Login failed. Please try again.';
    } finally {
      isLoading = false;
    }
  }
</script>

<svelte:head>
  <title>Login - Pay-Chain</title>
</svelte:head>

<div class="min-h-screen bg-gray-950 flex items-center justify-center px-4">
  <div class="w-full max-w-md">
    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold text-white">Welcome back</h1>
      <p class="text-gray-400 mt-2">Sign in to your account</p>
    </div>

    <div class="card bg-gray-900 border-gray-800">
      <form on:submit|preventDefault={handleSubmit} class="space-y-6">
        {#if error}
          <div class="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
            {error}
          </div>
        {/if}

        <div>
          <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            bind:value={email}
            required
            class="input bg-gray-800 border-gray-700 text-white"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            bind:value={password}
            required
            class="input bg-gray-800 border-gray-700 text-white"
            placeholder="••••••••"
          />
        </div>

        <div class="flex items-center justify-between">
          <label class="flex items-center gap-2">
            <input type="checkbox" class="rounded border-gray-600 bg-gray-800 text-primary-500" />
            <span class="text-sm text-gray-400">Remember me</span>
          </label>
          <a href="/forgot-password" class="text-sm text-primary-400 hover:text-primary-300">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          class="btn-primary w-full py-3"
        >
          {#if isLoading}
            <span class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              Signing in...
            </span>
          {:else}
            Sign in
          {/if}
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-sm text-gray-400">
          Don't have an account?
          <a href="/register" class="text-primary-400 hover:text-primary-300 font-medium">
            Create one
          </a>
        </p>
      </div>
    </div>
  </div>
</div>
