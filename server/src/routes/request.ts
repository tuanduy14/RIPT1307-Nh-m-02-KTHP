import { Router } from 'express';
import db from '../db';
import { adjust } from '../models/equipment';
import sendMail from '../mailer';

const router = Router();

router.post('/', async (req, res) => {
  const { equipmentId, amount, dateRange } = req.body;
  // minimal insert
  const result = await db.query('INSERT INTO requests (equipment_id, amount, status, created_at) VALUES ($1,$2,$3,now()) RETURNING id', [equipmentId, amount, 'pending']);
  res.json({ id: result.rows[0].id });
});

router.get('/mine', async (_req, res) => {
  const result = await db.query('SELECT r.id, r.amount, r.status, e.name as equipmentName, r.created_at FROM requests r JOIN equipments e ON e.id = r.equipment_id ORDER BY r.created_at DESC');
  res.json(result.rows.map((r: any) => ({ id: r.id, amount: r.amount, status: r.status, equipmentName: r.equipmentname || r.equipmentname })));
});

router.get('/', async (_req, res) => {
  const result = await db.query('SELECT r.id, r.amount, r.status, u.name as userName, e.name as equipmentName FROM requests r JOIN equipments e ON e.id = r.equipment_id LEFT JOIN users u ON u.id = r.user_id ORDER BY r.created_at DESC');
  res.json(result.rows);
});

router.post('/:id/approve', async (req, res) => {
  const id = Number(req.params.id);
  const r = await db.query('SELECT * FROM requests WHERE id=$1', [id]);
  if (!r.rows.length) return res.status(404).end();
  const reqRow = r.rows[0];
  await db.query('UPDATE requests SET status=$1 WHERE id=$2', ['approved', id]);
  // adjust equipment stock
  await adjust(reqRow.equipment_id, -reqRow.amount);
  // send email (async)
  sendMail({ to: 'user@example.com', subject: 'Yêu cầu đã được duyệt', text: 'Yêu cầu mượn của bạn đã được duyệt.' }).catch(() => {});
  res.json({ ok: true });
});

export default router;
