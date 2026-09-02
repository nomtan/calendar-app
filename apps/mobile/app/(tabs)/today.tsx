import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCalendars } from '@/features/calendars/calendars-context';
import { occursOnDate, useEvents } from '@/features/calendar/events-context';

const pad = (value: number) => String(value).padStart(2, '0');

const actionLabel = {
  none: '',
  reservation: '予約が必要',
  payment: '支払いが必要',
  preparation: '準備が必要',
  reply: '返信が必要',
} as const;

export default function TodayScreen() {
  const { events } = useEvents();
  const { selectedCalendar, selectedCalendarId } = useCalendars();
  const now = new Date();
  const today = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate());
  const todayEvents = events.filter(
    (event) => event.calendarId === selectedCalendarId && occursOnDate(event, today),
  );

  return (
    <SafeAreaView className="flex-1 bg-background px-5 pt-4" edges={['top']}>
      <Text className="text-2xl font-bold text-foreground">今日</Text>
      <Text className="mt-1 text-sm text-muted-foreground">
        {selectedCalendar.emoji} {selectedCalendar.name} · {now.getMonth() + 1}月{now.getDate()}日の予定
      </Text>

      <View className="mt-6 gap-3">
        {todayEvents.length ? (
          todayEvents.map((event) => (
            <View key={event.id} className="rounded-2xl border border-border bg-surface p-4">
              <View className="flex-row items-center gap-2">
                <Text className="text-xs text-muted-foreground">{event.allDay ? '終日' : event.time ?? '時刻なし'}</Text>
                {event.status !== 'confirmed' ? (
                  <Text className="rounded-full bg-surface-secondary px-2 py-1 text-[10px] font-semibold text-foreground">
                    {event.status === 'tentative' ? '仮予定' : '未定'}
                  </Text>
                ) : null}
              </View>
              <Text className="mt-1 text-base font-semibold text-foreground">{event.title}</Text>
              {event.label ? <Text className="mt-1 text-xs text-muted-foreground">#{event.label}</Text> : null}
              {event.actionType !== 'none' ? (
                <Text className="mt-2 text-xs font-semibold text-accent">{actionLabel[event.actionType]}</Text>
              ) : null}
              {event.checklist.length ? (
                <Text className="mt-1 text-xs text-muted-foreground">
                  準備 {event.checklist.filter((item) => item.done).length}/{event.checklist.length}
                </Text>
              ) : null}
            </View>
          ))
        ) : (
          <View className="rounded-2xl bg-surface-secondary p-5">
            <Text className="text-base font-medium text-foreground">今日の予定はありません</Text>
            <Text className="mt-1 text-sm text-muted-foreground">カレンダーから予定を追加できます。</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
