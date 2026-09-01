import { useState } from 'react';
import { Modal, Pressable, Text, TextInput, View } from 'react-native';
import { Button } from 'heroui-native';

import { useCalendars } from '@/features/calendars/calendars-context';

type Props = { visible: boolean; onClose: () => void };

const colors = ['#4DBA78', '#4C9AFF', '#F15A9D', '#F5A623', '#7C5CE5'];
const emojis = ['🏠', '👤', '👨‍👩‍👧‍👦', '🎒', '💼'];

export function CalendarEditorModal({ visible, onClose }: Props) {
  const { createCalendar } = useCalendars();
  const [name, setName] = useState('');
  const [color, setColor] = useState(colors[0]);
  const [emoji, setEmoji] = useState(emojis[0]);

  const submit = () => {
    if (!name.trim()) return;
    createCalendar({ name: name.trim(), color, emoji });
    setName('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/25">
        <View className="rounded-t-[28px] bg-background px-5 pb-10 pt-4">
          <View className="mb-5 flex-row items-center justify-between">
            <Pressable onPress={onClose}><Text className="text-base text-muted-foreground">キャンセル</Text></Pressable>
            <Text className="text-lg font-semibold text-foreground">カレンダーを作成</Text>
            <View className="w-16" />
          </View>
          <TextInput value={name} onChangeText={setName} placeholder="カレンダー名" className="mb-5 rounded-2xl border border-border bg-surface px-4 py-3 text-base text-foreground" />
          <Text className="mb-2 text-sm font-medium text-foreground">アイコン</Text>
          <View className="mb-5 flex-row gap-3">{emojis.map((item) => <Pressable key={item} onPress={() => setEmoji(item)} className={emoji === item ? 'h-11 w-11 items-center justify-center rounded-xl border-2 border-accent' : 'h-11 w-11 items-center justify-center rounded-xl border border-border'}><Text className="text-xl">{item}</Text></Pressable>)}</View>
          <Text className="mb-2 text-sm font-medium text-foreground">カラー</Text>
          <View className="mb-6 flex-row gap-3">{colors.map((item) => <Pressable key={item} onPress={() => setColor(item)} style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: item, borderWidth: color === item ? 3 : 0, borderColor: '#27272A' }} />)}</View>
          <Button onPress={submit} isDisabled={!name.trim()}>作成</Button>
        </View>
      </View>
    </Modal>
  );
}
