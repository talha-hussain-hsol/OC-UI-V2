export const base_url =
  import.meta.env.VITE_API_URL || process.env.VITE_API_URL;
export const investorRedirectUrl =
  import.meta.env.VITE_INVESTOR_REDIRECT_URL ||
  process.env.VITE_INVESTOR_REDIRECT_URL;
export const investorClientId =
  import.meta.env.VITE_INVESTOR_CLIENT_ID ||
  process.env.VITE_INVESTOR_CLIENT_ID;
export const authUrl =
  import.meta.env.VITE_AUTH_API_URL || process.env.VITE_AUTH_API_URL;
export const scope =
  import.meta.env.VITE_AUTH_SCOPE || process.env.VITE_AUTH_SCOPE;
export const logoutRedirectUrl =
  import.meta.env.VITE_LOGOUT_REDIRECT_URL ||
  process.env.VITE_LOGOUT_REDIRECT_URL;
