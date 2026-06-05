import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendMail(opts: { to: string; subject: string; text: string }) {
  console.log('[sendMail] Sending to:', opts.to, '| Subject:', opts.subject);
  try {
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
    });
    console.log('[sendMail] Result:', JSON.stringify(result));
    return result;
  } catch (e) {
    console.error('[sendMail] Error:', e);
    throw e;
  }
}