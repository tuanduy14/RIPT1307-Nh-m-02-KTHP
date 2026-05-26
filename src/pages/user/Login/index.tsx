import React from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { history } from 'umi';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  // Hàm xử lý khi người dùng bấm nút Đăng nhập
  const onFinish = (values: any) => {
    // Giả lập logic kiểm tra tài khoản (Mock Auth)
    // Trong thực tế, đoạn này sẽ gọi API Backend để kiểm tra
    if (values.username === 'admin' && values.password === '123456') {
      message.success('Đăng nhập thành công! Chào mừng Quản trị viên.');
      
      // Chuyển hướng người dùng vào trang Thống kê (Dashboard)
      history.push('/admin/stats');
    } else {
      message.error('Sai tên đăng nhập hoặc mật khẩu! (Gợi ý: admin / 123456)');
    }
  };

  return (
    // Sử dụng Flexbox để căn giữa Form đăng nhập ra giữa màn hình
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      background: '#f0f2f5' // Màu nền xám nhạt đồng bộ với Light Mode
    }}>
      <Card 
        bordered={false}
        style={{ 
          width: 400, 
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
          borderRadius: 12 
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2} style={{ color: '#1890ff', margin: 0 }}>CLB Manager</Title>
          <Text type="secondary">Hệ thống Quản trị viên</Text>
        </div>

        <Form
          name="admin_login"
          layout="vertical"
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            name="username"
            // Bắt lỗi không được để trống
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} placeholder="Tên đăng nhập" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password prefix={<LockOutlined style={{ color: '#bfbfbf' }} />} placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item style={{ marginTop: 24 }}>
            <Button type="primary" htmlType="submit" block style={{ borderRadius: 6 }}>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;