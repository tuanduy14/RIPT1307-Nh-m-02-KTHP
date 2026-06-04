// config/config.ts
import { defineConfig, history } from 'umi';
import defaultSettings from './defaultSettings';
import routes from './routes';
import React from 'react';
import proxy from './proxy';

const { REACT_APP_ENV } = process.env;

export default defineConfig({
	hash: true,
	antd: {},
	publicPath: '/',
	dva: { hmr: true },
	layout: {
		locale: true,
		...defaultSettings,
		unAccessible: React.createElement('div', null, '403 - Không có quyền truy cập'),
		noFound: React.createElement('div', null, '404 - Không tìm thấy trang'),
		rightContentRender: () =>
			React.createElement(require('../src/components/RightContent').default),
		disableContentMargin: false,
		footerRender: () =>
			React.createElement(
				'div',
				{ style: { width: '100%', textAlign: 'center', padding: 12 } },
				`2025 CopyRight - ${APP_CONFIG_APP_VERSION}`,
			),

		// ✅ menuDataRender — build menu hoàn toàn theo role
		menuDataRender: () => {
			let role = '';
			try {
				if (typeof localStorage !== 'undefined') {
					const raw = localStorage.getItem('ript_user');
					role = raw ? JSON.parse(raw)?.role || '' : '';
				}
			} catch { }

			if (role === 'admin') {
				return [
					{
						path: '/admin',
						name: 'Admin',
						icon: 'SettingOutlined',
						routes: [
							{ path: '/admin/requests', name: 'Quản lý yêu cầu' },
							{ path: '/admin/devices', name: 'Quản lý thiết bị' },
							{ path: '/admin/stats', name: 'Thống kê' },
						],
					},
				];
			}

			if (role === 'student') {
				return [
					{
						path: '/student',
						name: 'Student',
						icon: 'UserOutlined',
						routes: [
							{ path: '/student/dashboard', name: 'Dashboard' },
							{ path: '/student/devices', name: 'Danh sách thiết bị' },
							{ path: '/student/history', name: 'Lịch sử mượn' },
						],
					},
				];
			}

			return [];
		},

		onPageChange: () => {
			const { location } = history;
			if (location.pathname === '/user/login') return;

			let user: any = null;
			try {
				const raw = localStorage.getItem('ript_user');
				user = raw ? JSON.parse(raw) : null;
			} catch { }

			if (!user) {
				history.replace('/user/login');
				return;
			}

			if (user.role === 'admin' && location.pathname.startsWith('/student')) {
				history.replace('/admin/requests');
				return;
			}

			if (user.role === 'student' && location.pathname.startsWith('/admin')) {
				history.replace('/student/dashboard');
				return;
			}

			if (location.pathname === '/') {
				history.replace(user.role === 'admin' ? '/admin/requests' : '/student/dashboard');
			}
		},

		menuItemRender: (item: any, dom: any) =>
			React.createElement(
				'a',
				{
					className: 'not-underline',
					key: item?.path,
					href: item?.path,
					onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
						e.preventDefault();
						history.push(item?.path ?? '/');
					},
					style: { display: 'block' },
				},
				dom,
			),
		menuHeaderRender: undefined,
	},

	locale: {
		default: 'vi-VN',
		antd: true,
		baseNavigator: false,
	},
	dynamicImport: {
		loading: '@ant-design/pro-layout/es/PageLoading',
	},
	targets: { ie: 11 },
	routes,
	theme: {
		'primary-color': defaultSettings.primaryColor,
		'border-radius-base': defaultSettings.borderRadiusBase,
	},
	esbuild: {},
	title: false,
	ignoreMomentLocale: true,
	proxy: (proxy as any)[REACT_APP_ENV || 'dev'],
	manifest: { basePath: '/' },
	fastRefresh: {},
	nodeModulesTransform: { type: 'none' },
	webpack5: {},
	exportStatic: {},
	define: Object.entries(process.env).reduce((result, [key, value]) => {
		if (key.startsWith('APP_CONFIG_')) {
			return { ...result, [key]: value };
		}
		return result;
	}, {}),
});