import React from 'react';
import { Layout, Menu, Typography, Button, Space, Badge, message } from 'antd';
import {
  AppstoreOutlined,
  BellOutlined,
  DashboardOutlined,
  HistoryOutlined,
  LogoutOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { connect, history } from 'umi';
import { StudentBorrowModelState } from '@/models/studentBorrowModel';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

interface StudentLayoutProps {
  children: React.ReactNode;
  dispatch: any;
  studentBorrow: StudentBorrowModelState;
  location: {
    pathname: string;
  };
}

const StudentLayout: React.FC<StudentLayoutProps> = ({
  children,
  dispatch,
  studentBorrow,
  location,
}) => {
  const { currentUser, notifications } = studentBorrow;

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  React.useEffect(() => {
    if (!currentUser) {
      history.push('/student/login');
    }
  }, [currentUser]);

  const handleLogout = () => {
    dispatch({
      type: 'studentBorrow/logout',
    });

    message.success('Đăng xuất thành công');
    history.push('/student/login');
  };

  const handleResetData = () => {
    dispatch({
      type: 'studentBorrow/resetDemoData',
    });

    message.success('Đã khôi phục dữ liệu mẫu');
  };

  if (!currentUser) {
    return null;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={260} theme="light">
        <div style={{ padding: 20 }}>
          <Title level={4} style={{ marginBottom: 0 }}>
            Borrow Club
          </Title>
          <Text type="secondary">Giao diện sinh viên</Text>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={(item) => history.push(item.key)}
          items={[
            {
              key: '/student/dashboard',
              icon: <DashboardOutlined />,
              label: 'Tổng quan',
            },
            {
              key: '/student/devices',
              icon: <AppstoreOutlined />,
              label: 'Danh sách thiết bị',
            },
            {
              key: '/student/borrow-request',
              icon: <SendOutlined />,
              label: 'Gửi yêu cầu mượn',
            },
            {
              key: '/student/history',
              icon: <HistoryOutlined />,
              label: 'Lịch sử mượn',
            },
            {
              key: '/student/notifications',
              icon: <BellOutlined />,
              label: (
                <Space>
                  Thông báo
                  {unreadCount > 0 && <Badge count={unreadCount} size="small" />}
                </Space>
              ),
            },
          ]}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          }}
        >
          <Space direction="vertical" size={0}>
            <Text strong>{currentUser.fullName}</Text>
            <Text type="secondary">{currentUser.email}</Text>
          </Space>

          <Space>
            <Button onClick={handleResetData}>Khôi phục dữ liệu mẫu</Button>
            <Button danger icon={<LogoutOutlined />} onClick={handleLogout}>
              Đăng xuất
            </Button>
          </Space>
        </Header>

        <Content style={{ padding: 24, background: '#f5f5f5' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default connect(({ studentBorrow }: any) => ({
  studentBorrow,
}))(StudentLayout);