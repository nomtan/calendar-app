import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEvents } from '@/features/calendar/events-context';

const pad = (value: number) => String(value).padStart(2, '0');
export default function TodayScreen() {
  const { events } = useEvents();
  const now = new Date();
  const today = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate());
  const todayEvents = events.filter((event) => event.date === today);
  return (
    <SafeAreaView className="flex-1 bg-background px-5 pt-4" edges={['top']}>
      <Text className="text-2xl font-bold text-foreground">今日</Text>
      <Text className="mt-1 text-sm text-muted-foreground">{now.getMonth() + 1}月{now.getDate()}日の予定</Text>
      <View className="mt-6 gap-3">
        {todayEvents.length ? todayEvents.map((event) => <View key={event.id} className="rounded-2xl border border-border bg-surface p-4"><Text className="text-xs text-muted-foreground">{event.time ?? '終日'}</Text><Text className="mt-1 text-base font-semibold text-foreground">{event.title}</Text></View>) : <View className="rounded-2xl bg-surface-secondary p-5"><Text className="text-base font-medium text-foreground">今日の予定はありません</Text><Text className="mt-1 text-sm text-muted-foreground">カレンダーから予定を追加できます。</Text></View>}
      </View>
    </SafeAreaView>
  );
}
