<script lang="ts">
    import { onMount } from "svelte";
    import { walletStore } from "$lib/stores/wallet";
    import {
        WalletProvider,
        ConnectionProvider,
    } from "@svelte-on-solana/wallet-adapter-core";
    import { WalletMultiButton } from "@svelte-on-solana/wallet-adapter-ui";
    import {
        PhantomWalletAdapter,
        SolflareWalletAdapter,
    } from "@solana/wallet-adapter-wallets";
    import { clusterApiUrl } from "@solana/web3.js";
    import "@svelte-on-solana/wallet-adapter-ui/styles.css";

    const network = clusterApiUrl("mainnet-beta");
    const wallets = [new PhantomWalletAdapter(), new SolflareWalletAdapter()];

    // Pass localStorage key to keep it persistent
    const localStorageKey = "solana-wallet";
</script>

<ConnectionProvider endpoint={network}>
    <WalletProvider {wallets} {localStorageKey} autoConnect>
        <slot />
    </WalletProvider>
</ConnectionProvider>
