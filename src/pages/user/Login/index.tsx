import React from 'react';
import { Form, Input, Button, Checkbox, Typography, message, Divider, Space } from 'antd';
import { GoogleOutlined, GithubOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import { history } from 'umi';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const onFinish = (values: any) => {
    // Logic giả lập Đăng nhập (MOCK)
    if (values.username === 'admin' && values.password === '123456') {
      message.success('Đăng nhập thành công! Chào mừng Quản trị viên.');
      history.push('/admin/dashboard'); // Chuyển hướng vào trang Admin sau khi thành công
    } else {
      message.error('Sai tên đăng nhập hoặc mật khẩu! (Gợi ý: admin / 123456)');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      // Màu nền Gradient tông Tím - Xanh giống hệt bản thiết kế
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      
      {/* Nhúng CSS trực tiếp để "tút tát" lại Ant Design Input 
        giúp nó có nền kính mờ trong suốt (Glassmorphism)
      */}
      <style>{`
        /* 1. Xử lý lớp bọc ngoài cùng (Wrapper chứa icon) */
        .glass-form .ant-input-affix-wrapper {
          background: rgba(255, 255, 255, 0.1) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          border-radius: 8px !important;
          box-shadow: none !important;
        }

        /* 2. Ép "lõi" nhập chữ bên trong phải TRONG SUỐT hoàn toàn */
        .glass-form .ant-input-affix-wrapper > input.ant-input,
        .glass-form .ant-input {
          background: transparent !important;
          color: #fff !important;
        }

        /* 3. Đổi màu chữ và nền khi trình duyệt Tự động điền (Autofill) */
        .glass-form .ant-input:-webkit-autofill,
        .glass-form .ant-input:-webkit-autofill:hover, 
        .glass-form .ant-input:-webkit-autofill:focus, 
        .glass-form .ant-input:-webkit-autofill:active {
          -webkit-text-fill-color: #fff !important;
          transition: background-color 5000s ease-in-out 0s;
        }

        /* 4. Tùy chỉnh màu sắc Icon và Placeholder (Chữ mờ) */
        .glass-form .ant-input::placeholder {
          color: rgba(255, 255, 255, 0.5) !important;
        }
        .glass-form .ant-input-password-icon,
        .glass-form .ant-input-prefix {
          color: rgba(255, 255, 255, 0.7) !important;
        }

        /* 5. Tùy chỉnh Checkbox và Divider */
        .glass-checkbox .ant-checkbox-inner {
          background: rgba(255, 255, 255, 0.15) !important;
          border-color: rgba(255, 255, 255, 0.4) !important;
        }
        .glass-checkbox .ant-checkbox-checked .ant-checkbox-inner {
          background-color: #4facfe !important;
          border-color: #4facfe !important;
        }
        .glass-divider .ant-divider-inner-text {
          color: rgba(255, 255, 255, 0.6) !important;
          font-size: 13px !important;
          font-weight: normal !important;
        }
        .glass-divider::before, .glass-divider::after {
          border-top-color: rgba(255, 255, 255, 0.2) !important;
        }
      `}</style>

      {/* Khối Box kính mờ chứa Form đăng nhập */}
      <div style={{
        width: '100%',
        maxWidth: 420,
        padding: '40px 32px',
        background: 'rgba(255, 255, 255, 0.1)', // Nền trắng trong suốt 10%
        backdropFilter: 'blur(12px)', // Hiệu ứng làm mờ background phía sau
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.2)', // Viền sáng nhẹ
        borderRadius: 20,
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)', // Đổ bóng mờ ảo
        textAlign: 'center',
      }}>
        <Title level={2} style={{ color: '#fff', margin: 0, fontWeight: 600 }}>Welcome Back</Title>
        <Text style={{ color: 'rgba(255, 255, 255, 0.7)', display: 'block', marginBottom: 32, marginTop: 8 }}>
          Sign in to your account
        </Text>

        <Form
          name="admin_login"
          layout="vertical"
          onFinish={onFinish}
          size="large"
          className="glass-form"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox className="glass-checkbox" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Remember me
              </Checkbox>
            </Form.Item>
            <a style={{ color: '#4facfe' }} href="#">Forgot password?</a>
          </div>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              style={{ 
                // Màu nút bấm dải Gradient Xanh ngọc
                background: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)', 
                border: 'none', 
                borderRadius: 8,
                fontWeight: 600,
                height: 44
              }}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        {/* Phần bổ sung theo nguyên tác của bản thiết kế */}
        <Divider className="glass-divider">or continue with</Divider>

        <Space size="middle" style={{ width: '100%', justifyContent: 'center' }}>
          <Button 
            icon={<GoogleOutlined />} 
            style={{ 
              background: 'rgba(255, 255, 255, 0.15)', 
              border: '1px solid rgba(255, 255, 255, 0.2)', 
              color: '#fff', 
              borderRadius: 8, 
              width: 140 
            }}
          >
            Google
          </Button>
          <Button 
            icon={<GithubOutlined />} 
            style={{ 
              background: 'rgba(255, 255, 255, 0.15)', 
              border: '1px solid rgba(255, 255, 255, 0.2)', 
              color: '#fff', 
              borderRadius: 8, 
              width: 140 
            }}
          >
            GitHub
          </Button>
        </Space>

        <div style={{ marginTop: 24 }}>
          <Text style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Don't have an account? </Text>
          <a style={{ color: '#4facfe' }} href="#">Sign up</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;