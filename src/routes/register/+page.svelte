<script lang="ts">
  import { auth } from "$lib/stores/auth";
  import { goto } from "$app/navigation";

  let step = 1; // 1: Account info, 2: Connect wallet
  let name = "";
  let email = "";
  let password = "";
  let confirmPassword = "";
  let error = "";
  let success = "";
  let isLoading = false;

  // Wallet state
  let walletAddress = "";
  let walletChainId = "";
  let walletSignature = "";
  let isConnectingWallet = false;

  async function handleAccountSubmit() {
    error = "";

    if (password !== confirmPassword) {
      error = "Passwords do not match";
      return;
    }

    if (password.length < 8) {
      error = "Password must be at least 8 characters";
      return;
    }

    // Proceed to wallet connection step
    step = 2;
  }

  async function connectWallet() {
    error = "";
    isConnectingWallet = true;

    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === "undefined") {
        error = "Please install MetaMask to continue";
        isConnectingWallet = false;
        return;
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      walletAddress = accounts[0];

      // Get chain ID
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      walletChainId = `eip155:${parseInt(chainId, 16)}`;

      // Create message to sign
      const message = `Sign this message to verify your wallet for Pay-Chain registration.\n\nWallet: ${walletAddress}\nTimestamp: ${Date.now()}`;

      // Request signature
      walletSignature = await window.ethereum.request({
        method: "personal_sign",
        params: [message, walletAddress],
      });
    } catch (e: any) {
      if (e.code === 4001) {
        error = "Wallet connection cancelled";
      } else {
        error = e.message || "Failed to connect wallet";
      }
    } finally {
      isConnectingWallet = false;
    }
  }

  async function handleFinalSubmit() {
    if (!walletAddress || !walletSignature) {
      error = "Please connect your wallet first";
      return;
    }

    isLoading = true;
    error = "";

    try {
      await auth.register(
        email,
        name,
        password,
        walletAddress,
        walletChainId,
        walletSignature,
      );
      success =
        "Registration successful! Please check your email for verification.";
      // Clear form
      step = 1;
      name = "";
      email = "";
      password = "";
      confirmPassword = "";
      walletAddress = "";
      walletSignature = "";
    } catch (e: any) {
      error = e.message || "Registration failed. Please try again.";
    } finally {
      isLoading = false;
    }
  }

  function goBack() {
    step = 1;
    error = "";
  }

  function truncateAddress(address: string) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }
</script>

<svelte:head>
  <title>Register - Pay-Chain</title>
</svelte:head>

<div
  class="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-12"
>
  <div class="w-full max-w-md">
    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold text-white">Create your account</h1>
      <p class="text-gray-400 mt-2">Start accepting cross-chain payments</p>

      <!-- Step indicator -->
      <div class="flex items-center justify-center gap-4 mt-6">
        <div class="flex items-center gap-2">
          <div
            class="w-8 h-8 rounded-full {step >= 1
              ? 'bg-primary-500'
              : 'bg-gray-700'} flex items-center justify-center text-white text-sm font-medium"
          >
            1
          </div>
          <span class="text-sm {step >= 1 ? 'text-white' : 'text-gray-500'}"
            >Account</span
          >
        </div>
        <div
          class="w-8 h-0.5 {step >= 2 ? 'bg-primary-500' : 'bg-gray-700'}"
        ></div>
        <div class="flex items-center gap-2">
          <div
            class="w-8 h-8 rounded-full {step >= 2
              ? 'bg-primary-500'
              : 'bg-gray-700'} flex items-center justify-center text-white text-sm font-medium"
          >
            2
          </div>
          <span class="text-sm {step >= 2 ? 'text-white' : 'text-gray-500'}"
            >Wallet</span
          >
        </div>
      </div>
    </div>

    <div class="card bg-gray-900 border-gray-800">
      {#if error}
        <div
          class="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm mb-5"
        >
          {error}
        </div>
      {/if}

      {#if success}
        <div
          class="bg-green-500/10 border border-green-500/50 rounded-lg p-3 text-green-400 text-sm mb-5"
        >
          {success}
          <a href="/login" class="block mt-2 underline">Go to login</a>
        </div>
      {:else if step === 1}
        <!-- Step 1: Account Information -->
        <form on:submit|preventDefault={handleAccountSubmit} class="space-y-5">
          <div>
            <label
              for="name"
              class="block text-sm font-medium text-gray-300 mb-2"
              >Full Name</label
            >
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
            <label
              for="email"
              class="block text-sm font-medium text-gray-300 mb-2">Email</label
            >
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
            <label
              for="password"
              class="block text-sm font-medium text-gray-300 mb-2"
              >Password</label
            >
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
            <label
              for="confirmPassword"
              class="block text-sm font-medium text-gray-300 mb-2"
              >Confirm Password</label
            >
            <input
              id="confirmPassword"
              type="password"
              bind:value={confirmPassword}
              required
              class="input bg-gray-800 border-gray-700 text-white"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" class="btn-primary w-full py-3"
            >Continue to Wallet</button
          >
        </form>
      {:else if step === 2}
        <!-- Step 2: Connect Wallet -->
        <div class="space-y-5">
          <button
            on:click={goBack}
            class="text-gray-400 hover:text-white flex items-center gap-2 text-sm"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>

          <div class="text-center py-4">
            <div
              class="w-16 h-16 mx-auto bg-primary-500/20 rounded-full flex items-center justify-center mb-4"
            >
              <svg
                class="w-8 h-8 text-primary-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 class="text-xl font-bold text-white mb-2">
              Connect your wallet
            </h2>
            <p class="text-gray-400 text-sm">
              A wallet is required to receive payments
            </p>
          </div>

          {#if walletAddress}
            <div
              class="bg-green-500/10 border border-green-500/50 rounded-lg p-4"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center"
                >
                  <svg
                    class="w-5 h-5 text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <p class="text-white font-medium">Wallet Connected</p>
                  <p class="text-green-400 text-sm font-mono">
                    {truncateAddress(walletAddress)}
                  </p>
                </div>
              </div>
            </div>
          {:else}
            <button
              on:click={connectWallet}
              disabled={isConnectingWallet}
              class="w-full py-4 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 transition-colors flex items-center justify-center gap-3"
            >
              {#if isConnectingWallet}
                <svg
                  class="animate-spin h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                Connecting...
              {:else}
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
                  alt="MetaMask"
                  class="w-6 h-6"
                />
                Connect MetaMask
              {/if}
            </button>
          {/if}

          <div class="flex items-start gap-2">
            <input
              type="checkbox"
              required
              class="mt-1 rounded border-gray-600 bg-gray-800 text-primary-500"
            />
            <span class="text-sm text-gray-400">
              I agree to the
              <a href="/terms" class="text-primary-400 hover:text-primary-300"
                >Terms of Service</a
              >
              and
              <a href="/privacy" class="text-primary-400 hover:text-primary-300"
                >Privacy Policy</a
              >
            </span>
          </div>

          <button
            on:click={handleFinalSubmit}
            disabled={isLoading || !walletAddress}
            class="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {#if isLoading}
              <span class="flex items-center justify-center gap-2">
                <svg
                  class="animate-spin h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                Creating account...
              </span>
            {:else}
              Create Account
            {/if}
          </button>
        </div>
      {/if}

      <div class="mt-6 text-center">
        <p class="text-sm text-gray-400">
          Already have an account?
          <a
            href="/login"
            class="text-primary-400 hover:text-primary-300 font-medium"
            >Sign in</a
          >
        </p>
      </div>
    </div>
  </div>
</div>
