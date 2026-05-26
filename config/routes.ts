export default [
	// 1. GIAO DIỆN ĐĂNG NHẬP 
    {
        path: '/user',
        layout: false,
        routes: [
            {
                path: '/user/login',
                layout: false,
                name: 'login',
                component: './user/Login', 
            },
            {
                path: '/user',
                redirect: '/user/login',
            },
        ],
    },
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
                path: '/admin/dashboard',
                name: 'Dashboard',
                icon: 'dashboard',
                component: './Admin/Dashboard', 
            },
            {
                path: '/admin/requests',
                name: 'Quản lý yêu cầu',
                icon: 'form',
                component: './Admin/Request', 
            },
            {
                path: '/admin/equipments',
                name: 'Quản lý kho thiết bị',
                icon: 'database',
                component: './Admin/Equipment', 
            },
            {
                path: '/admin/history',
                name: 'Lịch sử mượn/trả',
                icon: 'history',
                component: './Admin/History', 
            },
            {
                path: '/admin/stats',
                name: 'Thống kê',
                icon: 'pieChart',
                component: './Admin/Stats', 
            },
            {
                path: '/admin',
                redirect: '/admin/dashboard', 
            },
        ],
    },
	{
        path: '/',
        redirect: '/user/login', 
    },
	{
		component: './exception/404',
	},
];
