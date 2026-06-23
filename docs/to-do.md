# To Do

## Admin Auth

- Add D1 tables for admin users, external auth accounts, OAuth state/PKCE
  transactions, and opaque app sessions.
- Implement Facebook Login for Business authorization-code callback with state
  and PKCE validation.
- Exchange the Facebook authorization code server-side and resolve the returned
  Facebook account to an authorized admin.
- Store only the opaque app session ID in the `strut_admin_session` HttpOnly,
  Secure, SameSite=Lax, Path=/ cookie.
- Persist 30-day sliding sessions in D1 and regenerate session IDs on login,
  logout, and privilege changes.
- Replace the temporary cookie-presence guard in
  `app/actions/admin/controller.tsx` with `remix/session`, `remix/auth`, and
  D1-backed identity verification.
- Add CSRF tokens to all admin mutating forms before admin write actions are
  introduced.
- Add logout and expired-session handling once real sessions exist.

## Admin Dashboard Data

- Query active and recent workflow runs.
- Query workflow failures and `needs_review` logs.
- Query unpublished events, collections, looks, and media.
- Add event import and archive-management quick actions after the underlying
  tables and workflow routes exist.
