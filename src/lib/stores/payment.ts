import { writable, derived } from 'svelte/store';
import type { Payment } from '$lib/services/api';

interface PaymentState {
    payments: Payment[];
    currentPayment: Payment | null;
    isLoading: boolean;
    error: string | null;
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

function createPaymentStore() {
    const initialState: PaymentState = {
        payments: [],
        currentPayment: null,
        isLoading: false,
        error: null,
        pagination: {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
        },
    };

    const { subscribe, set, update } = writable<PaymentState>(initialState);

    return {
        subscribe,

        setPayments: (payments: Payment[], pagination: PaymentState['pagination']) => {
            update((state) => ({
                ...state,
                payments,
                pagination,
                isLoading: false,
                error: null,
            }));
        },

        setCurrentPayment: (payment: Payment | null) => {
            update((state) => ({
                ...state,
                currentPayment: payment,
                isLoading: false,
            }));
        },

        addPayment: (payment: Payment) => {
            update((state) => ({
                ...state,
                payments: [payment, ...state.payments],
                pagination: {
                    ...state.pagination,
                    total: state.pagination.total + 1,
                },
            }));
        },

        updatePayment: (paymentId: string, updates: Partial<Payment>) => {
            update((state) => ({
                ...state,
                payments: state.payments.map((p) =>
                    p.paymentId === paymentId ? { ...p, ...updates } : p
                ),
                currentPayment:
                    state.currentPayment?.paymentId === paymentId
                        ? { ...state.currentPayment, ...updates }
                        : state.currentPayment,
            }));
        },

        setLoading: (isLoading: boolean) => {
            update((state) => ({ ...state, isLoading }));
        },

        setError: (error: string | null) => {
            update((state) => ({ ...state, error, isLoading: false }));
        },

        setPage: (page: number) => {
            update((state) => ({
                ...state,
                pagination: { ...state.pagination, page },
            }));
        },

        reset: () => set(initialState),
    };
}

export const paymentStore = createPaymentStore();

// Derived stores
export const payments = derived(paymentStore, ($store) => $store.payments);
export const currentPayment = derived(paymentStore, ($store) => $store.currentPayment);
export const isLoading = derived(paymentStore, ($store) => $store.isLoading);
export const paymentError = derived(paymentStore, ($store) => $store.error);
