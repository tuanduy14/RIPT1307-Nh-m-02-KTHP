import React, { useState } from 'react';
import { Form, Input, Button, message, Alert } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { login, getCurrentUser } from '../../services/user';
import './style.less';

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await login(values.email, values.password);
      const user = getCurrentUser();
      message.success(`Chào mừng ${user?.name || ''}!`);
      // Điều hướng theo role
      if (user?.role === 'admin') {
        history.replace('/admin/requests');
      } else {
        history.replace('/student/dashboard');
      }
    } catch (e: any) {
      setError(e?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Cột trái — branding */}
      <div className="login-brand">
        <div className="login-brand-inner">
          <div className="login-logo">
            <img src="/logo.png" alt="RIPT Logo" onError={(e) => { (e.target as any).style.display = 'none'; }} />
          </div>
          <h1 className="login-school">Học viện Công nghệ Bưu chính Viễn thông</h1>
          <h2 className="login-app-name">Hệ thống Quản lý Mượn Thiết bị</h2>
          <p className="login-desc">
            Quản lý việc mượn – trả thiết bị của câu lạc bộ một cách nhanh chóng, minh bạch và hiệu quả.
          </p>
          <div className="login-features">
            <div className="login-feature-item">📋 Đặt yêu cầu mượn thiết bị</div>
            <div className="login-feature-item">✅ Duyệt yêu cầu tức thì</div>
            <div className="login-feature-item">📊 Thống kê trực quan</div>
            <div className="login-feature-item">📧 Thông báo qua email</div>
          </div>
        </div>
      </div>

      {/* Cột phải — form đăng nhập */}
      <div className="login-form-wrapper">
        <div className="login-card">
          <div className="login-card-header">
            <div className="login-card-icon">
              <LoginOutlined />
            </div>
            <h2 className="login-title">Đăng nhập</h2>
            <p className="login-subtitle">Nhập thông tin tài khoản để tiếp tục</p>
          </div>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              closable
              onClose={() => setError(null)}
              style={{ marginBottom: 20 }}
            />
          )}

          <Form
            name="login"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            size="large"
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' },
              ]}
            >
              <Input
                prefix={<UserOutlined className="login-input-icon" />}
                placeholder="email@example.com"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="login-input-icon" />}
                placeholder="Nhập mật khẩu"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 12 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                className="login-btn"
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </Form.Item>
          </Form>

          <div className="login-demo-hint">
            <p className="login-demo-title">🔑 Tài khoản demo:</p>
            <div className="login-demo-accounts">
              <div className="login-demo-item">
                <span className="login-demo-role admin">Admin</span>
                <span className="login-demo-info">duynv@gmail.com / admin123</span>
              </div>
              <div className="login-demo-item">
                <span className="login-demo-role student">Sinh viên 1</span>
                <span className="login-demo-info">maitt@gmail.com / student123</span>
              </div>
              <div className="login-demo-item">
                <span className="login-demo-role student">Sinh viên 2</span>
                <span className="login-demo-info">namlh@gmail.com / student456</span>
              </div>
            </div>
          </div>
        </div>

        <p className="login-footer">
          © 2025 RIPT1307 — Nhóm 02 &nbsp;·&nbsp; Học viện BCVT
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
