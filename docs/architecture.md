# Calendar App Architecture

Last updated: 2026-09-01

## 1. Architecture overview

```
React Native / Expo
       |
       | HTTPS
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

## 2. Mobile frontend

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

## 3. Backend

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

## 4. Authentication

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

## 5. Database

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

## 6. Core relationships

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

## 7. API design

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

## 8. Synchronization

MVP uses request-based synchronization:
- fetch visible date range
- invalidate/refetch after mutation
- refetch on application foreground

Push notifications tell clients that shared data changed.

Real-time WebSocket synchronization is not required for MVP.

Possible later upgrade:
- Durable Objects / WebSocket for real-time collaborative updates

## 9. Recurring events

Do not create unlimited future event rows.

Recommended structure:
- parent event
- recurrence rule
- exception/override records

The API expands occurrences only for the requested date range.

This avoids huge D1 tables for long-running recurring schedules.

## 10. Invitation model

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

## 11. Push notification architecture

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

## 12. Billing

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

## 13. Advertising

Advertising SDK is intentionally abstracted from calendar UI.

Create a frontend interface such as:

```
AdProvider
  canShowAds()
  BannerAd
  NativeAd
```

Paid entitlement disables rendering before requesting an ad.

## 14. Security requirements

- server-side authorization on every calendar/event mutation
- calendar membership checked for every calendar-scoped read
- secrets stored in Cloudflare secrets
- secure session/token storage on device
- invitation tokens are unguessable and expiring
- rate limit authentication and invitation endpoints
- account deletion deletes or anonymizes owned personal data according to policy

## 15. Suggested repository structure

```
calendar-app/
  apps/
    mobile/
      app/
      components/
      features/
      lib/
  packages/
    api-types/
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

A monorepo is recommended because mobile/API can share TypeScript schemas and domain types.
