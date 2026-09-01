# Calendar App Architecture

Last updated: 2026-09-01

## 1. Architecture overview

```
Mobile App                    Web App
React Native / Expo           React + HeroUI React
HeroUI Native                       |
       \                            /
        \          HTTPS           /
         +-------------------------+
                    |
                    v
Cloudflare Workers API
       |
       +-- Better Auth
       |
       +-- Calendar API
       |
       +-- Notification API
       |
       +-- Billing entitlement API
       |
       v
Cloudflare D1

Additional services:
- Cloudflare R2: future attachments/images
- Cloudflare Queues: future asynchronous jobs
- Apple Push Notification Service / Firebase Cloud Messaging: push notifications
- App Store / Google Play: subscription / in-app purchase
- advertising SDK: monetization
```

## 2. Frontend strategy

Use a multi-app monorepo rather than forcing one UI implementation onto every platform.

Shared across mobile and web:
- domain models
- TypeScript types
- API client
- authentication contracts
- validation schemas
- TanStack Query keys/hooks where platform-neutral
- recurrence logic
- permissions/business rules
- date utilities

Platform-specific:
- screens/layout
- UI components
- navigation shell
- storage implementation
- advertising SDK
- billing implementation
- notifications

Reason:
HeroUI Native currently targets iOS/Android and is not recommended by HeroUI for web. The web app should use HeroUI React instead.

## 3. Mobile frontend

Recommended:
- React Native
- Expo
- TypeScript
- Expo Router
- HeroUI Native

State:
- TanStack Query for server state
- lightweight local state using React Context or Zustand only when necessary

Local persistence:
- Expo SecureStore: authentication/session secrets
- AsyncStorage: non-sensitive UI preferences

## 4. Web frontend

Web is a planned platform, although it does not need to ship in the first MVP.

Recommended direction:
- React
- TypeScript
- HeroUI React
- TanStack Query
- shared API/domain packages from the monorepo
- responsive layout for phone, tablet, and desktop browsers

Hosting:
- Cloudflare should remain the preferred hosting platform.
- Static assets can be served from Cloudflare.
- The application communicates with the same Workers API used by native clients.

Do not duplicate calendar business logic in the web app.

The web application should consume the same API contracts as mobile.

Authentication on web:
- cookie-based/session-based browser authentication where supported by the auth architecture
- Google
- email/password
- Apple where appropriate

Web-specific UX can take advantage of:
- larger month/week layouts
- keyboard shortcuts
- hover/context menus
- drag-and-drop event editing later

Expo Router itself supports web output, including static/server-oriented modes, but the current architecture intentionally avoids depending on HeroUI Native for the web UI.

## 5. Backend

Cloudflare Workers provides the API layer.

Recommended API framework:
- Hono

Reasons:
- small runtime footprint
- good Cloudflare Workers support
- TypeScript-first
- routing/middleware suitable for REST APIs

Initial API namespaces:

```
/api/auth/*
/api/users/*
/api/calendars/*
/api/events/*
/api/invitations/*
/api/notifications/*
/api/billing/*
```

## 6. Authentication

Recommended:
- Better Auth running on Cloudflare Workers
- D1 adapter/database
- Expo client integration
- Expo SecureStore

Initial providers:
- Google
- email/password

Session validation occurs on the backend for protected requests.

Do not store provider secrets or long-lived access tokens in AsyncStorage.

## 7. Database

Cloudflare D1 is the primary relational datastore.

Initial domain tables:

```
users
sessions
accounts

calendars
calendar_members
calendar_invitations

events
event_recurrences
event_labels
event_participants

notification_preferences
device_push_tokens

subscriptions
```

Later:
```
event_comments
memos
memo_items
attachments
audit_logs
```

## 8. Core relationships

```
User
  1 --- N CalendarMember N --- 1 Calendar

Calendar
  1 --- N Event

Calendar
  1 --- N EventLabel

Event
  N --- N User (participants)
```

Every event belongs to exactly one calendar.

