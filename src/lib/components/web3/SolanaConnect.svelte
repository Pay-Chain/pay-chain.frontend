<script lang="ts">
    import { WalletMultiButton } from "@svelte-on-solana/wallet-adapter-ui";
    import { walletStore } from "@svelte-on-solana/wallet-adapter-core";
    import { onMount } from "svelte";
    import { walletStore as appWalletStore } from "$lib/stores/wallet";

    // Sync Solana wallet with our app store
    $: if ($walletStore.connected && $walletStore.publicKey) {
        appWalletStore.addWallet({
            id: `solana-${$walletStore.publicKey.toBase58()}`,
            address: $walletStore.publicKey.toBase58(),
            chainId: "solana-mainnet",
            isPrimary: false,
        });
    }
</script>

<div class="solana-button-container">
    <WalletMultiButton />
</div>

<style>
    .solana-button-container :global(.swab-button) {
        background-color: #512da8;
        color: white;
        font-size: 14px;
        height: 40px;
        padding: 0 16px;
        border-radius: 8px;
        font-weight: 600;
    }
</style>
