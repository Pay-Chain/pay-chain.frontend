import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { api } from '$lib/services/api';

export const actions: Actions = {
    default: async ({ request, cookies, url }) => {
        const data = await request.formData();
        const email = data.get('email') as string;
        const password = data.get('password') as string;

        if (!email || !password) {
            return fail(400, { email, missing: true });
        }

        const result = await api.login(email, password);

        if (result.error) {
            return fail(401, { email, error: result.error });
        }

        const { accessToken, refreshToken, user } = result.data!;

        // Set cookies
        cookies.set('accessToken', accessToken, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 // 1 day
        });

        cookies.set('refreshToken', refreshToken, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7 // 7 days
        });

        const returnUrl = url.searchParams.get('returnUrl') || '/dashboard';
        throw redirect(303, returnUrl);
    }
};
