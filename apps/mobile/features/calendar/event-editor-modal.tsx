import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Button } from 'heroui-native';

import { useCalendars } from '@/features/calendars/calendars-context';
import {
  ActionType,
  CalendarEvent,
  ChecklistItem,
  EventStatus,
  Recurrence,
  useEvents,
} from '@/features/calendar/events-context';

type Props = { visible: boolean; date: string; event?: CalendarEvent | null; onClose: () => void };

const colors: CalendarEvent['color'][] = ['blue', 'pink', 'green', 'orange', 'purple'];
const colorHex: Record<CalendarEvent['color'], string> = {
  blue: '#4C9AFF',
  pink: '#F15A9D',
  green: '#4DBA78',
  orange: '#F5A623',
  purple: '#7C5CE5',
};
const recurrences: { value: Recurrence; label: string }[] = [
  { value: 'none', label: 'なし' },
  { value: 'daily', label: '毎日' },
  { value: 'weekly', label: '毎週' },
  { value: 'monthly', label: '毎月' },
  { value: 'yearly', label: '毎年' },
];
const statuses: { value: EventStatus; label: string }[] = [
  { value: 'confirmed', label: '確定' },
  { value: 'tentative', label: '仮予定' },
  { value: 'undecided', label: '未定' },
];
const actions: { value: ActionType; label: string }[] = [
  { value: 'none', label: 'なし' },
  { value: 'reservation', label: '予約' },
  { value: 'payment', label: '支払い' },
  { value: 'preparation', label: '準備' },
  { value: 'reply', label: '返信' },
];

