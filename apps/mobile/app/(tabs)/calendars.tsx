import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { Button } from 'heroui-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CalendarEditorModal } from '@/features/calendars/calendar-editor-modal';
import { useCalendars } from '@/features/calendars/calendars-context';

export default function CalendarsScreen() {
  const { calendars, selectedCalendarId, selectCalendar } = useCalendars();
  const [editorOpen, setEditorOpen] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-background px-5 pt-4" edges={['top']}>
      <View className="flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-foreground">カレンダー一覧</Text>
        <Button size="sm" onPress={() => setEditorOpen(true)}>作成</Button>
      </View>

      <View className="mt-6 gap-3">
        {calendars.map((calendar) => {
          const selected = calendar.id === selectedCalendarId;
          return (
            <Pressable
              key={calendar.id}
              onPress={() => selectCalendar(calendar.id)}
              className={selected ? "rounded-2xl border-2 border-accent bg-surface p-4" : "rounded-2xl border border-border bg-surface p-4"}
            >
              <View className="flex-row items-center">
                <View style={{ width: 14, height: 14, borderRadius: 4, backgroundColor: calendar.color }} />
                <Text className="ml-3 text-lg">{calendar.emoji}</Text>
                <View className="ml-3 flex-1">
                  <Text className="text-base font-semibold text-foreground">{calendar.name}</Text>
                  <Text className="mt-0.5 text-xs text-muted-foreground">{calendar.members.length}人</Text>
                </View>
                <Pressable onPress={() => router.push({ pathname: '/calendar/[id]', params: { id: calendar.id } })} className="px-2 py-2">
                  <Text className="text-xl text-muted-foreground">›</Text>
                </Pressable>
              </View>
              {selected ? <Text className="mt-3 text-xs font-semibold text-accent">現在表示中</Text> : null}
            </Pressable>
          );
        })}
      </View>

      <Button className="mt-6" variant="secondary" onPress={() => router.push('/invite')}>招待コードで参加</Button>
      <CalendarEditorModal visible={editorOpen} onClose={() => setEditorOpen(false)} />
    </SafeAreaView>
  );
}
