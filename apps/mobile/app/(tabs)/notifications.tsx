import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const items = ['パートナーが「歯医者」の時間を変更しました', '「学校説明会」は明日の10:00です', '家族カレンダーに新しい予定が追加されました'];
export default function NotificationsScreen() {
  return <SafeAreaView className="flex-1 bg-background px-5 pt-4" edges={['top']}><Text className="text-2xl font-bold text-foreground">通知</Text><View className="mt-6 gap-3">{items.map((item, index) => <View key={item} className="rounded-2xl border border-border bg-surface p-4"><Text className="text-sm font-medium text-foreground">{item}</Text><Text className="mt-2 text-xs text-muted-foreground">{index + 1}時間前</Text></View>)}</View></SafeAreaView>;
}
