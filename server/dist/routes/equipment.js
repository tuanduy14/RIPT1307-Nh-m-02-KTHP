"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const equipment_1 = require("../models/equipment");
const router = (0, express_1.Router)();
router.get('/', async (_req, res) => {
    const rows = await (0, equipment_1.listEquipments)();
    res.json(rows);
});
router.get('/stats', async (_req, res) => {
    const rows = await (0, equipment_1.statsByMonth)();
    res.json(rows);
});
router.get('/top-borrowed', async (req, res) => {
    const month = req.query.month || new Date().toISOString().slice(0, 7);
    const rows = await (0, equipment_1.topBorrowedByMonth)(month);
    res.json(rows);
});
router.post('/', async (req, res) => {
    const { name, quantity } = req.body;
    const row = await (0, equipment_1.createEquipment)({ name, quantity });
    res.json(row);
});
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, quantity } = req.body;
    const row = await (0, equipment_1.updateEquipment)(Number(id), { name, quantity });
    res.json(row);
});
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await (0, equipment_1.deleteEquipment)(Number(id));
    res.json({ ok: true });
});
router.get('/:id/borrow-history', async (req, res) => {
    const rows = await (0, equipment_1.borrowHistoryByEquipment)(Number(req.params.id));
    res.json(rows);
});
exports.default = router;
