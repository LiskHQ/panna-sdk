const defaultCookieOptions = {
  path: '/',
  secure: true,
  sameSite: 'strict',
  maxAge: 60 * 60 * 24 * 365 // 1 year in seconds
} as const;

export { defaultCookieOptions };
