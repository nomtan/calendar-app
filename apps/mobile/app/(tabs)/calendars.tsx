import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const calendars = [['家族カレンダー', '#42B883', '4人'], ['自分の予定', '#4C9AFF', '自分のみ'], ['子どもの予定', '#F15A9D', '3人']];
export default function CalendarsScreen() {
  return <SafeAreaView className="flex-1 bg-background px-5 pt-4" edges={['top']}><Text className="text-2xl font-bold text-foreground">カレンダー一覧</Text><View className="mt-6 gap-3">{calendars.map(([name, color, members]) => <View key={name} className="flex-row items-center rounded-2xl border border-border bg-surface p-4"><View style={{ width: 14, height: 14, borderRadius: 4, backgroundColor: color }} /><View className="ml-3 flex-1"><Text className="text-base font-semibold text-foreground">{name}</Text><Text className="mt-0.5 text-xs text-muted-foreground">{members}</Text></View><Text className="text-muted-foreground">›</Text></View>)}</View></SafeAreaView>;
}
