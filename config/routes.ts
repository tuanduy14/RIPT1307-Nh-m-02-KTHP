export default [
  {
    path: '/user/login',
    component: './Login',
    layout: false,
  },
  {
    path: '/',
    redirect: '/user/login',
  },
  {
    path: '/student',
    component: '@/layouts/StudentLayout',  
    routes: [
      { path: '/student/dashboard', name: 'Dashboard', icon: 'HomeOutlined', component: './Student/Dashboard' },
      { path: '/student/devices', name: 'Danh sách thiết bị', icon: 'LaptopOutlined', component: './Student/Devices' },
      { path: '/student/history', name: 'Lịch sử mượn', icon: 'HistoryOutlined', component: './Student/History' },
      { path: '/student', redirect: '/student/dashboard' },
    ],
  },
  {
    path: '/admin',
    component: '@/layouts/AdminLayout',  
    routes: [
      { path: '/admin/requests', name: 'Quản lý yêu cầu', icon: 'FileOutlined', component: './Admin/Requests' },
      { path: '/admin/devices', name: 'Quản lý thiết bị', icon: 'ToolOutlined', component: './Admin/Devices' },
      { path: '/admin/stats', name: 'Thống kê', icon: 'BarChartOutlined', component: './Admin/Stats' },
      { path: '/admin', redirect: '/admin/requests' },
    ],
  },
  { component: './exception/404' },
];