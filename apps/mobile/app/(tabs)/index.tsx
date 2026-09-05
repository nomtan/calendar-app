import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MonthCalendar } from '@/features/calendar/month-calendar';

export default function CalendarScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <MonthCalendar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
