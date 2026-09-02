# Event Model

Last updated: 2026-09-03

## Current event fields

```
id
calendarId
title
date
time
allDay
color
label
assigneeIds[]
status
recurrence
actionType
checklist[]
```

## Status

- confirmed
- tentative
- undecided

## Recurrence

Current mock rules:
- none
- daily
- weekly
- monthly
- yearly

The current client expands recurrence for display only.

Production backend design should use:
- base event
- recurrence rule
- occurrence exception/override records

Do not materialize unlimited future occurrences.

## Person assignment

`assigneeIds` references members of the event's calendar.

Multiple people can be assigned to one event.

Examples:
- parent
- partner
- child
- everyone via multiple member IDs

## Action-needed state

Lightweight values:
- none
- reservation
- payment
- preparation
- reply

This is intentionally not a full task-management system.

## Preparation checklist

Checklist items belong directly to an event.

Each item:
- id
- text
- done

Production persistence may use a separate event_checklist_items table or structured event payload depending on query/audit requirements.

## D1 candidates

```
events
event_recurrences
event_recurrence_exceptions
event_assignees
event_checklist_items
event_activity_logs
```

Labels may remain event fields initially or later move to calendar-scoped reusable labels.

## Activity logging

When the backend is introduced, changes to these fields should produce activity entries where meaningful:
- date/time/allDay
- recurrence
- assignees
- status
- actionType
- checklist
- deletion
