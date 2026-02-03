import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

// Routes that require authentication
const protectedRoutes = [
    '/dashboard',
    '/payments',
    '/wallets',
    '/settings',
    '/merchant',
    '/payment-requests',
];

// Routes that are only for guests (redirect to dashboard if logged in)
const guestOnlyRoutes = [
    '/login',
    '/register',
];

// Public routes (no auth check needed)
const publicRoutes = [
    '/',
    '/docs',
    '/support',
    '/terms',
    '/privacy',
    '/about',
    '/pay', // Guest payment page
];

export const handle: Handle = async ({ event, resolve }) => {
    // Get auth token from cookies
    const accessToken = event.cookies.get('accessToken');
    const refreshToken = event.cookies.get('refreshToken');

    // Check if user is authenticated
    const isAuthenticated = !!accessToken;

    // Get the current path
    const path = event.url.pathname;

    // Store auth state in locals for use in layouts and pages
    event.locals.isAuthenticated = isAuthenticated;
    event.locals.accessToken = accessToken || null;

    // If authenticated, try to get user info from token
    if (accessToken) {
        try {
            // Decode JWT to get user info (basic decode, not verification)
            const payload = JSON.parse(atob(accessToken.split('.')[1]));
            event.locals.user = {
                id: payload.sub || payload.user_id,
                email: payload.email,
                name: payload.name,
            };
        } catch {
            // Invalid token, clear it
            event.locals.isAuthenticated = false;
            event.locals.user = null;
            event.cookies.delete('accessToken', { path: '/' });
            event.cookies.delete('refreshToken', { path: '/' });
        }
    } else {
        event.locals.user = null;
    }

    // Check protected routes
    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
    const isGuestOnlyRoute = guestOnlyRoutes.some(route => path === route);

    // Redirect unauthenticated users from protected routes
    if (isProtectedRoute && !isAuthenticated) {
        const returnUrl = encodeURIComponent(path);
        throw redirect(303, `/login?returnUrl=${returnUrl}`);
    }

    // Redirect authenticated users from guest-only routes
    if (isGuestOnlyRoute && isAuthenticated) {
        throw redirect(303, '/dashboard');
    }

    // Continue with the request
    return resolve(event);
};
