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
