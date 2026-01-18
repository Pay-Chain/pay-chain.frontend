import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';
import { api, type User, type AuthResponse } from '$lib/services/api';

// Types
interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}

// Initial state
const initialState: AuthState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    isLoading: true,
    isAuthenticated: false,
};

// Load initial state from localStorage
function loadInitialState(): AuthState {
    if (!browser) return initialState;

    const stored = localStorage.getItem('auth');
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            api.setAccessToken(parsed.accessToken);
            return {
                ...parsed,
                isLoading: false,
                isAuthenticated: !!parsed.accessToken,
            };
        } catch {
            return { ...initialState, isLoading: false };
        }
    }
    return { ...initialState, isLoading: false };
}

// Create store
function createAuthStore() {
    const { subscribe, set, update } = writable<AuthState>(loadInitialState());

    // Persist to localStorage
    function persist(state: AuthState) {
        if (browser) {
            if (state.accessToken) {
                localStorage.setItem('auth', JSON.stringify({
                    user: state.user,
                    accessToken: state.accessToken,
                    refreshToken: state.refreshToken,
                }));
            } else {
                localStorage.removeItem('auth');
            }
        }
    }

    return {
        subscribe,

        async register(email: string, name: string, password: string, walletAddress?: string, walletChainId?: string, walletSignature?: string) {
            update(s => ({ ...s, isLoading: true }));

            const result = await api.register(name, email, password, walletAddress, walletChainId, walletSignature);

            update(s => ({ ...s, isLoading: false }));

            if (result.error) {
                throw new Error(result.error);
            }

            return result.data;
        },

        async login(email: string, password: string) {
            update(s => ({ ...s, isLoading: true }));

            const result = await api.login(email, password);

            if (result.error) {
                update(s => ({ ...s, isLoading: false }));
                throw new Error(result.error);
            }

            const { accessToken, refreshToken, user } = result.data!;
            api.setAccessToken(accessToken);

            const newState: AuthState = {
                user,
                accessToken,
                refreshToken,
                isLoading: false,
                isAuthenticated: true,
            };

            set(newState);
            persist(newState);

            return user;
        },

        async logout() {
            api.setAccessToken(null);
            const newState: AuthState = {
                user: null,
                accessToken: null,
                refreshToken: null,
                isLoading: false,
                isAuthenticated: false,
            };
            set(newState);
            persist(newState);
        },

        async refreshSession() {
            const state = get({ subscribe });
            if (!state.refreshToken) return false;

            const result = await api.refreshToken(state.refreshToken);

            if (result.error) {
                // Refresh failed, logout
                this.logout();
                return false;
            }

            const { accessToken, refreshToken } = result.data!;
            api.setAccessToken(accessToken);

            update(s => {
                const newState = { ...s, accessToken, refreshToken };
                persist(newState);
                return newState;
            });

            return true;
        },
    };
}

export const auth = createAuthStore();

// Derived stores
export const user = derived(auth, $auth => $auth.user);
export const isAuthenticated = derived(auth, $auth => $auth.isAuthenticated);
export const isLoading = derived(auth, $auth => $auth.isLoading);
