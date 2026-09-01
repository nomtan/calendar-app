import { useState } from 'react';
import { Link, router } from 'expo-router';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Button } from 'heroui-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/features/auth/auth-context';

export default function SignInScreen() {
  const { signInWithEmail, signInWithSocial, mode } = useAuth();
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);
  const done = (message: string | null) => {
    if (message) setError(message);
    else router.replace('/(tabs)');
  };

  return (
    <SafeAreaView className="flex-1 bg-background px-6 pt-10">
      <Text className="text-3xl font-bold text-foreground">Calendar</Text>
      <Text className="mt-2 text-sm text-muted-foreground">予定をシンプルに共有するカレンダー</Text>
      {mode === 'mock' ? <View className="mt-6 rounded-2xl bg-accent-soft p-3"><Text className="text-xs text-accent-soft-foreground">開発中はモック認証です。Cloudflare接続後にremoteへ切り替えます。</Text></View> : null}
      <View className="mt-8 gap-3">
        <Button variant="secondary" onPress={() => signInWithSocial('google').then(done)}>Googleで続ける</Button>
        <Button variant="secondary" onPress={() => signInWithSocial('apple').then(done)}>Appleで続ける</Button>
      </View>
      <View className="my-7 flex-row items-center gap-3"><View className="h-px flex-1 bg-border"/><Text className="text-xs text-muted-foreground">または</Text><View className="h-px flex-1 bg-border"/></View>
      <TextInput autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} placeholder="メールアドレス" className="mb-3 rounded-2xl border border-border bg-surface px-4 py-3 text-base text-foreground" />
      <TextInput secureTextEntry value={password} onChangeText={setPassword} placeholder="パスワード" className="mb-3 rounded-2xl border border-border bg-surface px-4 py-3 text-base text-foreground" />
      {error ? <Text className="mb-3 text-sm text-danger">{error}</Text> : null}
      <Button onPress={() => signInWithEmail(email, password).then(done)}>ログイン</Button>
      <Pressable className="mt-6 items-center"><Link href="/(auth)/sign-up" className="text-sm text-accent">アカウントを作成</Link></Pressable>
    </SafeAreaView>
  );
}
