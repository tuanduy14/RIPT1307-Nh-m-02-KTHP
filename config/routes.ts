export default [
	{
		path: '/student',
		name: 'Student',
		icon: 'UserOutlined',
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
	{
		path: '/admin',
		name: 'Admin',
		icon: 'SettingOutlined',
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
	{
		path: '/',
		redirect: '/student/dashboard',
	},
	{
		component: './exception/404',
	},
];
