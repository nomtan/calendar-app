import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';

export type EventColor = 'blue' | 'pink' | 'green' | 'orange' | 'purple';
export type EventStatus = 'confirmed' | 'tentative' | 'undecided';
export type Recurrence = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
export type ActionType = 'none' | 'reservation' | 'payment' | 'preparation' | 'reply';

export type ChecklistItem = {
  id: string;
  text: string;
  done: boolean;
};

export type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  calendarId: string;
  time?: string;
  allDay: boolean;
  color: EventColor;
  label?: string;
  assigneeIds: string[];
  status: EventStatus;
  recurrence: Recurrence;
  actionType: ActionType;
  checklist: ChecklistItem[];
};

type EventInput = Omit<CalendarEvent, 'id'>;
type EventsContextValue = {
  events: CalendarEvent[];
  createEvent: (input: EventInput) => void;
  updateEvent: (id: string, input: EventInput) => void;
  deleteEvent: (id: string) => void;
};

const EventsContext = createContext<EventsContextValue | null>(null);
const pad = (value: number) => String(value).padStart(2, '0');
const dateForDay = (day: number) => {
  const now = new Date();
  return now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(day);
};

const base = {
  allDay: false,
  label: '',
  assigneeIds: [] as string[],
  status: 'confirmed' as EventStatus,
  recurrence: 'none' as Recurrence,
  actionType: 'none' as ActionType,
  checklist: [] as ChecklistItem[],
};

const initialEvents: CalendarEvent[] = [
  { ...base, id: '1', title: '歯医者', calendarId: 'family', date: dateForDay(3), time: '10:00', color: 'blue', assigneeIds: ['mock-user'], actionType: 'reservation' },
  { ...base, id: '2', title: 'ピアノレッスン', calendarId: 'family', date: dateForDay(4), time: '13:00', color: 'pink', assigneeIds: ['child-a'], recurrence: 'weekly' },
  { ...base, id: '3', title: '家族で買い物', calendarId: 'family', date: dateForDay(6), time: '16:00', color: 'green', assigneeIds: ['mock-user', 'partner'], status: 'tentative' },
  { ...base, id: '4', title: '学校説明会', calendarId: 'personal', date: dateForDay(10), time: '10:00', color: 'purple', label: '学校' },
  { ...base, id: '5', title: 'ランチ予約', calendarId: 'family', date: dateForDay(10), time: '12:30', color: 'orange', actionType: 'reservation' },
  { ...base, id: '6', title: '習い事', calendarId: 'family', date: dateForDay(18), time: '17:00', color: 'pink', recurrence: 'weekly' },
  { ...base, id: '7', title: '家族イベント', calendarId: 'family', date: dateForDay(25), allDay: true, color: 'green', checklist: [{ id: 'c1', text: '持ち物確認', done: false }] },
];

export function EventsProvider({ children }: PropsWithChildren) {
  const [events, setEvents] = useState(initialEvents);
  const value = useMemo<EventsContextValue>(() => ({
    events,
    createEvent: (input) => setEvents((current) => [...current, { ...input, id: String(Date.now()) }]),
    updateEvent: (id, input) => setEvents((current) => current.map((event) => event.id === id ? { ...input, id } : event)),
    deleteEvent: (id) => setEvents((current) => current.filter((event) => event.id !== id)),
  }), [events]);

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
}

export function useEvents() {
  const context = useContext(EventsContext);
  if (!context) throw new Error('useEvents must be used inside EventsProvider');
  return context;
}

export function occursOnDate(event: CalendarEvent, targetDate: string) {
  if (event.date === targetDate) return true;
  if (event.recurrence === 'none') return false;

  const start = new Date(event.date + 'T00:00:00');
  const target = new Date(targetDate + 'T00:00:00');
  if (target < start) return false;

  if (event.recurrence === 'daily') return true;
  if (event.recurrence === 'weekly') return start.getDay() === target.getDay();
  if (event.recurrence === 'monthly') return start.getDate() === target.getDate();
  return start.getMonth() === target.getMonth() && start.getDate() === target.getDate();
}
