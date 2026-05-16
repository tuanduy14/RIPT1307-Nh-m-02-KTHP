"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.statsByMonth = exports.adjust = exports.listEquipments = void 0;
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
