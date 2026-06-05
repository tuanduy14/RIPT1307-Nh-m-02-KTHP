import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendMail(opts: { to: string; subject: string; text: string }) {
  return resend.emails.send({
    from: 'onboarding@resend.dev',
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
  });
}