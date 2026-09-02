import '../global.css';

import { Stack } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AuthProvider } from '@/features/auth/auth-context';
import { CalendarsProvider } from '@/features/calendars/calendars-context';
import { EventsProvider } from '@/features/calendar/events-context';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HeroUINativeProvider>
        <AuthProvider>
          <CalendarsProvider>
            <EventsProvider>
              <Stack screenOptions={{ headerShown: false }} />
            </EventsProvider>
          </CalendarsProvider>
        </AuthProvider>
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}