Authorization must always verify calendar membership server-side.

## 9. API design

REST is recommended for the initial release.

Examples:

```
GET    /api/calendars
POST   /api/calendars
GET    /api/calendars/:calendarId
PATCH  /api/calendars/:calendarId
DELETE /api/calendars/:calendarId

GET    /api/calendars/:calendarId/events
POST   /api/calendars/:calendarId/events

GET    /api/events/:eventId
PATCH  /api/events/:eventId
DELETE /api/events/:eventId

POST   /api/calendars/:calendarId/invitations
POST   /api/invitations/:token/join
```

Event listing must accept a date range so the client does not download an entire calendar history.

Example:
```
GET /api/calendars/:id/events?from=2026-09-01&to=2026-10-31
```

## 10. Synchronization

MVP uses request-based synchronization:
- fetch visible date range
- invalidate/refetch after mutation
- refetch on application foreground

Push notifications tell clients that shared data changed.

Real-time WebSocket synchronization is not required for MVP.

Possible later upgrade:
- Durable Objects / WebSocket for real-time collaborative updates

## 11. Recurring events

Do not create unlimited future event rows.

Recommended structure:
- parent event
- recurrence rule
- exception/override records

The API expands occurrences only for the requested date range.

This avoids huge D1 tables for long-running recurring schedules.

## 12. Invitation model

Shared-calendar invitation:
- random single-purpose token
- expiration date
- calendar id
- inviter user id

Flow:
1. owner creates invitation
2. API returns deep link
3. receiver opens app
4. unauthenticated receiver signs in
5. user confirms join
6. calendar_members row is created

Never expose calendar membership solely based on knowing calendar ID.

## 13. Push notification architecture

The application registers native device push tokens.

```
Mobile
 -> register token
 -> Workers
 -> device_push_tokens

Event mutation
 -> Workers
 -> identify calendar members
 -> notification provider
 -> APNs / FCM
```

Push payload should contain identifiers, not sensitive event details when possible.

## 14. Billing

The native stores remain the source of truth for purchases.

Application backend stores entitlement state:
- platform
- product id
- expiration
- verified status

Initial entitlement:
- remove_ads

Subscription implementation library/service is still undecided.

Candidates should be evaluated before implementation.

## 15. Advertising

Advertising SDK is intentionally abstracted from calendar UI.

Create a frontend interface such as:

```
AdProvider
  canShowAds()
  BannerAd
  NativeAd
```

Paid entitlement disables rendering before requesting an ad.

## 16. Security requirements

- server-side authorization on every calendar/event mutation
- calendar membership checked for every calendar-scoped read
- secrets stored in Cloudflare secrets
- secure session/token storage on device
- invitation tokens are unguessable and expiring
- rate limit authentication and invitation endpoints
- account deletion deletes or anonymizes owned personal data according to policy

## 17. Cross-platform boundaries

Code sharing should follow this rule:

```
share behavior, not presentation
```

Good shared code:
- Event / Calendar domain types
- Zod or equivalent schemas
- REST client
- query hooks
- recurrence calculations
- authorization/role constants
- date range calculations
- feature flags
- entitlement rules

Usually platform-specific:
- HeroUI components
- modal implementations
- native tabs vs desktop navigation
- SecureStore vs browser storage/cookies
- push notification registration
- advertisements
- in-app purchases

Avoid imports from `apps/mobile` inside `apps/web` and vice versa.

Both applications should depend downward on shared packages.

## 18. Suggested repository structure

```
calendar-app/
  apps/
    mobile/
      app/
      components/
      features/
      lib/
    web/
      src/
        components/
        features/
        routes/
        lib/
  packages/
    api-client/
    api-types/
    domain/
    validation/
    shared/
  workers/
    api/
      src/
        routes/
        services/
        db/
        middleware/
  docs/
    product-spec.md
    architecture.md
    feature-roadmap.md
```

A monorepo is recommended because mobile, web, and API should share TypeScript schemas, API contracts, and domain logic while keeping their presentation layers independent.
