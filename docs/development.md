# Development

Last updated: 2026-09-01

## Package manager

pnpm is the standard package manager for this repository.

## Initial mobile stack

- Expo SDK 57
- React Native 0.86
- Expo Router
- TypeScript
- HeroUI Native
- Uniwind / Tailwind CSS
- local in-memory mock data

## Start the mobile app

From repository root:

    pnpm install
    pnpm mobile

Or:

    cd apps/mobile
    pnpm start

Scan the Expo QR code with Expo Go.

## First implementation scope

Included:
- full-screen monthly calendar
- event names rendered directly inside each calendar day cell
- event name is one line and may be truncated
- create event
- edit event
- delete event
- five bottom tabs: Calendar / Today / Calendar list / Notifications / Menu
- local mock data only

Not included yet:
- authentication
- Cloudflare Workers / D1
- shared calendar synchronization
- push notifications
- billing / advertising

Backend integration should later replace the local data source without redesigning the screen components.
