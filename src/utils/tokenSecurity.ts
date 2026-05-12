/**
 * Token security utilities for handling LinkedIn OAuth tokens.
 *
 * Tokens are stored server-side in the `profiles` table and can only be
 * written via the `set_linkedin_token` SECURITY DEFINER RPC and cleared via
 * `clear_linkedin_token`. RLS restricts read access to the owning user.
 */

/**
 * Validates if a token is expired based on its creation time and expiry duration.
 */
export function isTokenExpired(createdAt: string, expiresInSeconds: number): boolean {
  const creationTime = new Date(createdAt).getTime();
  const expirationTime = creationTime + (expiresInSeconds * 1000);
  return Date.now() > expirationTime;
}

/**
 * Check if a token will expire soon (within the specified threshold time).
 * Default threshold is 7 days for LinkedIn tokens (which last 60 days).
 */
export function isTokenExpiringSoon(
  createdAt: string,
  expiresInSeconds: number,
  thresholdSeconds = 7 * 24 * 60 * 60
): boolean {
  const creationTime = new Date(createdAt).getTime();
  const expirationTime = creationTime + (expiresInSeconds * 1000);
  const thresholdTime = Date.now() + (thresholdSeconds * 1000);
  return thresholdTime > expirationTime;
}

/**
 * Validates token scopes to ensure they match required permissions.
 */
export function validateTokenScopes(scopes: string, requiredScopes: string[]): boolean {
  if (!scopes) return false;
  const scopeArray = scopes.split(' ');
  return requiredScopes.every(scope => scopeArray.includes(scope));
}

/**
 * The raw LinkedIn access token is no longer readable by clients. Column-level
 * privileges revoke `SELECT (linkedin_token)` from the `authenticated` role,
 * and the `get_my_linkedin_token_status` RPC exposes only `{ has_token, expires_at }`.
 * Server-side edge functions read the token via the service role.
 */

/**
 * Get human-readable token expiry information.
 */
export function getTokenExpiryInfo(expiresAt: string): {
  daysRemaining: number;
  isExpired: boolean;
  isExpiringSoon: boolean;
} {
  const expirationTime = new Date(expiresAt).getTime();
  const now = Date.now();
  const daysRemaining = Math.round((expirationTime - now) / (1000 * 60 * 60 * 24));

  return {
    daysRemaining,
    isExpired: daysRemaining < 0,
    isExpiringSoon: daysRemaining < 7 && daysRemaining >= 0,
  };
}
