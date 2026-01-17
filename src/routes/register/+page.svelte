<script lang="ts">
  import { auth } from '$lib/stores/auth';
  import { goto } from '$app/navigation';

  let name = '';
  let email = '';
  let password = '';
  let confirmPassword = '';
  let error = '';
  let success = '';
  let isLoading = false;

  async function handleSubmit() {
    error = '';
    success = '';

    if (password !== confirmPassword) {
      error = 'Passwords do not match';
      return;
    }

    if (password.length < 8) {
      error = 'Password must be at least 8 characters';
      return;
    }

    isLoading = true;

    try {
      await auth.register(email, name, password);
      success = 'Registration successful! Please check your email for verification.';
      // Clear form
      name = '';
      email = '';
      password = '';
      confirmPassword = '';
    } catch (e: any) {
      error = e.message || 'Registration failed. Please try again.';
    } finally {
      isLoading = false;
    }
  }
</script>

<svelte:head>
  <title>Register - Pay-Chain</title>
</svelte:head>

<div class="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-12">
  <div class="w-full max-w-md">
    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold text-white">Create your account</h1>
      <p class="text-gray-400 mt-2">Start accepting cross-chain payments</p>
    </div>

    <div class="card bg-gray-900 border-gray-800">
      <form on:submit|preventDefault={handleSubmit} class="space-y-5">
        {#if error}
          <div class="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
            {error}
          </div>
        {/if}

        {#if success}
          <div class="bg-green-500/10 border border-green-500/50 rounded-lg p-3 text-green-400 text-sm">
            {success}
            <a href="/login" class="block mt-2 underline">Go to login</a>
          </div>
        {/if}

        <div>
          <label for="name" class="block text-sm font-medium text-gray-300 mb-2">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            bind:value={name}
            required
            class="input bg-gray-800 border-gray-700 text-white"
            placeholder="John Doe"
          />
        </div>

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
            minlength="8"
            class="input bg-gray-800 border-gray-700 text-white"
            placeholder="••••••••"
          />
          <p class="mt-1 text-xs text-gray-500">At least 8 characters</p>
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-2">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            bind:value={confirmPassword}
            required
            class="input bg-gray-800 border-gray-700 text-white"
            placeholder="••••••••"
          />
        </div>

        <div class="flex items-start gap-2">
          <input type="checkbox" required class="mt-1 rounded border-gray-600 bg-gray-800 text-primary-500" />
          <span class="text-sm text-gray-400">
            I agree to the
            <a href="/terms" class="text-primary-400 hover:text-primary-300">Terms of Service</a>
            and
            <a href="/privacy" class="text-primary-400 hover:text-primary-300">Privacy Policy</a>
          </span>
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
              Creating account...
            </span>
          {:else}
            Create Account
          {/if}
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-sm text-gray-400">
          Already have an account?
          <a href="/login" class="text-primary-400 hover:text-primary-300 font-medium">
            Sign in
          </a>
        </p>
      </div>
    </div>
  </div>
</div>
