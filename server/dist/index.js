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
// CORS configuration - Allow all origins for testing
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(body_parser_1.default.json());
app.use('/api/auth', auth_1.default);
app.use('/api/equipments', equipment_1.default);
app.use('/api/requests', request_1.default);
app.get('/api/me', (_req, res) => res.json({ id: 1, name: 'Demo User' }));
const port = process.env.PORT || 4000;
app.listen(port, async () => {
    console.log(`Server listening on port ${port}`);
    // Test database connection
    try {
        await db_1.default.query('SELECT NOW()');
        console.log('✓ Database connection successful');
    }
    catch (error) {
        console.error('✗ Database connection failed:', error);
        console.error('Make sure DATABASE_URL is set correctly');
        process.exit(1);
    }
    const runNotifications = async () => {
        await (0, notifications_1.notifyAdminOverdue)().catch((e) => console.error('Overdue notification failed', e));
        await (0, notifications_1.notifyStudentDueSoon)().catch((e) => console.error('Due soon notification failed', e));
    };
    await runNotifications();
    setInterval(runNotifications, 24 * 60 * 60 * 1000);
});
