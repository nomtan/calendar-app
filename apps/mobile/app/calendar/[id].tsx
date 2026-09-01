import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, Share, Text, View } from 'react-native';
import { Button } from 'heroui-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCalendars } from '@/features/calendars/calendars-context';

export default function CalendarDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const { calendars, createInviteLink, removeMember } = useCalendars();
  const calendar = calendars.find((item) => item.id === params.id);

  if (!calendar) {
    return <SafeAreaView className="flex-1 items-center justify-center bg-background"><Text>カレンダーが見つかりません</Text></SafeAreaView>;
  }

  return (
    <SafeAreaView className="flex-1 bg-background px-5 pt-3">
      <View className="mb-6 flex-row items-center">
        <Pressable onPress={() => router.back()} className="mr-3 px-2 py-2"><Text className="text-2xl text-foreground">‹</Text></Pressable>
        <Text className="text-2xl font-bold text-foreground">{calendar.emoji} {calendar.name}</Text>
      </View>

      <View className="rounded-2xl border border-border bg-surface p-4">
        <Text className="text-sm font-semibold text-foreground">メンバー</Text>
        <View className="mt-3 gap-3">
          {calendar.members.map((member) => (
            <View key={member.id} className="flex-row items-center">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-surface-secondary"><Text className="font-semibold text-foreground">{member.name.slice(0,1)}</Text></View>
              <View className="ml-3 flex-1"><Text className="text-sm font-medium text-foreground">{member.name}</Text><Text className="text-xs text-muted-foreground">{member.email} · {member.role === 'owner' ? 'オーナー' : 'メンバー'}</Text></View>
              {member.role !== 'owner' ? <Pressable onPress={() => removeMember(calendar.id, member.id)}><Text className="text-xs font-semibold text-danger">削除</Text></Pressable> : null}
            </View>
          ))}
        </View>
      </View>

      <Button className="mt-5" onPress={async () => { const link = createInviteLink(calendar.id); await Share.share({ message: link }); }}>招待リンクを共有</Button>

      <View className="mt-5 rounded-2xl bg-surface-secondary p-4">
        <Text className="text-xs text-muted-foreground">招待リンク例</Text>
        <Text selectable className="mt-1 text-sm text-foreground">{createInviteLink(calendar.id)}</Text>
      </View>
    </SafeAreaView>
  );
}
