import React from 'react';
import { Form, Input, Button, Typography, message, Divider, Space } from 'antd';
import { GoogleOutlined, GithubOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import { history } from 'umi';

const { Title, Text } = Typography;

const SignUp: React.FC = () => {
  const onFinish = (values: any) => {
    if (values.password !== values.confirm) {
      message.error('Mật khẩu xác nhận không khớp!');
      return;
    }
    // Logic giả lập Đăng ký thành công
    message.success('Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
    history.push('/user/login');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      // Dùng lại đúng mã màu Gradient Tím - Xanh của trang Login
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      
      {/* Khối CSS "Kính mờ" đồng bộ 100% với trang Login */}
      <style>{`
        .glass-form .ant-input-affix-wrapper {
          background: rgba(255, 255, 255, 0.1) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          border-radius: 8px !important;
          box-shadow: none !important;
        }
        .glass-form .ant-input-affix-wrapper > input.ant-input,
        .glass-form .ant-input {
          background: transparent !important;
          color: #fff !important;
        }
        .glass-form .ant-input:-webkit-autofill,
        .glass-form .ant-input:-webkit-autofill:hover, 
        .glass-form .ant-input:-webkit-autofill:focus, 
        .glass-form .ant-input:-webkit-autofill:active {
          -webkit-text-fill-color: #fff !important;
          transition: background-color 5000s ease-in-out 0s;
        }
        .glass-form .ant-input::placeholder {
          color: rgba(255, 255, 255, 0.5) !important;
        }
        .glass-form .ant-input-password-icon,
        .glass-form .ant-input-prefix {
          color: rgba(255, 255, 255, 0.7) !important;
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

      {/* Khối Box kính mờ */}
      <div style={{
        width: '100%',
        maxWidth: 420,
        padding: '40px 32px',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: 20,
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
      }}>
        <Title level={2} style={{ color: '#fff', margin: 0, fontWeight: 600 }}>Create Account</Title>
        <Text style={{ color: 'rgba(255, 255, 255, 0.7)', display: 'block', marginBottom: 32, marginTop: 8 }}>
          Sign up to get started
        </Text>

        <Form
          name="signup_form"
          layout="vertical"
          onFinish={onFinish}
          size="large"
          className="glass-form"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng tạo mật khẩu!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item
            name="confirm"
            rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
          </Form.Item>

          <Form.Item style={{ marginTop: 8, marginBottom: 24 }}>
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
              Sign Up
            </Button>
          </Form.Item>
        </Form>

        <Divider className="glass-divider">or sign up with</Divider>

        {/* Nút Mạng xã hội phong cách kính mờ */}
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
          <Text style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Already have an account? </Text>
          <a onClick={() => history.push('/user/login')} style={{ color: '#4facfe', fontWeight: 'bold' }}>Sign in</a>
        </div>
      </div>
    </div>
  );
};

export default SignUp;