import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const menuItems = ['アカウント設定', 'プラン', 'データ管理', 'ヘルプ・サポート', 'アプリについて'];
export default function MenuScreen() {
  return <SafeAreaView className="flex-1 bg-background px-5 pt-4" edges={['top']}><View className="mb-6 flex-row items-center"><View className="h-12 w-12 items-center justify-center rounded-full bg-accent-soft"><Text className="font-bold text-accent-soft-foreground">N</Text></View><View className="ml-3"><Text className="text-base font-semibold text-foreground">nomtan</Text><Text className="text-xs text-muted-foreground">Freeプラン</Text></View></View><View className="overflow-hidden rounded-2xl border border-border bg-surface">{menuItems.map((item, index) => <View key={item} className={index < menuItems.length - 1 ? 'flex-row items-center border-b border-border px-4 py-4' : 'flex-row items-center px-4 py-4'}><Text className="flex-1 text-base text-foreground">{item}</Text><Text className="text-muted-foreground">›</Text></View>)}</View></SafeAreaView>;
}
