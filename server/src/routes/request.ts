import { Router } from 'express';
import db from '../db';
import { adjust } from '../models/equipment';
import { notifyAdminNewRequest, notifyStudentApproved } from '../notifications';

const router = Router();

router.post('/', async (req, res) => {
  const { equipmentId, amount, dateRange, userId: bodyUserId } = req.body;
  const [fromDate, toDate] = dateRange || [];
  const userId = bodyUserId || 1; // Dùng userId từ client (sau khi login)

  const result = await db.query(
    'INSERT INTO requests (equipment_id, user_id, amount, status, from_date, to_date, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, now(), now()) RETURNING id',
    [equipmentId, userId, amount, 'pending', fromDate, toDate],
  );

  const requestId = result.rows[0].id;
  notifyAdminNewRequest(requestId).catch(() => {});

  res.json({ id: requestId });
});

router.get('/mine', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: 'Thiếu thông tin userId' });
  }

  const result = await db.query(
    'SELECT r.id, r.amount, r.status, r.from_date, r.to_date, e.name as equipmentName, r.created_at FROM requests r JOIN equipments e ON e.id = r.equipment_id WHERE r.user_id = $1 ORDER BY r.created_at DESC',
    [userId],
  );
  res.json(
    result.rows.map((row: any) => ({
      id: row.id,
      amount: row.amount,
      status: row.status,
      equipmentName: row.equipmentName,
      from: row.from_date,
      to: row.to_date,
      createdAt: row.created_at,
    })),
  );
});

router.get('/', async (_req, res) => {
  const result = await db.query(
    'SELECT r.id, r.amount, r.status, r.from_date, r.to_date, u.name as userName, e.name as equipmentName FROM requests r JOIN equipments e ON e.id = r.equipment_id LEFT JOIN users u ON u.id = r.user_id ORDER BY r.created_at DESC',
  );
  res.json(
    result.rows.map((row: any) => ({
      id: row.id,
      amount: row.amount,
      status: row.status,
      userName: row.userName,
      equipmentName: row.equipmentName,
      from: row.from_date,
      to: row.to_date,
    })),
  );
});

router.post('/:id/approve', async (req, res) => {
  const id = Number(req.params.id);
  const requestResult = await db.query('SELECT * FROM requests WHERE id=$1', [id]);
  if (!requestResult.rows.length) return res.status(404).json({ error: 'Request not found' });

  const requestRow = requestResult.rows[0];
  if (requestRow.status !== 'pending') return res.status(400).json({ error: 'Request must be pending' });

  const equipmentResult = await db.query('SELECT quantity FROM equipments WHERE id=$1', [requestRow.equipment_id]);
  if (!equipmentResult.rows.length) return res.status(404).json({ error: 'Equipment not found' });

  const quantity = equipmentResult.rows[0].quantity;
  if (quantity < requestRow.amount) return res.status(400).json({ error: 'Không đủ số lượng hiện có' });

  await db.query('UPDATE requests SET status=$1, updated_at=now() WHERE id=$2', ['approved', id]);
  await adjust(requestRow.equipment_id, -requestRow.amount);
  notifyStudentApproved(id).catch(() => {});

  res.json({ ok: true });
});

router.post('/:id/return', async (req, res) => {
  const id = Number(req.params.id);
  const requestResult = await db.query('SELECT * FROM requests WHERE id=$1', [id]);
  if (!requestResult.rows.length) return res.status(404).json({ error: 'Request not found' });

  const requestRow = requestResult.rows[0];
  if (requestRow.status !== 'approved') return res.status(400).json({ error: 'Only approved requests can be returned' });

  await db.query('UPDATE requests SET status=$1, updated_at=now() WHERE id=$2', ['returned', id]);
  await adjust(requestRow.equipment_id, requestRow.amount);

  res.json({ ok: true });
});

router.post('/:id/cancel', async (req, res) => {
  const id = Number(req.params.id);
  const requestResult = await db.query('SELECT * FROM requests WHERE id=$1', [id]);
  if (!requestResult.rows.length) return res.status(404).json({ error: 'Request not found' });

  const requestRow = requestResult.rows[0];
  if (requestRow.status !== 'pending') return res.status(400).json({ error: 'Chỉ có thể hủy yêu cầu đang chờ duyệt' });

  await db.query('UPDATE requests SET status=$1, updated_at=now() WHERE id=$2', ['rejected', id]);

  res.json({ ok: true });
});

export default router;

