import React from 'react';
import { Button, Card, Form, Input, Typography, message } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
import { connect, history } from 'umi';

const { Title, Text, Paragraph } = Typography;

interface LoginPageProps {
  dispatch: any;
}

const LoginPage: React.FC<LoginPageProps> = ({ dispatch }) => {
  const handleLogin = (values: { email: string; password: string }) => {
    dispatch({
      type: 'studentBorrow/login',
      payload: values,
    });

    message.success('Đăng nhập thành công');
    history.push('/student/dashboard');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f0f2f5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
      }}
    >
      <Card style={{ width: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3} style={{ marginBottom: 4 }}>
            Hệ thống mượn đồ dùng
          </Title>
          <Text type="secondary">Đăng nhập dành cho sinh viên</Text>
        </div>

        <Form
          layout="vertical"
          onFinish={handleLogin}
          initialValues={{
            email: 'student@club.edu.vn',
          }}
        >
          <Form.Item
            label="Email sinh viên"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
          >
            <Input placeholder="student@club.edu.vn" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            icon={<LoginOutlined />}
          >
            Đăng nhập
          </Button>
        </Form>

        <Paragraph
          type="secondary"
          style={{ textAlign: 'center', marginTop: 16, marginBottom: 0 }}
        >
          Đây là bản frontend demo, có thể đăng nhập bằng email và mật khẩu bất kỳ.
        </Paragraph>
      </Card>
    </div>
  );
};

export default connect()(LoginPage);