# Calendar App Product Specification

Last updated: 2026-09-01

## 1. Product concept

TimeTree-like simple shared calendar application for iOS / Android.

The application should focus on:
- fast event creation
- easy calendar sharing
- clear monthly schedule overview
- useful features for small groups such as families and couples
- free usage supported by advertising
- optional paid plan to remove advertising

The goal is not to reproduce every TimeTree feature.

## 2. Target users

Primary:
- families
- couples
- small groups
- users who want a simple personal/shared calendar

Initial product design should optimize for approximately 1-10 people per shared calendar rather than large organizations.

## 3. Platforms

- iOS
- Android

Technology:
- React Native
- Expo
- HeroUI Native

Web support is not part of the initial MVP.

## 4. Authentication

Required:
- Google account login
- email address + password login
- logout
- persistent login session
- account deletion

Candidate implementation:
- Better Auth
- Cloudflare Workers
- Cloudflare D1
- Expo SecureStore for secure native session persistence

Future candidates:
- Apple Sign In
- password reset
- email verification

Apple Sign In should be evaluated before App Store release depending on Apple review requirements.

## 5. Calendar model

A user can:
- create multiple calendars
- own a personal calendar
- create a shared calendar
- join a shared calendar by invitation
- leave a shared calendar

A calendar contains:
- name
- icon or emoji
- theme color
- members
- events

Visibility is isolated per calendar.
Only members of a shared calendar can view its events.

## 6. Event model

Required fields:
- title
- calendar
- start date/time
- end date/time
- all-day flag

Optional fields:
- description/memo
- location
- label/color
- participants

Operations:
- create
- update
- delete
- duplicate

MVP recurrence:
- none
- daily
- weekly
- monthly
- yearly

Recurring-event edit scope:
- this event only
- this and future events
- all events

## 7. Calendar views

MVP:
- monthly view
- day/event list
- today button

Later:
- weekly view
- agenda view

Monthly view is the primary application screen.

## 8. Shared calendar

MVP:
- create calendar
- invite member
- join by invite link/code
- member list
- remove member (owner/admin)
- leave calendar
- event synchronization
- event change notification

Roles:
- owner
- member

Future:
- admin role
- read-only member

## 9. Notifications

MVP:
- event reminder
- shared event created notification
- shared event changed notification
- shared event deleted notification

Per-calendar notification settings should be supported.

Future:
- digest notifications
- quiet hours
- custom notification rules

## 10. Labels

Events can have a color label.

MVP:
- default labels
- custom label name
- custom label color
- filter by label

Typical use:
- father
- mother
- child
- school
- work
- private

## 11. Memo / checklist

Useful but not mandatory for the first technical milestone.

Recommended MVP+ feature:
- calendar-scoped memo
- checklist
- reorder items
- convert memo into event

Use cases:
- shopping list
- things to do
- places to visit
- undecided schedule

## 12. Event comments

Recommended after the core calendar is stable.

Each event may have:
- comments
- comment author
- created timestamp

Images and attachments are postponed.

## 13. Search

MVP+:
- event title search
- date range
- label filter
- calendar filter

## 14. Monetization

### Free plan
- all core calendar features
- shared calendars
- ads

### Paid plan
Initial paid benefit:
- remove advertising

Possible future paid benefits:
- advanced themes
- additional calendar customization
- advanced reminders
- larger history/search window
- calendar widgets

Core sharing functionality should not be paywalled initially.

## 15. Advertising

Potential placements:
- bottom banner on calendar screen
- native ad in event list

Do not show:
- ads in event creation/edit screens
- full-screen ads during normal calendar operations

Avoid aggressive interstitial advertising because schedule entry is a high-frequency interaction.

## 16. MVP feature priority

### P0 - required
- onboarding
- Google authentication
- email/password authentication
- account management
- month calendar
- event CRUD
- all-day event
- recurring event
- multiple calendars
- shared calendar
- invitation
- event labels
- push notifications
- basic settings
- ads
- remove-ads purchase

### P1 - highly useful
- memo/checklist
- event comments
- event search
- calendar-specific notification settings
- event duplication
- user/calendar profile icon
- simple calendar customization

### P2 - later
- weekly calendar
- external calendar import
- attachments/photos
- widgets
- advanced permissions
- export/backup

### Out of initial scope
- public calendars
- hundreds of members per calendar
- full social/chat system
- album
- stickers
- AI features
- web application
- enterprise/groupware features

## 17. Product principles

1. Calendar opens immediately.
2. Creating an event should require as few taps as possible.
3. Shared events must be visually understandable at a glance.
4. Ads must not interrupt event entry.
5. The app remains useful without a subscription.
6. Shared/private data boundaries must be explicit.
