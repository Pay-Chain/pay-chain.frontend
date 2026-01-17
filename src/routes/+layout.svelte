<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  import { auth, isAuthenticated, user } from '$lib/stores/auth';
  import { goto } from '$app/navigation';

  // Navigation items
  const publicNav = [
    { href: '/', label: 'Home' },
    { href: '/login', label: 'Login' },
    { href: '/register', label: 'Register' },
  ];

  const authNav = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/payments', label: 'Payments' },
    { href: '/wallets', label: 'Wallets' },
  ];

  async function handleLogout() {
    await auth.logout();
    goto('/');
  }
</script>

<div class="min-h-full">
  <!-- Navigation -->
  <nav class="bg-gray-900 border-b border-gray-800">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center">
          <a href="/" class="flex items-center gap-2">
            <div class="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <span class="text-white font-bold text-sm">PC</span>
            </div>
            <span class="text-white font-semibold text-lg">Pay-Chain</span>
          </a>
        </div>

        <!-- Navigation Links -->
        <div class="flex items-center gap-4">
          {#if $isAuthenticated}
            {#each authNav as item}
              <a
                href={item.href}
                class="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                class:text-white={$page.url.pathname === item.href}
              >
                {item.label}
              </a>
            {/each}
            
            <!-- User menu -->
            <div class="flex items-center gap-3 ml-4 pl-4 border-l border-gray-700">
              <span class="text-gray-400 text-sm">{$user?.email}</span>
              <button
                on:click={handleLogout}
                class="text-gray-400 hover:text-white text-sm font-medium"
              >
                Logout
              </button>
            </div>
          {:else}
            {#each publicNav as item}
              <a
                href={item.href}
                class="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                class:text-white={$page.url.pathname === item.href}
              >
                {item.label}
              </a>
            {/each}
          {/if}
        </div>
      </div>
    </div>
  </nav>

  <!-- Main content -->
  <main>
    <slot />
  </main>

  <!-- Footer -->
  <footer class="bg-gray-900 border-t border-gray-800 mt-auto">
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center">
        <p class="text-gray-400 text-sm">
          © 2026 Pay-Chain. Cross-chain stablecoin payment gateway.
        </p>
        <div class="flex gap-4">
          <a href="/docs" class="text-gray-400 hover:text-white text-sm">Docs</a>
          <a href="/support" class="text-gray-400 hover:text-white text-sm">Support</a>
        </div>
      </div>
    </div>
  </footer>
</div>
