# Shared Calendars

Last updated: 2026-09-01

## Scope

This feature introduces the product structure needed for multiple and shared calendars before Cloudflare/D1 is connected.

Implemented in mock mode:
- multiple calendars
- selected/current calendar
- calendar creation
- member list
- owner/member roles
- member removal by owner
- invitation link generation
- joining by invitation code/link
- calendar-scoped event display

## Domain model

Calendar:
- id
- name
- color
- emoji/icon
- owner user id
- members

Calendar member:
- user id
- display name
- email
- role

Initial roles:
- owner
- member

Later:
- admin
- read-only member

Event:
- each event belongs to exactly one calendar via calendarId

## UX

Calendar tab:
- shows all calendars
- highlights the currently selected calendar
- allows creating a calendar
- opens calendar detail/member management
- allows joining via invitation

Month calendar:
- renders only events belonging to the selected calendar
- shows the selected calendar name under the current month

## Invitation design

Canonical links remain web-first:

    https://calendar.example.com/invite/:token

The mock implementation creates deterministic demo links only.
Real invitation tokens must later be generated server-side.

Production requirements:
- cryptographically random token
- expiration
- calendar id
- inviter id
- one-time or revocable semantics
- membership authorization on join

## Future D1 mapping

Application tables:

    calendars
    calendar_members
    calendar_invitations
    events

Relations:

    calendars.id -> calendar_members.calendar_id
    calendars.id -> calendar_invitations.calendar_id
    calendars.id -> events.calendar_id

Authorization rule:
Every calendar-scoped request must validate that the authenticated user is a current calendar member.

## Backend transition

The mobile context is temporary mock storage.

When Workers/D1 is connected:
- replace context mutations with API calls
- keep the same CalendarSummary / CalendarMember / calendarId concepts
- use TanStack Query for server state
- preserve selected calendar as local UI state
