"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyAdminOverdue = exports.notifyDueToday = exports.notifyStudentOneDayBefore = exports.notifyStudentDueSoon = exports.notifyStudentRejected = exports.notifyStudentApproved = exports.notifyAdminNewRequest = exports.getUserById = exports.getAdminEmails = void 0;
const db_1 = __importDefault(require("./db"));
const mailer_1 = __importDefault(require("./mailer"));
const ADMIN_EMAIL_FALLBACK = process.env.ADMIN_EMAIL;
async function getAdminEmails() {
    const result = await db_1.default.query("SELECT notify_email FROM users WHERE role = 'admin'");
    const emails = result.rows.map((row) => row.notify_email).filter(Boolean);
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
// ─── 1. Admin: có yêu cầu mượn mới ─────────────────────────────────────────
async function notifyAdminNewRequest(requestId) {
    const result = await db_1.default.query(`SELECT r.id, r.amount, r.from_date, r.to_date,
            u.name        AS student_name,
            u.email       AS student_email,
            e.name        AS equipment_name
     FROM requests r
     JOIN users      u ON u.id = r.user_id
     JOIN equipments e ON e.id = r.equipment_id
     WHERE r.id = $1`, [requestId]);
    if (!result.rows.length)
        return;
    const req = result.rows[0];
    const adminEmails = await getAdminEmails();
    if (!adminEmails.length)
        return;
    await (0, mailer_1.default)({
        to: adminEmails.join(','),
        subject: `[Mượn thiết bị] Yêu cầu mới #${requestId}`,
        text: `Sinh viên ${req.student_name} (${req.student_email}) vừa tạo yêu cầu mượn:\n` +
            `  • Thiết bị : ${req.equipment_name}\n` +
            `  • Số lượng : ${req.amount}\n` +
            `  • Từ ngày  : ${fmt(req.from_date)}\n` +
            `  • Đến ngày : ${fmt(req.to_date)}\n\n` +
            `Vui lòng đăng nhập hệ thống để xét duyệt.`,
    });
}
exports.notifyAdminNewRequest = notifyAdminNewRequest;
// ─── 2. Sinh viên: yêu cầu được duyệt ───────────────────────────────────────
async function notifyStudentApproved(requestId) {
    const result = await db_1.default.query(`SELECT r.id, r.amount, r.from_date, r.to_date,
            u.name        AS student_name,
            u.notify_email AS student_email,
            e.name        AS equipment_name
     FROM requests r
     JOIN users      u ON u.id = r.user_id
     JOIN equipments e ON e.id = r.equipment_id
     WHERE r.id = $1`, [requestId]);
    if (!result.rows.length)
        return;
    const req = result.rows[0];
    if (!req.student_email)
        return;
    await (0, mailer_1.default)({
        to: req.student_email,
        subject: `[Mượn thiết bị] Yêu cầu #${requestId} đã được duyệt ✅`,
        text: `Xin chào ${req.student_name},\n\n` +
            `Yêu cầu mượn thiết bị của bạn đã được phê duyệt:\n` +
            `  • Thiết bị : ${req.equipment_name}\n` +
            `  • Số lượng : ${req.amount}\n` +
            `  • Ngày mượn: ${fmt(req.from_date)}\n` +
            `  • Hạn trả  : ${fmt(req.to_date)}\n\n` +
            `Vui lòng đến nhận thiết bị đúng lịch và trả đúng hạn. Trân trọng!`,
    });
}
exports.notifyStudentApproved = notifyStudentApproved;
// ─── 2b. Sinh viên: yêu cầu bị từ chối ─────────────────────────────────────
async function notifyStudentRejected(requestId) {
    const result = await db_1.default.query(`SELECT r.id, r.amount, r.from_date, r.to_date,
            u.name        AS student_name,
            u.notify_email AS student_email,
            e.name        AS equipment_name
     FROM requests r
     JOIN users      u ON u.id = r.user_id
     JOIN equipments e ON e.id = r.equipment_id
     WHERE r.id = $1`, [requestId]);
    if (!result.rows.length)
        return;
    const req = result.rows[0];
    if (!req.student_email)
        return;
    await (0, mailer_1.default)({
        to: req.student_email,
        subject: `[Mượn thiết bị] Yêu cầu #${requestId} đã bị từ chối ❌`,
        text: `Xin chào ${req.student_name},\n\n` +
            `Yêu cầu mượn thiết bị của bạn đã bị từ chối:\n` +
            `  • Thiết bị : ${req.equipment_name}\n` +
            `  • Số lượng : ${req.amount}\n` +
            `  • Từ ngày  : ${fmt(req.from_date)}\n` +
            `  • Đến ngày : ${fmt(req.to_date)}\n\n` +
            `Vui lòng liên hệ quản trị viên để biết thêm thông tin. Trân trọng!`,
    });
}
exports.notifyStudentRejected = notifyStudentRejected;
// ─── 3. Sinh viên: còn 2 ngày trước hạn ────────────────────────────────────
async function notifyStudentDueSoon() {
    const result = await db_1.default.query(`SELECT r.id, r.amount, r.to_date,
            u.name        AS student_name,
            u.notify_email AS student_email,
            e.name        AS equipment_name
     FROM requests r
     JOIN users      u ON u.id = r.user_id
     JOIN equipments e ON e.id = r.equipment_id
     WHERE r.status = 'approved'
       AND r.to_date = CURRENT_DATE + INTERVAL '2 days'
       AND r.due_soon_notified_at IS NULL`);
    if (!result.rows.length)
        return;
    for (const row of result.rows) {
        if (!row.student_email)
            continue;
        await (0, mailer_1.default)({
            to: row.student_email,
            subject: `[Mượn thiết bị] Sắp đến hạn trả #${row.id} (còn 2 ngày)`,
            text: `Xin chào ${row.student_name},\n\n` +
                `Thiết bị bạn mượn sẽ đến hạn trả vào ngày ${fmt(row.to_date)} (còn 2 ngày):\n` +
                `  • Thiết bị : ${row.equipment_name}\n` +
                `  • Số lượng : ${row.amount}\n\n` +
                `Vui lòng chuẩn bị trả đúng hạn. Trân trọng!`,
        });
    }
    const ids = result.rows.map((r) => r.id);
    await db_1.default.query('UPDATE requests SET due_soon_notified_at = now() WHERE id = ANY($1)', [ids]);
}
exports.notifyStudentDueSoon = notifyStudentDueSoon;
// ─── 4. Sinh viên: còn 1 ngày trước hạn ────────────────────────────────────
async function notifyStudentOneDayBefore() {
    const result = await db_1.default.query(`SELECT r.id, r.amount, r.to_date,
            u.name        AS student_name,
            u.notify_email AS student_email,
            e.name        AS equipment_name
     FROM requests r
     JOIN users      u ON u.id = r.user_id
     JOIN equipments e ON e.id = r.equipment_id
     WHERE r.status = 'approved'
       AND r.to_date = CURRENT_DATE + INTERVAL '1 day'
       AND r.due_day_notified_at IS NULL`);
    if (!result.rows.length)
        return;
    for (const row of result.rows) {
        if (!row.student_email)
            continue;
        await (0, mailer_1.default)({
            to: row.student_email,
            subject: `[Mượn thiết bị] Nhắc nhở: còn 1 ngày trước hạn trả #${row.id} ⏰`,
            text: `Xin chào ${row.student_name},\n\n` +
                `Thiết bị bạn đang mượn sẽ đến hạn trả vào ngày mai (${fmt(row.to_date)}):\n` +
                `  • Thiết bị : ${row.equipment_name}\n` +
                `  • Số lượng : ${row.amount}\n\n` +
                `Vui lòng chuẩn bị trả thiết bị đúng hạn để tránh bị ghi nhận trễ hạn. Trân trọng!`,
        });
    }
    const ids = result.rows.map((r) => r.id);
    await db_1.default.query('UPDATE requests SET due_day_notified_at = now() WHERE id = ANY($1)', [ids]);
}
exports.notifyStudentOneDayBefore = notifyStudentOneDayBefore;
// ─── 5. Sinh viên + Admin: đúng ngày hạn trả ────────────────────────────────
async function notifyDueToday() {
    const result = await db_1.default.query(`SELECT r.id, r.amount, r.to_date,
            u.name        AS student_name,
            u.notify_email AS student_email,
            e.name        AS equipment_name
     FROM requests r
     JOIN users      u ON u.id = r.user_id
     JOIN equipments e ON e.id = r.equipment_id
     WHERE r.status = 'approved'
       AND r.to_date = CURRENT_DATE
       AND r.due_today_notified_at IS NULL`);
    if (!result.rows.length)
        return;
    for (const row of result.rows) {
        if (!row.student_email)
            continue;
        await (0, mailer_1.default)({
            to: row.student_email,
            subject: `[Mượn thiết bị] Hôm nay là hạn trả thiết bị #${row.id} 📅`,
            text: `Xin chào ${row.student_name},\n\n` +
                `Hôm nay (${fmt(row.to_date)}) là ngày hạn trả thiết bị bạn đang mượn:\n` +
                `  • Thiết bị : ${row.equipment_name}\n` +
                `  • Số lượng : ${row.amount}\n\n` +
                `Vui lòng trả thiết bị trước khi hết ngày hôm nay. Trân trọng!`,
        });
    }
    const adminEmails = await getAdminEmails();
    if (adminEmails.length) {
        const lines = result.rows.map((r) => `  • #${r.id} — ${r.equipment_name} x${r.amount} — ${r.student_name}`);
        await (0, mailer_1.default)({
            to: adminEmails.join(','),
            subject: `[Mượn thiết bị] Danh sách đến hạn trả hôm nay (${fmt(new Date())})`,
            text: `Các yêu cầu sau đến hạn trả hôm nay:\n\n${lines.join('\n')}\n\n` +
                `Vui lòng theo dõi và nhắc nhở sinh viên trả thiết bị đúng hạn.`,
        });
    }
    const ids = result.rows.map((r) => r.id);
    await db_1.default.query('UPDATE requests SET due_today_notified_at = now() WHERE id = ANY($1)', [ids]);
}
exports.notifyDueToday = notifyDueToday;
// ─── 6. Admin: thiết bị quá hạn ─────────────────────────────────────────────
async function notifyAdminOverdue() {
    const result = await db_1.default.query(`SELECT r.id, r.amount, r.to_date,
            u.name        AS student_name,
            u.email       AS student_email,
            e.name        AS equipment_name
     FROM requests r
     JOIN users      u ON u.id = r.user_id
     JOIN equipments e ON e.id = r.equipment_id
     WHERE r.status = 'approved'
       AND r.to_date < CURRENT_DATE
       AND r.overdue_notified_at IS NULL`);
    if (!result.rows.length)
        return;
    const adminEmails = await getAdminEmails();
    if (!adminEmails.length)
        return;
    const lines = result.rows.map((r) => `  • #${r.id} — ${r.equipment_name} x${r.amount} — ${r.student_name}, hạn: ${fmt(r.to_date)}`);
    await (0, mailer_1.default)({
        to: adminEmails.join(','),
        subject: `[Mượn thiết bị] ⚠️ Có ${result.rows.length} yêu cầu quá hạn trả`,
        text: `Danh sách yêu cầu quá hạn trả:\n\n${lines.join('\n')}\n\nVui lòng xử lý kịp thời.`,
    });
    const ids = result.rows.map((r) => r.id);
    await db_1.default.query('UPDATE requests SET overdue_notified_at = now() WHERE id = ANY($1)', [ids]);
}
exports.notifyAdminOverdue = notifyAdminOverdue;
// ─── Helper ──────────────────────────────────────────────────────────────────
function fmt(d) {
    return new Date(d).toLocaleDateString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
    });
}
