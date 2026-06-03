import React from 'react';
import { Button, Avatar, Dropdown, Menu } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { logout, getCurrentUser } from '../../services/user';

export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC = () => {
  const user = getCurrentUser();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    history.replace('/user/login');
  };

  const menu = (
    <Menu>
      <Menu.Item key="name" icon={<UserOutlined />} disabled>
        {user.name}
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} danger onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingRight: 16 }}>
      <Dropdown overlay={menu} placement="bottomRight" arrow>
        <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar
            size="small"
            style={{ backgroundColor: user.role === 'admin' ? '#cf1322' : '#1890ff' }}
            icon={<UserOutlined />}
          />
          <span style={{ fontSize: 13, fontWeight: 500, color: '#333' }}>{user.name}</span>
        </span>
      </Dropdown>
    </div>
  );
};

export default GlobalHeaderRight;
