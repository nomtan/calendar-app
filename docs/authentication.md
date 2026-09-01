# Authentication

Last updated: 2026-09-01

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

## Cloudflare setup to do later

1. Create D1 database.
2. Add the D1 binding as `DB` in wrangler configuration.
3. Generate/apply the Better Auth schema against D1.
4. Set `BETTER_AUTH_SECRET` using Wrangler secrets.
5. Configure Google OAuth credentials and callback URLs.
6. Configure Sign in with Apple credentials and callback URLs.
7. Set the production API URL as `AUTH_BASE_URL`.
8. Switch mobile from `mock` to `remote`.
9. Test session persistence on iOS and Android.
10. Test logout and account deletion flow.

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
