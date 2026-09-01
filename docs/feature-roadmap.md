# Feature Roadmap & Differentiation

Last updated: 2026-09-01

## 1. Strategy

Do not compete by copying every mature calendar feature.

The product should first deliver a lightweight shared calendar and then add a small number of features that solve everyday coordination problems better than a generic calendar.

## 2. TimeTree-inspired features worth adopting

### Strongly recommended
- shared calendars
- multiple calendars
- calendar-specific members
- event labels/colors
- notifications when shared events change
- recurring events
- event memo
- event comments
- memo/checklist
- event search

### Useful later
- weekly view
- external calendar import
- calendar-specific profile
- images/attachments
- widgets

### Low priority for this product
- albums
- stickers
- large public/shared calendars
- full calendar chat
- advanced social functionality

## 3. Differentiation candidates

### A. "Who is this for?" event ownership

Each event can quickly assign people:
- me
- partner
- child A
- child B
- everyone

Monthly view can display a small avatar/initial.

Why useful:
Family calendars often become hard to scan when many people have events.

Complexity:
Low.

Recommendation:
Very high.

---

### B. Unconfirmed schedule

Allow an event to be marked:
- confirmed
- tentative
- undecided

Tentative events are visually different.

Examples:
- maybe visit grandparents
- candidate restaurant reservation
- school schedule waiting for confirmation

Complexity:
Low.

Recommendation:
Very high.

---

### C. "Need action" event

An event can have a lightweight action:
- reservation needed
- payment needed
- preparation needed
- reply needed

The home screen can show upcoming unresolved actions.

This avoids turning the application into a full task manager while solving a common calendar problem.

Complexity:
Low-medium.

Recommendation:
Very high.

---

### D. Household dashboard

A compact screen for:
- today
- tomorrow
- upcoming unresolved actions
- next family event

This is not another calendar view.
It answers "What does our family need to know right now?"

Complexity:
Medium.

Recommendation:
High.

---

### E. Shared availability

Members can quickly mark days as:
- available
- unavailable
- maybe

Useful for:
- family outings
- couples
- small groups

Complexity:
Medium.

Recommendation:
High after MVP.

---

### F. Event preparation checklist

Each event can optionally have a mini checklist.

Example:
"School excursion"
- lunch
- water bottle
- hat
- submit form

Different from a global task manager because the checklist lives directly on the event.

Complexity:
Medium.

Recommendation:
High.

---

### G. Event templates

Save common events:
- school
- daycare pickup
- garbage day
- hospital
- lesson

Creating a schedule becomes one tap plus date/time adjustment.

Complexity:
Low.

Recommendation:
High.

---

### H. Calendar activity / event history

Provide a lightweight activity feed showing:
- who created an event
- who edited an event
- what important fields changed
- who deleted an event
- when each action occurred

Two entry points:
- calendar-wide activity feed
- per-event history

The backend should start recording these logs before the UI feature ships, so historical data is available when the feature is enabled.

Complexity:
Medium.

Recommendation:
High after MVP.

## 4. Recommended differentiation set for V1

Avoid adding all candidates at once.

Best combination:

1. event ownership/person assignment
2. tentative/confirmed status
3. event-linked preparation checklist
4. lightweight "need action" status

Together these position the app as:

> A simple shared calendar that makes it obvious who has what, what is confirmed, and what still needs to be done.

They are useful without requiring AI or expensive backend processing.

## 5. MVP milestones

### Milestone 1 - personal calendar
- project setup
- auth
- month view
- event CRUD
- recurring events
- labels

### Milestone 2 - sharing
- multiple calendars
- invitations
- members
- shared event synchronization
- push notifications

### Milestone 3 - differentiation
- person assignment
- tentative status
- event preparation checklist
- need-action status

### Milestone 4 - monetization
- ads
- remove-ads entitlement
- store purchase validation

### Milestone 5 - web application
- responsive web shell
- shared authentication
- month calendar
- event CRUD
- shared calendars and invitations
- reuse domain/API/query packages
- desktop-oriented calendar UX

### Milestone 6 - collaboration history
- calendar activity feed
- per-event history
- created / updated / deleted entries
- important field change summaries
- pagination and retention rules

### Milestone 7 - polish
- search
- memo/checklist
- event comments
- performance
- accessibility
- App Store / Play Store release preparation

## 6. Features intentionally postponed

- AI schedule creation
- OCR event scan
- albums
- arbitrary file storage
- full chat
- external calendar synchronization
- real-time websocket collaboration

These can be reconsidered after usage data exists.


## 7. Web rollout principle

Web does not have to block the native MVP.

However, every backend feature introduced before the web release must satisfy:
- no native-only assumptions in database records
- no native-only authentication requirement
- REST/API contract available to browser clients
- canonical HTTPS links for invitations and shared resources
- entitlements represented on the backend rather than only inside App Store / Play Store clients

This keeps the cost of adding the web client primarily in the presentation layer.


## 8. Shared calendar implementation status

The mock implementation now includes:
- multiple calendars
- calendar creation
- selected calendar state
- event-to-calendar relation
- member lists and roles
- member removal
- invitation link/code flow

This is intentionally implemented before D1 so the UI/domain boundaries can be validated first.

See `docs/shared-calendars.md`.
