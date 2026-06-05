import { Router } from 'express';
import { listEquipments, statsByMonth, updateEquipment, createEquipment, deleteEquipment, topBorrowedByMonth, borrowHistoryByEquipment } from '../models/equipment';

const router = Router();

router.get('/', async (_req, res) => {
  const rows = await listEquipments();
  res.json(rows);
});

router.get('/stats', async (_req, res) => {
  const rows = await statsByMonth();
  res.json(rows);
});

router.get('/top-borrowed', async (req, res) => {
  const month = (req.query.month as string) || new Date().toISOString().slice(0, 7);
  const rows = await topBorrowedByMonth(month);
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { name, quantity } = req.body;
  const row = await createEquipment({ name, quantity });
  res.json(row);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, quantity } = req.body;
  const row = await updateEquipment(Number(id), { name, quantity });
  res.json(row);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await deleteEquipment(Number(id));
  res.json({ ok: true });
});

router.get('/:id/borrow-history', async (req, res) => {
  const rows = await borrowHistoryByEquipment(Number(req.params.id));
  res.json(rows);
});

export default router;