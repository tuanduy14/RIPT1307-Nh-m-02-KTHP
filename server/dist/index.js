"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const equipment_1 = __importDefault(require("./routes/equipment"));
const request_1 = __importDefault(require("./routes/request"));
const auth_1 = __importDefault(require("./routes/auth"));
const notifications_1 = require("./notifications");
const db_1 = __importDefault(require("./db"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use('/api/auth', auth_1.default);
app.use('/api/equipments', equipment_1.default);
app.use('/api/requests', request_1.default);
app.get('/api/me', (_req, res) => res.json({ id: 1, name: 'Demo User' }));
const port = process.env.PORT || 4000;
app.listen(port, async () => {
    console.log(`Server listening on port ${port}`);
    try {
        await db_1.default.query('SELECT NOW()');
        console.log('✓ Database connection successful');
    }
    catch (error) {
        console.error('✗ Database connection failed:', error);
        process.exit(1);
    }
    const runDailyNotifications = async () => {
        console.log('[Notifications] Running daily jobs at', new Date().toISOString());
        await (0, notifications_1.notifyStudentDueSoon)().catch((e) => console.error('[Notifications] due_soon:', e));
        await (0, notifications_1.notifyStudentOneDayBefore)().catch((e) => console.error('[Notifications] due_day_before:', e));
        await (0, notifications_1.notifyDueToday)().catch((e) => console.error('[Notifications] due_today:', e));
        await (0, notifications_1.notifyAdminOverdue)().catch((e) => console.error('[Notifications] overdue:', e));
    };
    await runDailyNotifications();
    scheduleDaily(7, 0, runDailyNotifications);
});
function scheduleDaily(hour, minute, callback) {
    const now = new Date();
    const next = new Date(now);
    next.setHours(hour, minute, 0, 0);
    if (next <= now)
        next.setDate(next.getDate() + 1);
    const ms = next.getTime() - now.getTime();
    console.log(`[Notifications] Next run at ${next.toLocaleString('vi-VN')} ` +
        `(in ${Math.round(ms / 60000)} min)`);
    setTimeout(() => {
        callback();
        setInterval(callback, 24 * 60 * 60 * 1000);
    }, ms);
}
