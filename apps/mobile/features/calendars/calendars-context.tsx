import { PropsWithChildren, createContext, useContext, useMemo, useState } from 'react';

export type CalendarRole = 'owner' | 'member';

export type CalendarMember = {
  id: string;
  name: string;
  email: string;
  role: CalendarRole;
};

export type CalendarSummary = {
  id: string;
  name: string;
  color: string;
  emoji: string;
  ownerUserId: string;
  members: CalendarMember[];
};

type CalendarInput = Pick<CalendarSummary, 'name' | 'color' | 'emoji'>;

type CalendarsContextValue = {
  calendars: CalendarSummary[];
  selectedCalendarId: string;
  selectedCalendar: CalendarSummary;
  selectCalendar: (id: string) => void;
  createCalendar: (input: CalendarInput) => string;
  renameCalendar: (id: string, name: string) => void;
  removeMember: (calendarId: string, memberId: string) => void;
  createInviteLink: (calendarId: string) => string;
  joinByInviteCode: (code: string) => string | null;
};

const currentUser: CalendarMember = {
  id: 'mock-user',
  name: 'Demo User',
  email: 'demo@example.com',
  role: 'owner',
};

const initialCalendars: CalendarSummary[] = [
  {
    id: 'family',
    name: '家族カレンダー',
    color: '#4DBA78',
    emoji: '🏠',
    ownerUserId: currentUser.id,
    members: [
      currentUser,
      { id: 'partner', name: 'パートナー', email: 'partner@example.com', role: 'member' },
      { id: 'child-a', name: '子どもA', email: 'child@example.com', role: 'member' },
    ],
  },
  {
    id: 'personal',
    name: '自分の予定',
    color: '#4C9AFF',
    emoji: '👤',
    ownerUserId: currentUser.id,
    members: [currentUser],
  },
];

const CalendarsContext = createContext<CalendarsContextValue | null>(null);

export function CalendarsProvider({ children }: PropsWithChildren) {
  const [calendars, setCalendars] = useState(initialCalendars);
  const [selectedCalendarId, setSelectedCalendarId] = useState(initialCalendars[0].id);

  const selectedCalendar =
    calendars.find((calendar) => calendar.id === selectedCalendarId) ?? calendars[0];

  const value = useMemo<CalendarsContextValue>(() => ({
    calendars,
    selectedCalendarId,
    selectedCalendar,
    selectCalendar: setSelectedCalendarId,
    createCalendar: (input) => {
      const id = 'calendar-' + Date.now();
      setCalendars((current) => [
        ...current,
        {
          ...input,
          id,
          ownerUserId: currentUser.id,
          members: [currentUser],
        },
      ]);
      setSelectedCalendarId(id);
      return id;
    },
    renameCalendar: (id, name) =>
      setCalendars((current) =>
        current.map((calendar) => calendar.id === id ? { ...calendar, name } : calendar),
      ),
    removeMember: (calendarId, memberId) =>
      setCalendars((current) =>
        current.map((calendar) =>
          calendar.id === calendarId
            ? { ...calendar, members: calendar.members.filter((member) => member.id !== memberId) }
            : calendar,
        ),
      ),
    createInviteLink: (calendarId) =>
      'https://calendar.example.com/invite/' + calendarId + '-demo-token',
    joinByInviteCode: (code) => {
      const normalized = code.trim().toLowerCase();
      if (!normalized) return null;
      const found = calendars.find((calendar) => normalized.includes(calendar.id));
      if (found) {
        setSelectedCalendarId(found.id);
        return found.id;
      }
      return null;
    },
  }), [calendars, selectedCalendar, selectedCalendarId]);

  return <CalendarsContext.Provider value={value}>{children}</CalendarsContext.Provider>;
}

export function useCalendars() {
  const context = useContext(CalendarsContext);
  if (!context) throw new Error('useCalendars must be used inside CalendarsProvider');
  return context;
}
