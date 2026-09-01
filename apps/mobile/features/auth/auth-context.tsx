import { PropsWithChildren, createContext, useContext, useMemo, useState } from 'react';

import { authClient } from '@/lib/auth-client';

type AuthUser = { id: string; name: string; email: string };
type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  mode: 'mock' | 'remote';
  signInWithEmail: (email: string, password: string) => Promise<string | null>;
  signUpWithEmail: (name: string, email: string, password: string) => Promise<string | null>;
  signInWithSocial: (provider: 'google' | 'apple') => Promise<string | null>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const mode = process.env.EXPO_PUBLIC_AUTH_MODE === 'remote' ? 'remote' : 'mock';

export function AuthProvider({ children }: PropsWithChildren) {
  const session = authClient.useSession();
  const [mockUser, setMockUser] = useState<AuthUser | null>(null);
  const remoteUser = session.data?.user ? {
    id: session.data.user.id,
    name: session.data.user.name ?? '',
    email: session.data.user.email,
  } : null;
  const user = mode === 'mock' ? mockUser : remoteUser;

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated: Boolean(user),
    isLoading: mode === 'remote' ? session.isPending : false,
    mode,
    signInWithEmail: async (email, password) => {
      if (mode === 'mock') {
        setMockUser({ id: 'mock-user', name: 'Demo User', email });
        return null;
      }
      const result = await authClient.signIn.email({ email, password });
      return result.error?.message ?? null;
    },
    signUpWithEmail: async (name, email, password) => {
      if (mode === 'mock') {
        setMockUser({ id: 'mock-user', name, email });
        return null;
      }
      const result = await authClient.signUp.email({ name, email, password });
      return result.error?.message ?? null;
    },
    signInWithSocial: async (provider) => {
      if (mode === 'mock') {
        setMockUser({ id: 'mock-social-user', name: provider === 'google' ? 'Google User' : 'Apple User', email: provider + '@example.com' });
        return null;
      }
      const result = await authClient.signIn.social({ provider, callbackURL: '/' });
      return result.error?.message ?? null;
    },
    signOut: async () => {
      if (mode === 'mock') setMockUser(null);
      else await authClient.signOut();
    },
  }), [session.data?.user, session.isPending, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
