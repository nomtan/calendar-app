import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/features/auth/auth-context';

const menuItems = ['アカウント設定', 'プラン', 'データ管理', 'ヘルプ・サポート', 'アプリについて'];
export default function MenuScreen() {
  const { user, signOut, mode } = useAuth();
  return <SafeAreaView className="flex-1 bg-background px-5 pt-4" edges={['top']}>
    <View className="mb-6 flex-row items-center"><View className="h-12 w-12 items-center justify-center rounded-full bg-accent-soft"><Text className="font-bold text-accent-soft-foreground">{user?.name?.slice(0,1).toUpperCase() || 'U'}</Text></View><View className="ml-3"><Text className="text-base font-semibold text-foreground">{user?.name || 'ユーザー'}</Text><Text className="text-xs text-muted-foreground">{user?.email || ''}</Text></View></View>
    <View className="mb-4 rounded-xl bg-surface-secondary px-3 py-2"><Text className="text-xs text-muted-foreground">認証モード: {mode}</Text></View>
    <View className="overflow-hidden rounded-2xl border border-border bg-surface">{menuItems.map((item, index) => <View key={item} className={index < menuItems.length - 1 ? 'flex-row items-center border-b border-border px-4 py-4' : 'flex-row items-center px-4 py-4'}><Text className="flex-1 text-base text-foreground">{item}</Text><Text className="text-muted-foreground">›</Text></View>)}</View>
    <Pressable className="mt-6 items-center rounded-2xl border border-danger/30 px-4 py-4" onPress={async () => { await signOut(); router.replace('/(auth)/sign-in'); }}><Text className="font-semibold text-danger">ログアウト</Text></Pressable>
  </SafeAreaView>;
}