export function EventEditorModal({ visible, date, event, onClose }: Props) {
  const { createEvent, updateEvent, deleteEvent } = useEvents();
  const { selectedCalendarId, selectedCalendar } = useCalendars();

  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState(date);
  const [time, setTime] = useState('');
  const [allDay, setAllDay] = useState(false);
  const [color, setColor] = useState<CalendarEvent['color']>('purple');
  const [label, setLabel] = useState('');
  const [status, setStatus] = useState<EventStatus>('confirmed');
  const [recurrence, setRecurrence] = useState<Recurrence>('none');
  const [actionType, setActionType] = useState<ActionType>('none');
  const [assigneeIds, setAssigneeIds] = useState<string[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newChecklistText, setNewChecklistText] = useState('');

  useEffect(() => {
    if (!visible) return;
    setTitle(event?.title ?? '');
    setEventDate(event?.date ?? date);
    setTime(event?.time ?? '');
    setAllDay(event?.allDay ?? false);
    setColor(event?.color ?? 'purple');
    setLabel(event?.label ?? '');
    setStatus(event?.status ?? 'confirmed');
    setRecurrence(event?.recurrence ?? 'none');
    setActionType(event?.actionType ?? 'none');
    setAssigneeIds(event?.assigneeIds ?? []);
    setChecklist(event?.checklist ?? []);
    setNewChecklistText('');
  }, [date, event, visible]);

  const toggleAssignee = (id: string) => {
    setAssigneeIds((current) =>
      current.includes(id)
        ? current.filter((memberId) => memberId !== id)
        : [...current, id],
    );
  };

  const addChecklistItem = () => {
    const text = newChecklistText.trim();
    if (!text) return;
    setChecklist((current) => [
      ...current,
      { id: 'check-' + Date.now(), text, done: false },
    ]);
    setNewChecklistText('');
  };

  const save = () => {
    if (!title.trim()) return;
    const input = {
      title: title.trim(),
      calendarId: event?.calendarId ?? selectedCalendarId,
      date: eventDate,
      time: allDay ? undefined : time.trim() || undefined,
      allDay,
      color,
      label: label.trim(),
      assigneeIds,
      status,
      recurrence,
      actionType,
      checklist,
    };

    if (event) updateEvent(event.id, input);
    else createEvent(input);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/25">
        <View className="max-h-[92%] rounded-t-[28px] bg-background px-5 pb-8 pt-4">
          <View className="mb-4 flex-row items-center justify-between">
            <Pressable onPress={onClose}>
              <Text className="text-base text-muted-foreground">キャンセル</Text>
            </Pressable>
            <Text className="text-lg font-semibold text-foreground">
              {event ? '予定を編集' : '新しい予定'}
            </Text>
            <View className="w-16" />
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text className="mb-1 text-xs text-muted-foreground">
              {selectedCalendar.emoji} {selectedCalendar.name}
            </Text>

            <Text className="mb-2 mt-3 text-sm font-medium text-foreground">タイトル</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="予定の名前"
              className="mb-4 rounded-2xl border border-border bg-surface px-4 py-3 text-base text-foreground"
            />

            <Text className="mb-2 text-sm font-medium text-foreground">日付</Text>
            <TextInput
              value={eventDate}
              onChangeText={setEventDate}
              placeholder="YYYY-MM-DD"
              className="mb-4 rounded-2xl border border-border bg-surface px-4 py-3 text-base text-foreground"
            />

            <Pressable
              onPress={() => setAllDay((current) => !current)}
              className="mb-4 flex-row items-center justify-between rounded-2xl bg-surface-secondary px-4 py-3"
            >
              <Text className="text-sm font-medium text-foreground">終日予定</Text>
              <Text className={allDay ? 'font-semibold text-accent' : 'text-muted-foreground'}>
                {allDay ? 'ON' : 'OFF'}
              </Text>
            </Pressable>

            {!allDay ? (
              <>
                <Text className="mb-2 text-sm font-medium text-foreground">時刻</Text>
                <TextInput
                  value={time}
                  onChangeText={setTime}
                  placeholder="例 10:00"
                  className="mb-4 rounded-2xl border border-border bg-surface px-4 py-3 text-base text-foreground"
                />
              </>
            ) : null}

            <Text className="mb-2 text-sm font-medium text-foreground">繰り返し</Text>
            <View className="mb-4 flex-row flex-wrap gap-2">
              {recurrences.map((item) => (
                <Pressable
                  key={item.value}
                  onPress={() => setRecurrence(item.value)}
                  className={recurrence === item.value ? 'rounded-full bg-accent px-3 py-2' : 'rounded-full bg-surface-secondary px-3 py-2'}
                >
                  <Text className={recurrence === item.value ? 'text-xs font-semibold text-white' : 'text-xs font-semibold text-foreground'}>{item.label}</Text>
                </Pressable>
              ))}
            </View>

            <Text className="mb-2 text-sm font-medium text-foreground">状態</Text>
            <View className="mb-4 flex-row gap-2">
              {statuses.map((item) => (
                <Pressable
                  key={item.value}
                  onPress={() => setStatus(item.value)}
                  className={status === item.value ? 'rounded-full bg-accent px-3 py-2' : 'rounded-full bg-surface-secondary px-3 py-2'}
                >
                  <Text className={status === item.value ? 'text-xs font-semibold text-white' : 'text-xs font-semibold text-foreground'}>{item.label}</Text>
                </Pressable>
              ))}
            </View>

            <Text className="mb-2 text-sm font-medium text-foreground">誰の予定</Text>
            <View className="mb-4 flex-row flex-wrap gap-2">
              {selectedCalendar.members.map((member) => {
                const active = assigneeIds.includes(member.id);
                return (
                  <Pressable
                    key={member.id}
                    onPress={() => toggleAssignee(member.id)}
                    className={active ? 'rounded-full bg-accent px-3 py-2' : 'rounded-full bg-surface-secondary px-3 py-2'}
                  >
                    <Text className={active ? 'text-xs font-semibold text-white' : 'text-xs font-semibold text-foreground'}>{member.name}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Text className="mb-2 text-sm font-medium text-foreground">ラベル</Text>
            <TextInput
              value={label}
              onChangeText={setLabel}
              placeholder="例: 学校 / 病院 / 仕事"
              className="mb-4 rounded-2xl border border-border bg-surface px-4 py-3 text-base text-foreground"
            />

            <Text className="mb-2 text-sm font-medium text-foreground">カラー</Text>
            <View className="mb-4 flex-row gap-3">
              {colors.map((item) => (
                <Pressable
                  key={item}
                  onPress={() => setColor(item)}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 17,
                    backgroundColor: colorHex[item],
                    borderWidth: color === item ? 3 : 0,
                    borderColor: '#27272A',
                  }}
                />
              ))}
            </View>

            <Text className="mb-2 text-sm font-medium text-foreground">対応が必要</Text>
            <View className="mb-4 flex-row flex-wrap gap-2">
              {actions.map((item) => (
                <Pressable
                  key={item.value}
                  onPress={() => setActionType(item.value)}
                  className={actionType === item.value ? 'rounded-full bg-accent px-3 py-2' : 'rounded-full bg-surface-secondary px-3 py-2'}
                >
                  <Text className={actionType === item.value ? 'text-xs font-semibold text-white' : 'text-xs font-semibold text-foreground'}>{item.label}</Text>
                </Pressable>
              ))}
            </View>

            <Text className="mb-2 text-sm font-medium text-foreground">準備リスト</Text>
            <View className="mb-2 flex-row gap-2">
              <TextInput
                value={newChecklistText}
                onChangeText={setNewChecklistText}
                placeholder="持ち物・準備"
                className="flex-1 rounded-2xl border border-border bg-surface px-4 py-3 text-base text-foreground"
              />
              <Button size="sm" onPress={addChecklistItem} isDisabled={!newChecklistText.trim()}>
                追加
              </Button>
            </View>

            <View className="mb-6 gap-2">
              {checklist.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() =>
                    setChecklist((current) =>
                      current.map((currentItem) =>
                        currentItem.id === item.id
                          ? { ...currentItem, done: !currentItem.done }
                          : currentItem,
                      ),
                    )
                  }
                  className="flex-row items-center rounded-xl bg-surface-secondary px-3 py-3"
                >
                  <Text className="mr-2 text-base">{item.done ? '☑' : '☐'}</Text>
                  <Text className={item.done ? 'flex-1 text-sm text-muted-foreground line-through' : 'flex-1 text-sm text-foreground'}>
                    {item.text}
                  </Text>
                  <Pressable
                    onPress={() => setChecklist((current) => current.filter((currentItem) => currentItem.id !== item.id))}
                    className="px-2 py-1"
                  >
                    <Text className="text-xs text-danger">削除</Text>
                  </Pressable>
                </Pressable>
              ))}
            </View>

            <Button onPress={save} isDisabled={!title.trim()}>保存</Button>

            {event ? (
              <Button
                className="mt-3"
                variant="danger-soft"
                onPress={() => {
                  deleteEvent(event.id);
                  onClose();
                }}
              >
                削除
              </Button>
            ) : null}

            <View className="h-4" />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
