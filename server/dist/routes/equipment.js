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
exports.default = router;
