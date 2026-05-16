"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const equipment_1 = __importDefault(require("./routes/equipment"));
const request_1 = __importDefault(require("./routes/request"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use('/api/equipments', equipment_1.default);
app.use('/api/requests', request_1.default);
app.get('/api/me', (_req, res) => res.json({ id: 1, name: 'Demo User' }));
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening ${port}`));
