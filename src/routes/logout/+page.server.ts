import { Actions, redirect } from '@sveltejs/kit';

export const actions: Actions = {
    default: async ({ cookies }) => {
        // Clear cookies
        cookies.delete('accessToken', { path: '/' });
        cookies.delete('refreshToken', { path: '/' });

        throw redirect(303, '/');
    }
};
