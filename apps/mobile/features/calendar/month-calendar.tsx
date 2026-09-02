import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
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
    <View className="flex-1 bg-background">
      <View className="flex-row items-center justify-between px-4 pb-3 pt-3">
        <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-surface-secondary"><Text className="text-xl text-foreground">≡</Text></Pressable>
        <View className="flex-row items-center gap-2">
          <Pressable onPress={() => setMonth(new Date(year, monthIndex - 1, 1))} className="px-2 py-2"><Text className="text-lg text-muted-foreground">‹</Text></Pressable>
          <Pressable onPress={() => { const now = new Date(); setMonth(new Date(now.getFullYear(), now.getMonth(), 1)); }}><View className="items-center"><Text className="text-lg font-semibold text-foreground">{year}年{monthIndex + 1}月</Text><Text className="text-[10px] text-muted-foreground">{selectedCalendar.emoji} {selectedCalendar.name}</Text></View></Pressable>
          <Pressable onPress={() => setMonth(new Date(year, monthIndex + 1, 1))} className="px-2 py-2"><Text className="text-lg text-muted-foreground">›</Text></Pressable>
        </View>
        <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-surface-secondary" onPress={() => { const now = new Date(); openNew(now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate())); }}><Text className="text-2xl text-accent">＋</Text></Pressable>
      </View>

      <View className="flex-row border-b border-border">
        {weekdays.map((label, index) => (
          <View key={label} className="flex-1 items-center py-2">
            <Text className={index === 0 ? 'text-xs font-semibold text-danger' : index === 6 ? 'text-xs font-semibold text-accent' : 'text-xs font-semibold text-muted-foreground'}>{label}</Text>
          </View>
        ))}
      </View>

      <View className="flex-1">
        {Array.from({ length: 6 }, (_, week) => (
          <View key={week} className="flex-1 flex-row">
            {cells.slice(week * 7, week * 7 + 7).map((day, column) => {
              const key = day ? dateKey(day) : 'blank-' + week + '-' + column;
              const dayEvents = day ? events.filter((event) => event.calendarId === selectedCalendarId && occursOnDate(event, dateKey(day))) : [];
              return (
                <Pressable key={key} disabled={!day} onPress={() => day && openNew(dateKey(day))} className="flex-1 border-b border-r border-border/70 bg-background px-1 pb-1 pt-1">
                  {day ? (
                    <>
                      <Text className={column === 0 ? 'mb-1 text-xs font-medium text-danger' : column === 6 ? 'mb-1 text-xs font-medium text-accent' : 'mb-1 text-xs font-medium text-foreground'}>{day}</Text>
                      <View className="gap-0.5">
                        {dayEvents.slice(0, 4).map((event) => {
                          const style = eventStyle[event.color];
                          return (
                            <Pressable key={event.id} onPress={() => setEditor({ visible: true, date: event.date, event })} style={{ backgroundColor: style.backgroundColor, borderRadius: 4, paddingHorizontal: 3, paddingVertical: 2 }}>
                              <Text numberOfLines={1} ellipsizeMode="tail" style={{ color: style.color, fontSize: 9, fontWeight: '600' }}>{event.status === 'tentative' ? '△ ' : event.status === 'undecided' ? '? ' : ''}{event.title}</Text>
                            </Pressable>
                          );
                        })}
                        {dayEvents.length > 4 ? <Text className="text-[9px] text-muted-foreground">+{dayEvents.length - 4}</Text> : null}
                      </View>
                    </>
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>

      <View className="absolute bottom-4 right-4">
        <Button isIconOnly accessibilityLabel="予定を追加" className="h-14 w-14 rounded-full" onPress={() => { const now = new Date(); openNew(now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate())); }}><Text className="text-2xl text-white">＋</Text></Button>
      </View>

      <EventEditorModal visible={editor.visible} date={editor.date} event={editor.event} onClose={() => setEditor((current) => ({ ...current, visible: false, event: null }))} />
    </View>
  );
}
