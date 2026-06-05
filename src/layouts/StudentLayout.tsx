import React, { useEffect } from 'react';
import { Layout, Menu } from 'antd';
import { HomeOutlined, LaptopOutlined, HistoryOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { history, useLocation } from 'umi';
import { getCurrentUser, logout } from '../services/user';

const { Sider, Content } = Layout;

const StudentLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const user = getCurrentUser();

  useEffect(() => {
    if (!user) { history.replace('/user/login'); return; }
    if (user.role !== 'student') history.replace('/admin/requests');
  }, []);

  if (!user || user.role !== 'student') return null;

  const handleLogout = () => { logout(); window.location.href = '/user/login'; };

  const menuItems = [
    { key: '/student/dashboard', icon: <HomeOutlined />, label: 'Dashboard' },
    { key: '/student/devices', icon: <LaptopOutlined />, label: 'Danh sách thiết bị' },
    { key: '/student/history', icon: <HistoryOutlined />, label: 'Lịch sử mượn' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={220} style={{ background: '#1a1f2e' }}>
        {/* Logo */}
        <div style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 16px', gap: 8 }}>
          <img src="/logo.png" alt="logo" style={{ height: 28 }} onError={(e) => { (e.target as any).style.display = 'none'; }} />
          <span style={{ fontWeight: 700, fontSize: 13, color: '#fff', letterSpacing: 0.5 }}>LẬP TRÌNH WEB</span>
        </div>

        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={[location.pathname]}
          style={{ background: '#1a1f2e', borderRight: 0, marginTop: 8 }}
          items={menuItems}
          onClick={({ key }) => history.push(key)}
        />
      </Sider>

      <Layout>
        {/* Header */}
        <div style={{ height: 60, background: '#fff', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <span style={{ fontWeight: 600, fontSize: 16, color: '#333' }}>Hệ thống Quản lý Mượn Thiết bị</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#1890ff' }}>
              <UserOutlined /> {user.name}
            </span>
            <span style={{ cursor: 'pointer', color: '#ff4d4f', display: 'flex', alignItems: 'center', gap: 4 }} onClick={handleLogout}>
              <LogoutOutlined /> Đăng xuất
            </span>
          </div>
        </div>

        <Content style={{ margin: 24, minHeight: 'calc(100vh - 108px)' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default StudentLayout;