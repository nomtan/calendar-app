import { SafeAreaView } from 'react-native-safe-area-context';
import { MonthCalendar } from '@/features/calendar/month-calendar';

export default function CalendarScreen() {
  return <SafeAreaView className="flex-1 bg-background" edges={['top']}><MonthCalendar /></SafeAreaView>;
}
