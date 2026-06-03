import { Router } from 'express';
import db from '../db';
import bcrypt from 'bcryptjs';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Vui lòng nhập email và mật khẩu' });
  }

  try {
    const result = await db.query(
      'SELECT id, name, email, role, password_hash FROM users WHERE email = $1',
      [email],
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: 'Không tìm thấy tài khoản với email này' });
    }

    const user = result.rows[0];

    // Kiểm tra xem user có password_hash không (nếu là user cũ chưa migrate)
    if (!user.password_hash) {
      return res.status(401).json({ error: 'Tài khoản chưa được thiết lập mật khẩu. Vui lòng liên hệ Admin.' });
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Mật khẩu không chính xác' });
    }

    // Xóa trường password_hash trước khi trả về client
    delete user.password_hash;
    res.json({ user });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

export default router;
