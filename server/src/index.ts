import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import equipmentRoutes from './routes/equipment';
import requestRoutes from './routes/request';
import { notifyAdminOverdue, notifyStudentDueSoon } from './notifications';
import db from './db';

const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:8000',
    'http://localhost:3000',
    'https://club-frontend-xvfr.onrender.com',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use('/api/equipments', equipmentRoutes);
app.use('/api/requests', requestRoutes);

app.get('/api/me', (_req, res) => res.json({ id: 1, name: 'Demo User' }));

const port = process.env.PORT || 4000;
app.listen(port, async () => {
  console.log(`Server listening on port ${port}`);
  
  // Test database connection
  try {
    await db.query('SELECT NOW()');
    console.log('✓ Database connection successful');
  } catch (error) {
    console.error('✗ Database connection failed:', error);
    console.error('Make sure DATABASE_URL is set correctly');
    process.exit(1);
  }
  const runNotifications = async () => {
    await notifyAdminOverdue().catch((e) => console.error('Overdue notification failed', e));
    await notifyStudentDueSoon().catch((e) => console.error('Due soon notification failed', e));
  };

  await runNotifications();
  setInterval(runNotifications, 24 * 60 * 60 * 1000);
});
