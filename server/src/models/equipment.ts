import db from '../db';

export async function listEquipments() {
  const res = await db.query('SELECT id, name, quantity FROM equipments ORDER BY id');
  return res.rows;
}

export async function adjust(id: number, delta: number) {
  await db.query('UPDATE equipments SET quantity = quantity + $1 WHERE id = $2', [delta, id]);
}

export async function statsByMonth() {
  const res = await db.query("SELECT to_char(created_at, 'Mon') as month, count(*) as count FROM requests GROUP BY month ORDER BY min(created_at)");
  return res.rows;
}

export async function updateEquipment(id: number, data: { name: string; quantity: number }) {
  const res = await db.query(
    'UPDATE equipments SET name = $1, quantity = $2 WHERE id = $3 RETURNING *',
    [data.name, data.quantity, id]
  );
  return res.rows[0];
}

export async function createEquipment(data: { name: string; quantity: number }) {
  const res = await db.query(
    'INSERT INTO equipments (name, quantity) VALUES ($1, $2) RETURNING *',
    [data.name, data.quantity]
  );
  return res.rows[0];
}

export async function deleteEquipment(id: number) {
  await db.query('DELETE FROM requests WHERE equipment_id = $1', [id]);
  await db.query('DELETE FROM equipments WHERE id = $1', [id]);
}