type EmailAddress = {
  email: string;
  name?: string;
};

type EmailMessageBuilder = {
  to: string | EmailAddress | (string | EmailAddress)[];
  from: string | EmailAddress;
  subject: string;
  html?: string;
  text?: string;
};

type EmailSendResult = {
  messageId: string;
};

type SendEmailBinding = {
  send(message: EmailMessageBuilder): Promise<EmailSendResult>;
};

export type Env = {
  DB: D1Database;
  EMAIL: SendEmailBinding;
  EMAIL_FROM: string;
  BETTER_AUTH_SECRET: string;
  AUTH_BASE_URL: string;
  APP_ORIGIN: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  APPLE_CLIENT_ID?: string;
  APPLE_CLIENT_SECRET?: string;
};
