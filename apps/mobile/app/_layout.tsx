import '../global.css';

import { Stack } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { EventsProvider } from '@/features/calendar/events-context';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HeroUINativeProvider>
        <EventsProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </EventsProvider>
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}
