import { useState } from 'react';
import { Link, router } from 'expo-router';
import { Text, TextInput } from 'react-native';
import { Button } from 'heroui-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/features/auth/auth-context';

export default function SignUpScreen() {
  const { signUpWithEmail } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const submit = async () => {
    const message = await signUpWithEmail(name, email, password);
    if (message) setError(message);
    else router.replace('/(tabs)');
  };
  return (
    <SafeAreaView className="flex-1 bg-background px-6 pt-10">
      <Text className="text-2xl font-bold text-foreground">アカウント作成</Text>
      <TextInput value={name} onChangeText={setName} placeholder="表示名" className="mb-3 mt-8 rounded-2xl border border-border bg-surface px-4 py-3 text-base text-foreground" />
      <TextInput autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} placeholder="メールアドレス" className="mb-3 rounded-2xl border border-border bg-surface px-4 py-3 text-base text-foreground" />
      <TextInput secureTextEntry value={password} onChangeText={setPassword} placeholder="パスワード（8文字以上）" className="mb-3 rounded-2xl border border-border bg-surface px-4 py-3 text-base text-foreground" />
      {error ? <Text className="mb-3 text-sm text-danger">{error}</Text> : null}
      <Button isDisabled={!name.trim() || !email.trim() || password.length < 8} onPress={submit}>登録</Button>
      <Link href="/(auth)/sign-in" className="mt-6 text-center text-sm text-accent">ログインへ戻る</Link>
    </SafeAreaView>
  );
}
