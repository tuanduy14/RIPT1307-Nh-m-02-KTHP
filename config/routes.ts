export default [
  // Trang đăng nhập — không dùng layout sidebar
  {
    path: '/user/login',
    component: './Login',
    layout: false,
  },

  // Redirect gốc về login
  {
    path: '/',
    redirect: '/user/login',
  },

  // Student pages — chỉ student thấy
  {
    path: '/student',
    name: 'Student',
    icon: 'UserOutlined',
    access: 'isStudent',
    routes: [
      {
        path: '/student/dashboard',
        name: 'Dashboard',
        component: './Student/Dashboard',
      },
      {
        path: '/student/devices',
        name: 'Danh sách thiết bị',
        component: './Student/Devices',
      },
      {
        path: '/student/history',
        name: 'Lịch sử mượn',
        component: './Student/History',
      },
      {
        path: '/student',
        redirect: '/student/dashboard',
      },
    ],
  },

  // Admin pages — chỉ admin thấy
  {
    path: '/admin',
    name: 'Admin',
    icon: 'SettingOutlined',
    access: 'isAdmin',
    routes: [
      {
        path: '/admin/requests',
        name: 'Quản lý yêu cầu',
        component: './Admin/Requests',
      },
      {
        path: '/admin/devices',
        name: 'Quản lý thiết bị',
        component: './Admin/Devices',
      },
      {
        path: '/admin/stats',
        name: 'Thống kê',
        component: './Admin/Stats',
      },
      {
        path: '/admin',
        redirect: '/admin/requests',
      },
    ],
  },

  // 404
  {
    component: './exception/404',
  },
];