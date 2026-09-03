import { expo } from '@better-auth/expo';
import { betterAuth } from 'better-auth';

import {
  passwordResetEmail,
  queueTransactionalEmail,
  verificationEmail,
} from './email';
import type { Env } from './types';

type WaitUntil = (promise: Promise<unknown>) => void;

export function createAuth(env: Env, waitUntil?: WaitUntil) {
  return betterAuth({
    database: env.DB,
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.AUTH_BASE_URL,
    trustedOrigins: [
      'calendarapp://',
      'calendarapp://*',
      ...(env.APP_ORIGIN ? [env.APP_ORIGIN] : []),
    ],
    emailVerification: {
      sendOnSignUp: true,
      sendVerificationEmail: async ({ user, url }) => {
        queueTransactionalEmail(env, waitUntil, {
          to: user.email,
          ...verificationEmail(url),
        });
      },
    },
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      sendResetPassword: async ({ user, url }) => {
        queueTransactionalEmail(env, waitUntil, {
          to: user.email,
          ...passwordResetEmail(url),
        });
      },
    },
    socialProviders: {
      ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
        ? {
            google: {
              clientId: env.GOOGLE_CLIENT_ID,
              clientSecret: env.GOOGLE_CLIENT_SECRET,
            },
          }
        : {}),
      ...(env.APPLE_CLIENT_ID && env.APPLE_CLIENT_SECRET
        ? {
            apple: {
              clientId: env.APPLE_CLIENT_ID,
              clientSecret: env.APPLE_CLIENT_SECRET,
            },
          }
        : {}),
    },
    plugins: [expo()],
  });
}
