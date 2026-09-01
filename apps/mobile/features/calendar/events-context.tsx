import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';

export type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  time?: string;
  color: 'blue' | 'pink' | 'green' | 'orange' | 'purple';
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

const initialEvents: CalendarEvent[] = [
  { id: '1', title: '歯医者', date: dateForDay(3), time: '10:00', color: 'blue' },
  { id: '2', title: 'ピアノレッスン', date: dateForDay(4), time: '13:00', color: 'pink' },
  { id: '3', title: '家族で買い物', date: dateForDay(6), time: '16:00', color: 'green' },
  { id: '4', title: '学校説明会', date: dateForDay(10), time: '10:00', color: 'purple' },
  { id: '5', title: 'ランチ予約', date: dateForDay(10), time: '12:30', color: 'orange' },
  { id: '6', title: '習い事', date: dateForDay(18), time: '17:00', color: 'pink' },
  { id: '7', title: '家族イベント', date: dateForDay(25), time: '11:00', color: 'green' },
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
