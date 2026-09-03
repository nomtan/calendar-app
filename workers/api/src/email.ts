import type { Env } from './types';

type WaitUntil = (promise: Promise<unknown>) => void;

type SendTransactionalEmailOptions = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function queueTransactionalEmail(
  env: Env,
  waitUntil: WaitUntil | undefined,
  options: SendTransactionalEmailOptions,
) {
  const task = env.EMAIL.send({
    to: options.to,
    from: {
      email: env.EMAIL_FROM,
      name: 'Calendar App',
    },
    subject: options.subject,
    text: options.text,
    html: options.html,
  }).catch((error: unknown) => {
    const emailError =
      error && typeof error === 'object'
        ? {
            code: 'code' in error ? String(error.code) : undefined,
            message: 'message' in error ? String(error.message) : 'Unknown email error',
          }
        : { message: String(error) };

    console.error('Transactional email sending failed', emailError);
  });

  if (waitUntil) {
    waitUntil(task);
    return;
  }

  void task;
}

export function verificationEmail(url: string) {
  const safeUrl = escapeHtml(url);

  return {
    subject: 'メールアドレスを確認してください',
    text: [
      'Calendar Appへの登録ありがとうございます。',
      '',
      '以下のURLを開いてメールアドレスの確認を完了してください。',
      url,
      '',
      'このメールに心当たりがない場合は、そのまま破棄してください。',
    ].join('\n'),
    html: [
      '<p>Calendar Appへの登録ありがとうございます。</p>',
      '<p>以下のリンクからメールアドレスの確認を完了してください。</p>',
      `<p><a href="${safeUrl}">メールアドレスを確認する</a></p>`,
      '<p>このメールに心当たりがない場合は、そのまま破棄してください。</p>',
    ].join(''),
  };
}

export function passwordResetEmail(url: string) {
  const safeUrl = escapeHtml(url);

  return {
    subject: 'パスワードを再設定してください',
    text: [
      'Calendar Appのパスワード再設定リクエストを受け付けました。',
      '',
      '以下のURLを開いて新しいパスワードを設定してください。',
      url,
      '',
      'このメールに心当たりがない場合は、そのまま破棄してください。',
    ].join('\n'),
    html: [
      '<p>Calendar Appのパスワード再設定リクエストを受け付けました。</p>',
      '<p>以下のリンクから新しいパスワードを設定してください。</p>',
      `<p><a href="${safeUrl}">パスワードを再設定する</a></p>`,
      '<p>このメールに心当たりがない場合は、そのまま破棄してください。</p>',
    ].join(''),
  };
}
