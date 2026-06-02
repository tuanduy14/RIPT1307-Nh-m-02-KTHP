"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyStudentDueSoon = exports.notifyAdminOverdue = exports.notifyStudentApproved = exports.notifyAdminNewRequest = exports.getUserById = exports.getAdminEmails = void 0;
const db_1 = __importDefault(require("./db"));
const mailer_1 = __importDefault(require("./mailer"));
const ADMIN_EMAIL_FALLBACK = process.env.ADMIN_EMAIL;
async function getAdminEmails() {
    const result = await db_1.default.query("SELECT email FROM users WHERE role = 'admin'");
    const emails = result.rows.map((row) => row.email).filter(Boolean);
    if (emails.length)
        return emails;
    if (ADMIN_EMAIL_FALLBACK)
        return ADMIN_EMAIL_FALLBACK.split(',').map((e) => e.trim()).filter(Boolean);
    return [];
}
exports.getAdminEmails = getAdminEmails;
async function getUserById(id) {
    const result = await db_1.default.query('SELECT id, name, email FROM users WHERE id = $1', [id]);
    return result.rows[0];
}
exports.getUserById = getUserById;
async function notifyAdminNewRequest(requestId) {
    const result = await db_1.default.query('SELECT r.id, r.amount, r.from_date, r.to_date, u.name as student_name, u.email as student_email, e.name as equipment_name FROM requests r JOIN users u ON u.id = r.user_id JOIN equipments e ON e.id = r.equipment_id WHERE r.id = $1', [requestId]);
    if (!result.rows.length)
        return;
    const request = result.rows[0];
    const adminEmails = await getAdminEmails();
    if (!adminEmails.length)
        return;
    const subject = `Yêu cầu mượn thiết bị mới #${requestId}`;
    const text = `Sinh viên ${request.student_name} (${request.student_email}) đã tạo yêu cầu mượn ${request.amount} x ${request.equipment_name} từ ${request.from_date} đến ${request.to_date}.`;
    await (0, mailer_1.default)({ to: adminEmails.join(','), subject, text });
}
exports.notifyAdminNewRequest = notifyAdminNewRequest;
async function notifyStudentApproved(requestId) {
    const result = await db_1.default.query('SELECT r.id, r.amount, r.from_date, r.to_date, u.name as student_name, u.email as student_email, e.name as equipment_name FROM requests r JOIN users u ON u.id = r.user_id JOIN equipments e ON e.id = r.equipment_id WHERE r.id = $1', [requestId]);
    if (!result.rows.length)
        return;
    const request = result.rows[0];
    const subject = `Yêu cầu mượn #${requestId} đã được duyệt`;
    const text = `Yêu cầu mượn ${request.amount} x ${request.equipment_name} của bạn đã được duyệt. Thời gian mượn: ${request.from_date} đến ${request.to_date}.`;
    await (0, mailer_1.default)({ to: request.student_email, subject, text });
}
exports.notifyStudentApproved = notifyStudentApproved;
async function notifyAdminOverdue() {
    const result = await db_1.default.query("SELECT r.id, r.amount, r.to_date, u.name as student_name, u.email as student_email, e.name as equipment_name FROM requests r JOIN users u ON u.id = r.user_id JOIN equipments e ON e.id = r.equipment_id WHERE r.status = 'approved' AND r.to_date < CURRENT_DATE AND r.overdue_notified_at IS NULL");
    if (!result.rows.length)
        return;
    const adminEmails = await getAdminEmails();
    if (!adminEmails.length)
        return;
    const lines = result.rows.map((row) => `- #${row.id} ${row.amount} x ${row.equipment_name} của ${row.student_name} (${row.student_email}), hạn ${row.to_date}`);
    const subject = 'Thông báo thiết bị mượn quá hạn';
    const text = `Danh sách yêu cầu quá hạn:\n${lines.join('\n')}`;
    await (0, mailer_1.default)({ to: adminEmails.join(','), subject, text });
    const ids = result.rows.map((row) => row.id);
    await db_1.default.query('UPDATE requests SET overdue_notified_at = now() WHERE id = ANY($1)', [ids]);
}
exports.notifyAdminOverdue = notifyAdminOverdue;
async function notifyStudentDueSoon() {
    const result = await db_1.default.query("SELECT r.id, r.amount, r.to_date, u.name as student_name, u.email as student_email, e.name as equipment_name FROM requests r JOIN users u ON u.id = r.user_id JOIN equipments e ON e.id = r.equipment_id WHERE r.status = 'approved' AND r.to_date = CURRENT_DATE + INTERVAL '2 days' AND r.due_soon_notified_at IS NULL");
    if (!result.rows.length)
        return;
    for (const row of result.rows) {
        const subject = `Cảnh báo: sắp đến hạn trả đồ #${row.id}`;
        const text = `Yêu cầu ${row.amount} x ${row.equipment_name} của bạn sẽ đến hạn trả vào ${row.to_date}. Vui lòng chuẩn bị trả đúng hạn.`;
        await (0, mailer_1.default)({ to: row.student_email, subject, text });
    }
    const ids = result.rows.map((row) => row.id);
    await db_1.default.query('UPDATE requests SET due_soon_notified_at = now() WHERE id = ANY($1)', [ids]);
}
exports.notifyStudentDueSoon = notifyStudentDueSoon;
