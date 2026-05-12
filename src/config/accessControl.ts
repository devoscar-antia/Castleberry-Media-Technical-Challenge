/**
 * Access control configuration.
 *
 * REQUIRE_EMAIL_WHITELIST:
 *   - false → app is open to anyone who can authenticate (current setting).
 *   - true  → only users whose email is present in the `allowed_emails` table
 *             can access the app. All others are shown the AccessDenied screen.
 *
 * To re-enable the whitelist later, simply flip this flag to `true`.
 * No other code changes are required.
 */
export const REQUIRE_EMAIL_WHITELIST = false;
