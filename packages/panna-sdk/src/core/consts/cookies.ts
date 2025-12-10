// For user preferences (long-lived)
export const preferenceCookieOptions = {
  path: '/',
  secure: true,
  sameSite: 'strict',
  maxAge: 60 * 60 * 24 * 365 // 1 year
} as const;

// For auth tokens (session or short-lived)
export const authCookieOptions = {
  path: '/',
  secure: true,
  sameSite: 'strict'
} as const;
