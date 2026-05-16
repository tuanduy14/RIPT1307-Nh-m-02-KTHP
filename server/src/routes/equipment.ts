import { Router } from 'express';
import { listEquipments, statsByMonth } from '../models/equipment';

const router = Router();

router.get('/', async (_req, res) => {
  const rows = await listEquipments();
  res.json(rows);
});

router.get('/stats', async (_req, res) => {
  const rows = await statsByMonth();
  res.json(rows);
});

export default router;
