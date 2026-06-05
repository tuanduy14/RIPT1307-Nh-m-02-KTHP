import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import equipmentRoutes from './routes/equipment';
import requestRoutes from './routes/request';
import authRoutes from './routes/auth';
import {
  notifyAdminOverdue,
  notifyStudentDueSoon,
  notifyStudentOneDayBefore,
  notifyDueToday,
} from './notifications';
import sendMail from './mailer';
import db from './db';

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/equipments', equipmentRoutes);
app.use('/api/requests', requestRoutes);

app.get('/api/me', (_req, res) => res.json({ id: 1, name: 'Demo User' }));

app.get('/api/test-mail', async (_req, res) => {
  try {
    await sendMail({
      to: 'duy15101996@gmail.com',
      subject: 'Test mail',
      text: 'Mail hoạt động!',
    });
    res.json({ ok: true });
  } catch (e: any) {
    res.json({ error: e.message });
  }
});

const port = process.env.PORT || 4000;

app.listen(port, async () => {
  console.log(`Server listening on port ${port}`);

  try {
    await db.query('SELECT NOW()');
    console.log('✓ Database connection successful');
  } catch (error) {
    console.error('✗ Database connection failed:', error);
    process.exit(1);
  }

  const runDailyNotifications = async () => {
    console.log('[Notifications] Running daily jobs at', new Date().toISOString());
    await notifyStudentDueSoon().catch((e) => console.error('[Notifications] due_soon:', e));
    await notifyStudentOneDayBefore().catch((e) => console.error('[Notifications] due_day_before:', e));
    await notifyDueToday().catch((e) => console.error('[Notifications] due_today:', e));
    await notifyAdminOverdue().catch((e) => console.error('[Notifications] overdue:', e));
  };

  await runDailyNotifications();

  scheduleDaily(7, 0, runDailyNotifications);
});

function scheduleDaily(hour: number, minute: number, callback: () => Promise<void>) {
  const now = new Date();
  const next = new Date(now);
  next.setHours(hour, minute, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);

  const ms = next.getTime() - now.getTime();
  console.log(
    `[Notifications] Next run at ${next.toLocaleString('vi-VN')} ` +
    `(in ${Math.round(ms / 60000)} min)`,
  );

  setTimeout(() => {
    callback();
    setInterval(callback, 24 * 60 * 60 * 1000);
  }, ms);
}