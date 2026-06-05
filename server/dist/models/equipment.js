"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowHistoryByEquipment = exports.topBorrowedByMonth = exports.deleteEquipment = exports.createEquipment = exports.updateEquipment = exports.statsByMonth = exports.adjust = exports.listEquipments = void 0;
const db_1 = __importDefault(require("../db"));
async function listEquipments() {
    const res = await db_1.default.query('SELECT id, name, quantity FROM equipments ORDER BY id');
    return res.rows;
}
exports.listEquipments = listEquipments;
async function adjust(id, delta) {
    await db_1.default.query('UPDATE equipments SET quantity = quantity + $1 WHERE id = $2', [delta, id]);
}
exports.adjust = adjust;
async function statsByMonth() {
    const res = await db_1.default.query("SELECT to_char(created_at, 'Mon') as month, count(*) as count FROM requests GROUP BY month ORDER BY min(created_at)");
    return res.rows;
}
exports.statsByMonth = statsByMonth;
async function updateEquipment(id, data) {
    const res = await db_1.default.query('UPDATE equipments SET name = $1, quantity = $2 WHERE id = $3 RETURNING *', [data.name, data.quantity, id]);
    return res.rows[0];
}
exports.updateEquipment = updateEquipment;
async function createEquipment(data) {
    const res = await db_1.default.query('INSERT INTO equipments (name, quantity) VALUES ($1, $2) RETURNING *', [data.name, data.quantity]);
    return res.rows[0];
}
exports.createEquipment = createEquipment;
async function deleteEquipment(id) {
    await db_1.default.query('DELETE FROM requests WHERE equipment_id = $1', [id]);
    await db_1.default.query('DELETE FROM equipments WHERE id = $1', [id]);
}
exports.deleteEquipment = deleteEquipment;
async function topBorrowedByMonth(month) {
    const res = await db_1.default.query(`SELECT e.id, e.name, COUNT(r.id) as borrow_count, SUM(r.amount) as total_amount
     FROM equipments e
     JOIN requests r ON r.equipment_id = e.id
     WHERE to_char(r.created_at, 'YYYY-MM') = $1
       AND r.status IN ('approved', 'returned')
     GROUP BY e.id, e.name
     ORDER BY borrow_count DESC
     LIMIT 10`, [month]);
    return res.rows;
}
exports.topBorrowedByMonth = topBorrowedByMonth;
async function borrowHistoryByEquipment(equipmentId) {
    const res = await db_1.default.query(`SELECT r.id, r.amount, r.status, r.from_date, r.to_date, r.created_at,
            u.name as user_name, u.email as user_email
     FROM requests r
     JOIN users u ON u.id = r.user_id
     WHERE r.equipment_id = $1
     ORDER BY r.created_at DESC`, [equipmentId]);
    return res.rows;
}
exports.borrowHistoryByEquipment = borrowHistoryByEquipment;
