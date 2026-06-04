import React, { useEffect } from 'react';
import { Layout, Menu } from 'antd';
import { FileOutlined, ToolOutlined, BarChartOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { history, useLocation } from 'umi';
import { getCurrentUser, logout } from '../services/user';

const { Header, Sider, Content } = Layout;

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const user = getCurrentUser();

  useEffect(() => {
    if (!user) {
      history.replace('/user/login');
      return;
    }
    if (user.role !== 'admin') {
      history.replace('/student/dashboard');
    }
  }, []);

  if (!user || user.role !== 'admin') return null;

  const handleLogout = () => {
    logout();
    window.location.href = '/user/login';
  };

  const menuItems = [
    { key: '/admin/requests', icon: <FileOutlined />, label: 'Quản lý yêu cầu' },
    { key: '/admin/devices', icon: <ToolOutlined />, label: 'Quản lý thiết bị' },
    { key: '/admin/stats', icon: <BarChartOutlined />, label: 'Thống kê' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={220} style={{ background: '#1a1a2e', boxShadow: '2px 0 8px rgba(0,0,0,0.15)' }}>
        {/* Logo */}
        <div style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '0 16px' }}>
          <img src="/logo.png" alt="logo" style={{ height: 32, filter: 'brightness(0) invert(1)' }} onError={(e) => { (e.target as any).style.display = 'none'; }} />
          <span style={{ fontWeight: 700, fontSize: 14, marginLeft: 8, color: '#fff' }}>ADMIN</span>
        </div>

        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={[location.pathname]}
          style={{ background: '#1a1a2e', borderRight: 0, marginTop: 8 }}
          items={menuItems}
          onClick={({ key }) => history.push(key)}
        />
      </Sider>

      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', height: 60 }}>
          <span style={{ fontWeight: 600, fontSize: 16, color: '#333' }}>Quản trị hệ thống — Mượn Thiết bị</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#cf1322' }}>
              <UserOutlined />
              {user.name}
            </span>
            <span
              style={{ cursor: 'pointer', color: '#ff4d4f', display: 'flex', alignItems: 'center', gap: 4 }}
              onClick={handleLogout}
            >
              <LogoutOutlined />
              Đăng xuất
            </span>
          </div>
        </Header>

        <Content style={{ margin: 24, background: '#f0f2f5', minHeight: 'calc(100vh - 108px)' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;