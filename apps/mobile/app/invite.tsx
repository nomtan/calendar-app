import { useState } from 'react';
import { router } from 'expo-router';
import { Text, TextInput } from 'react-native';
import { Button } from 'heroui-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCalendars } from '@/features/calendars/calendars-context';

export default function InviteScreen() {
  const { joinByInviteCode } = useCalendars();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const join = () => {
    const id = joinByInviteCode(code);
    if (!id) {
      setError('招待コードを確認してください');
      return;
    }
    router.replace('/(tabs)/calendars');
  };

  return (
    <SafeAreaView className="flex-1 bg-background px-6 pt-10">
      <Text className="text-2xl font-bold text-foreground">カレンダーに参加</Text>
      <Text className="mt-2 text-sm text-muted-foreground">招待リンクまたはコードを入力してください。</Text>
      <TextInput value={code} onChangeText={setCode} placeholder="family-demo-token" className="mb-3 mt-8 rounded-2xl border border-border bg-surface px-4 py-3 text-base text-foreground" />
      {error ? <Text className="mb-3 text-sm text-danger">{error}</Text> : null}
      <Button onPress={join} isDisabled={!code.trim()}>参加する</Button>
    </SafeAreaView>
  );
}
