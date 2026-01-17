import { writable, derived } from 'svelte/store';
import type { Chain, Token } from '$lib/services/api';

interface AppState {
    chains: Chain[];
    tokens: Token[];
    isInitialized: boolean;
    theme: 'dark' | 'light';
    sidebarOpen: boolean;
}

function createAppStore() {
    const initialState: AppState = {
        chains: [],
        tokens: [],
        isInitialized: false,
        theme: 'dark',
        sidebarOpen: false,
    };

    const { subscribe, set, update } = writable<AppState>(initialState);

    return {
        subscribe,

        setChains: (chains: Chain[]) => {
            update((state) => ({ ...state, chains }));
        },

        setTokens: (tokens: Token[]) => {
            update((state) => ({ ...state, tokens }));
        },

        initialize: () => {
            update((state) => ({ ...state, isInitialized: true }));
        },

        toggleSidebar: () => {
            update((state) => ({ ...state, sidebarOpen: !state.sidebarOpen }));
        },

        setSidebarOpen: (open: boolean) => {
            update((state) => ({ ...state, sidebarOpen: open }));
        },

        setTheme: (theme: 'dark' | 'light') => {
            update((state) => ({ ...state, theme }));
            if (typeof document !== 'undefined') {
                document.documentElement.classList.toggle('dark', theme === 'dark');
            }
        },

        reset: () => set(initialState),
    };
}

export const appStore = createAppStore();

// Derived stores
export const chains = derived(appStore, ($store) => $store.chains);
export const tokens = derived(appStore, ($store) => $store.tokens);
export const activeChains = derived(appStore, ($store) =>
    $store.chains.filter(c => c.isActive)
);
