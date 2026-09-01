import { Redirect } from 'expo-router';

import { useAuth } from '@/features/auth/auth-context';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  return <Redirect href={isAuthenticated ? '/(tabs)' : '/(auth)/sign-in'} />;
}
