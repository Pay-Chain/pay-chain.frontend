import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { api } from '$lib/services/api';

export const actions: Actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const name = data.get('name') as string;
        const email = data.get('email') as string;
        const password = data.get('password') as string;
        const walletAddress = data.get('walletAddress') as string;
        const walletChainId = data.get('walletChainId') as string;
        const walletSignature = data.get('walletSignature') as string;

        if (!email || !password || !name) {
            return fail(400, { email, name, missing: true });
        }

        const result = await api.register(
            name,
            email,
            password,
            walletAddress,
            walletChainId,
            walletSignature
        );

        if (result.error) {
            return fail(401, { email, name, error: result.error });
        }

        // Check if registration also returns tokens (auto-login)
        // If it does, set cookies. If not, user has to login.
        // Based on current frontend code, it doesn't seem to set tokens on register.

        return { success: true };
    }
};
