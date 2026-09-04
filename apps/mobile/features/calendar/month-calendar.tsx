import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from 'heroui-native';

import { useCalendars } from '@/features/calendars/calendars-context';
import { CalendarEvent, occursOnDate, useEvents } from '@/features/calendar/events-context';
import { EventEditorModal } from '@/features/calendar/event-editor-modal';

const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
const pad = (value: number) => String(value).padStart(2, '0');
const eventStyle: Record<CalendarEvent['color'], { backgroundColor: string; color: string }> = {
  blue: { backgroundColor: '#E9F3FF', color: '#2F73C8' },
  pink: { backgroundColor: '#FDEAF2', color: '#C83C79' },
  green: { backgroundColor: '#EAF8EF', color: '#31875A' },
  orange: { backgroundColor: '#FFF3DF', color: '#B66E0A' },
  purple: { backgroundColor: '#F0ECFF', color: '#6745C7' },
};

export function MonthCalendar() {
  const { events } = useEvents();
  const { selectedCalendar, selectedCalendarId } = useCalendars();
  const initial = useMemo(() => new Date(), []);
  const [month, setMonth] = useState(new Date(initial.getFullYear(), initial.getMonth(), 1));
  const [editor, setEditor] = useState<{ visible: boolean; date: string; event?: CalendarEvent | null }>({ visible: false, date: '', event: null });

  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstWeekday = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells = Array.from({ length: 42 }, (_, index) => {
    const day = index - firstWeekday + 1;
    return day >= 1 && day <= daysInMonth ? day : null;
  });
  const dateKey = (day: number) => year + '-' + pad(monthIndex + 1) + '-' + pad(day);
  const openNew = (date: string) => setEditor({ visible: true, date, event: null });

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Pressable style={styles.headerIconButton}>
          <Text style={styles.headerIconText}>≡</Text>
        </Pressable>

        <View style={styles.monthNavigation}>
          <Pressable onPress={() => setMonth(new Date(year, monthIndex - 1, 1))} style={styles.monthArrowButton}>
            <Text style={styles.monthArrow}>‹</Text>
          </Pressable>

          <Pressable onPress={() => { const now = new Date(); setMonth(new Date(now.getFullYear(), now.getMonth(), 1)); }}>
            <View style={styles.monthTitleWrap}>
              <Text style={styles.monthTitle}>{year}年{monthIndex + 1}月</Text>
              <Text style={styles.calendarName}>{selectedCalendar.emoji} {selectedCalendar.name}</Text>
            </View>
          </Pressable>

          <Pressable onPress={() => setMonth(new Date(year, monthIndex + 1, 1))} style={styles.monthArrowButton}>
            <Text style={styles.monthArrow}>›</Text>
          </Pressable>
        </View>

        <Pressable
          style={styles.headerIconButton}
          onPress={() => {
            const now = new Date();
            openNew(now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate()));
          }}
        >
          <Text style={styles.addText}>＋</Text>
        </Pressable>
      </View>

      <View style={styles.weekdayRow}>
        {weekdays.map((label, index) => (
          <View key={label} style={styles.weekdayCell}>
            <Text style={[styles.weekdayText, index === 0 && styles.sundayText, index === 6 && styles.saturdayText]}>{label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.calendarGrid}>
        {Array.from({ length: 6 }, (_, week) => (
          <View key={week} style={styles.weekRow}>
            {cells.slice(week * 7, week * 7 + 7).map((day, column) => {
              const key = day ? dateKey(day) : 'blank-' + week + '-' + column;
              const dayEvents = day
                ? events.filter((event) => event.calendarId === selectedCalendarId && occursOnDate(event, dateKey(day)))
                : [];

              return (
                <Pressable
                  key={key}
                  disabled={!day}
                  onPress={() => day && openNew(dateKey(day))}
                  style={styles.dayCell}
                >
                  {day ? (
                    <>
                      <Text style={[styles.dayNumber, column === 0 && styles.sundayText, column === 6 && styles.saturdayText]}>{day}</Text>
                      <View style={styles.eventList}>
                        {dayEvents.slice(0, 4).map((event) => {
                          const style = eventStyle[event.color];
                          return (
                            <Pressable
                              key={event.id}
                              onPress={() => setEditor({ visible: true, date: event.date, event })}
                              style={[styles.eventChip, { backgroundColor: style.backgroundColor }]}
                            >
                              <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.eventText, { color: style.color }]}>
                                {event.status === 'tentative' ? '△ ' : event.status === 'undecided' ? '? ' : ''}{event.title}
                              </Text>
                            </Pressable>
                          );
                        })}
                        {dayEvents.length > 4 ? <Text style={styles.moreEvents}>+{dayEvents.length - 4}</Text> : null}
                      </View>
                    </>
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>

      <View style={styles.floatingButton}>
        <Button
          isIconOnly
          accessibilityLabel="予定を追加"
          className="h-14 w-14 rounded-full"
          onPress={() => {
            const now = new Date();
            openNew(now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate()));
          }}
        >
          <Text style={styles.floatingButtonText}>＋</Text>
        </Button>
      </View>

      <EventEditorModal
        visible={editor.visible}
        date={editor.date}
        event={editor.event}
        onClose={() => setEditor((current) => ({ ...current, visible: false, event: null }))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F7',
  },
  headerIconText: {
    fontSize: 20,
    color: '#202124',
  },
  addText: {
    fontSize: 26,
    lineHeight: 28,
    color: '#6D4AE3',
  },
  monthNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthArrowButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  monthArrow: {
    fontSize: 22,
    color: '#8A8A98',
  },
  monthTitleWrap: {
    minWidth: 124,
    alignItems: 'center',
  },
  monthTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    color: '#202124',
  },
  calendarName: {
    marginTop: 1,
    fontSize: 10,
    lineHeight: 14,
    color: '#8A8A98',
  },
  weekdayRow: {
    height: 34,
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E7E7EC',
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekdayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#777784',
  },
  calendarGrid: {
    flex: 1,
    minHeight: 1,
  },
  weekRow: {
    flex: 1,
    minHeight: 1,
    flexDirection: 'row',
  },
  dayCell: {
    flex: 1,
    minWidth: 0,
    minHeight: 1,
    paddingHorizontal: 4,
    paddingTop: 5,
    paddingBottom: 4,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#E7E7EC',
    backgroundColor: '#FFFFFF',
  },
  dayNumber: {
    marginBottom: 4,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    color: '#202124',
  },
  sundayText: {
    color: '#D84A62',
  },
  saturdayText: {
    color: '#5B73D8',
  },
  eventList: {
    gap: 2,
  },
  eventChip: {
    minHeight: 17,
    borderRadius: 4,
    justifyContent: 'center',
    paddingHorizontal: 3,
    paddingVertical: 1,
  },
  eventText: {
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '600',
  },
  moreEvents: {
    fontSize: 9,
    lineHeight: 12,
    color: '#8A8A98',
  },
  floatingButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  floatingButtonText: {
    fontSize: 24,
    lineHeight: 26,
    color: '#FFFFFF',
  },
});
