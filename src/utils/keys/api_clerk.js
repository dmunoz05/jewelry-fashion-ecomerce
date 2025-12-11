export function getApiKeyClerk() {
    const API_KEY_CLERK = import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY;
    return API_KEY_CLERK;
}