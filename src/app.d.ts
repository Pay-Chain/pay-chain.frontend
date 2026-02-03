// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
    namespace App {
        // interface Error {}
        interface Locals {
            isAuthenticated: boolean;
            accessToken: string | null;
            user: {
                id: string;
                email: string;
                name?: string;
            } | null;
        }
        interface PageData {
            isAuthenticated: boolean;
            user: {
                id: string;
                email: string;
                name?: string;
            } | null;
        }
        // interface PageState {}
        // interface Platform {}
    }
}

export { };
