<script lang="ts">
    import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
    import { wagmiAdapter } from "$lib/config/appkit";

    // Initialize QueryClient
    const queryClient = new QueryClient();
</script>

<QueryClientProvider client={queryClient}>
    <slot />
</QueryClientProvider>
