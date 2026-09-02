import { useEffect, useState } from 'react';
import { Modal, Pressable, Text, TextInput, View } from 'react-native';
import { Button } from 'heroui-native';

import { useCalendars } from '@/features/calendars/calendars-context';
import { CalendarEvent, useEvents } from '@/features/calendar/events-context';

type Props = { visible: boolean; date: string; event?: CalendarEvent | null; onClose: () => void };
const colors: CalendarEvent['color'][] = ['blue', 'pink', 'green', 'orange', 'purple'];
const colorHex: Record<CalendarEvent['color'], string> = { blue: '#4C9AFF', pink: '#F15A9D', green: '#4DBA78', orange: '#F5A623', purple: '#7C5CE5' };

export function EventEditorModal({ visible, date, event, onClose }: Props) {
  const { createEvent, updateEvent, deleteEvent } = useEvents();
  const { selectedCalendarId } = useCalendars();
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState(date);
  const [time, setTime] = useState('');
  const [color, setColor] = useState<CalendarEvent['color']>('purple');

  useEffect(() => {
    if (!visible) return;
    setTitle(event?.title ?? '');
    setEventDate(event?.date ?? date);
    setTime(event?.time ?? '');
    setColor(event?.color ?? 'purple');
  }, [date, event, visible]);

  const save = () => {
    if (!title.trim()) return;
    const input = { title: title.trim(), calendarId: event?.calendarId ?? selectedCalendarId, date: eventDate, time: time.trim() || undefined, color };
    if (event) updateEvent(event.id, input); else createEvent(input);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/25">
        <View className="rounded-t-[28px] bg-background px-5 pb-10 pt-4">
          <View className="mb-5 flex-row items-center justify-between">
            <Pressable onPress={onClose}><Text className="text-base text-muted-foreground">キャンセル</Text></Pressable>
            <Text className="text-lg font-semibold text-foreground">{event ? '予定を編集' : '新しい予定'}</Text>
            <View className="w-16" />
          </View>
          <Text className="mb-2 text-sm font-medium text-foreground">タイトル</Text>
          <TextInput value={title} onChangeText={setTitle} placeholder="予定の名前" className="mb-4 rounded-2xl border border-border bg-surface px-4 py-3 text-base text-foreground" />
          <Text className="mb-2 text-sm font-medium text-foreground">日付</Text>
          <TextInput value={eventDate} onChangeText={setEventDate} placeholder="YYYY-MM-DD" className="mb-4 rounded-2xl border border-border bg-surface px-4 py-3 text-base text-foreground" />
          <Text className="mb-2 text-sm font-medium text-foreground">時刻</Text>
          <TextInput value={time} onChangeText={setTime} placeholder="例 10:00" className="mb-5 rounded-2xl border border-border bg-surface px-4 py-3 text-base text-foreground" />
          <Text className="mb-2 text-sm font-medium text-foreground">カラー</Text>
          <View className="mb-6 flex-row gap-3">
            {colors.map((item) => <Pressable key={item} onPress={() => setColor(item)} style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: colorHex[item], borderWidth: color === item ? 3 : 0, borderColor: '#27272A' }} />)}
          </View>
          <Button onPress={save} isDisabled={!title.trim()}>保存</Button>
          {event ? <Button className="mt-3" variant="danger-soft" onPress={() => { deleteEvent(event.id); onClose(); }}>削除</Button> : null}
        </View>
      </View>
    </Modal>
  );
}
