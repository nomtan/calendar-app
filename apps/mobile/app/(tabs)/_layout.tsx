import { Tabs } from 'expo-router';
import { Text } from 'react-native';

const icon = (symbol: string) =>
  function TabIcon({ color }: { color: string }) {
    return <Text style={{ color, fontSize: 18 }}>{symbol}</Text>;
  };

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6D4AE3',
        tabBarInactiveTintColor: '#8A8A98',
        tabBarStyle: { height: 72, paddingTop: 8, paddingBottom: 10, borderTopColor: '#ECECF2', backgroundColor: '#FFFFFF' },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'カレンダー', tabBarIcon: icon('▦') }} />
      <Tabs.Screen name="today" options={{ title: '今日', tabBarIcon: icon('◉') }} />
      <Tabs.Screen name="calendars" options={{ title: 'カレンダー一覧', tabBarIcon: icon('□') }} />
      <Tabs.Screen name="notifications" options={{ title: '通知', tabBarIcon: icon('♧') }} />
      <Tabs.Screen name="menu" options={{ title: 'メニュー', tabBarIcon: icon('•••') }} />
    </Tabs>
  );
}
