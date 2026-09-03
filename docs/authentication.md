# Authentication

Last updated: 2026-09-04

## Goal

Prepare authentication before Cloudflare production resources are configured.

Supported sign-in methods:
- email + password
- Google
- Apple

## Current implementation modes

### mock

Default development mode.

```
EXPO_PUBLIC_AUTH_MODE=mock
```

Behavior:
- login UI is enabled
- email / Google / Apple buttons work with local mock users
- no Cloudflare API is required
- useful for validating navigation and UI before infrastructure is ready

### remote

Uses Better Auth through the Cloudflare Workers API.

```
EXPO_PUBLIC_AUTH_MODE=remote
EXPO_PUBLIC_AUTH_BASE_URL=https://api.example.com
```

## Mobile architecture

- Better Auth client
- @better-auth/expo client plugin
- Expo SecureStore for session/cookie persistence
- Expo deep-link scheme: calendarapp
- auth route group
- protected application tabs

Routes:

```
(auth)/sign-in
(auth)/sign-up
(tabs)/*
```

Unauthenticated users cannot enter the tab application.

## Worker architecture

The API Worker exposes:

```
GET/POST /api/auth/*
GET      /api/me
GET      /health
```

Better Auth is created per request with the Worker environment so the D1 binding can be injected.

Database:
- Cloudflare D1
- Better Auth built-in D1 support

## Email delivery

Transactional email is handled by **Cloudflare Email Service** from the Cloudflare Worker.

Better Auth owns the authentication flow and token/URL generation. Cloudflare Email Service performs the actual delivery.

Initial email use cases:
- email verification after account registration
- password reset
- email-address change verification
- shared-calendar invitation email
- security/account notifications where required

Expected sign-up flow:

```
Expo
  -> Cloudflare Worker
  -> Better Auth creates verification token / URL
  -> Cloudflare Email Service sends verification email
  -> user opens verification URL
  -> Better Auth verifies token
  -> email address is marked verified
```

Policy:
- enable email verification for email/password sign-up
- do not allow production email/password accounts to remain permanently unverified
- email templates should be application-owned rather than coupled to frontend UI
- sender addresses and domains must be configured outside source control
- delivery failures must not expose secrets or raw provider errors to clients

Configured sender:

```
noreply@mail.nmtng.com
```

The sender address is exposed to the Worker as the non-secret `EMAIL_FROM` variable. The `EMAIL` binding is restricted with `allowed_sender_addresses` to the same address.

## Environment values

Worker public variables:

```
AUTH_BASE_URL=https://api.example.com
APP_ORIGIN=https://calendar.example.com
```

Worker secrets:

```
BETTER_AUTH_SECRET
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
APPLE_CLIENT_ID
APPLE_CLIENT_SECRET
```

Do not commit real values.

Email delivery configuration is managed through Cloudflare Email Service / Worker bindings and Cloudflare-side domain settings rather than application source secrets where possible.

Current Worker configuration:
- `EMAIL`: Cloudflare Email Service send binding
- `EMAIL_FROM=noreply@mail.nmtng.com`
- `allowed_sender_addresses=["noreply@mail.nmtng.com"]`
- Better Auth `emailVerification.sendOnSignUp=true`
- Better Auth `emailAndPassword.requireEmailVerification=true`
- Better Auth `emailAndPassword.sendResetPassword` sends through the same email service
- authentication route passes Worker `waitUntil` into the email sender so delivery work can continue after the HTTP response

## Cloudflare setup

Current / planned order:

1. Create D1 database.
2. Add the D1 binding as `DB` in Wrangler configuration.
3. Generate/apply the Better Auth schema against D1.
4. Set `BETTER_AUTH_SECRET` using Wrangler secrets.
5. Deploy the Worker and verify `/health`.
6. Configure the production `AUTH_BASE_URL`.
7. Configure Cloudflare Email Service for the production sender domain. ✅ `mail.nmtng.com`
8. Add the Worker email-sending binding/configuration. ✅
9. Connect Better Auth email verification and password-reset callbacks to the email sender. ✅
10. Deploy the Worker and test sign-up -> verification email -> verified login.
11. Configure Google OAuth credentials and callback URLs.
12. Configure Sign in with Apple credentials and callback URLs.
13. Switch mobile from `mock` to `remote`.
14. Test session persistence on iOS and Android.
15. Test logout and account deletion flow.

## Database migration policy

Do not manually maintain a guessed Better Auth auth schema.

When the D1 binding is available, use the Better Auth migration/generation tooling for the exact Better Auth version used by the repository.

Application-specific tables such as calendars and events will be managed separately from authentication tables.

## Security

- OAuth/client secrets live only in Cloudflare secrets.
- SecureStore is used on native devices for Better Auth session/cookie persistence.
- server endpoints must derive user identity from the validated session.
- never accept actor user IDs from client request bodies for authorization.
- development-only Expo origins must not be trusted in production.
- production deep-link origins should be explicitly limited.
- verification and password-reset URLs must be single-purpose and expire.
- never log verification tokens, password-reset tokens, or provider secrets.
