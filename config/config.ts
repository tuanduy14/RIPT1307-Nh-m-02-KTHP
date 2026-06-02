// https://umijs.org/config/
import { defineConfig, history } from 'umi';
import defaultSettings from './defaultSettings';
import routes from './routes';
import React from 'react';
import { unCheckPermissionPaths } from '../src/components/OIDCBounder/constant';
import { currentRole } from '../src/utils/ip';
// import proxy from './proxy';
// const { REACT_APP_ENV } = process.env;

export default defineConfig({
	hash: true,
	antd: {},
	publicPath: '/',
	dva: {
		hmr: true,
	},
	layout: {
		// https://umijs.org/zh-CN/plugins/plugin-layout
		locale: true,
		...defaultSettings,
		unAccessible: React.createElement('div', null, '403 - Không có quyền truy cập'),
		noFound: React.createElement('div', null, '404 - Không tìm thấy trang'),
		rightContentRender: () => null,
		disableContentMargin: false,
		footerRender: () =>
			React.createElement(
				'div',
				{
					style: { width: '100%', textAlign: 'center', padding: 12 },
				},
				`2025 CopyRight - ${APP_CONFIG_APP_VERSION}`,
			),
		onPageChange: () => {
			const { location } = history;
			const isUncheckPath = unCheckPermissionPaths.some((path) => window.location.pathname.includes(path));
			const initialState = (window as any).g_initialState;

			if (location.pathname === '/') {
				history.replace('/student/dashboard');
			} else if (
				!isUncheckPath &&
				currentRole &&
				initialState?.authorizedPermissions?.length &&
				!initialState?.authorizedPermissions?.find((item: any) => item.rsname === currentRole)
			) {
				history.replace('/403');
			}
		},
		menuItemRender: (item: any, dom: any) => React.createElement(
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
	// https://umijs.org/zh-CN/plugins/plugin-locale
	locale: {
		// enable: true,
		default: 'vi-VN',
		antd: true,
		// default true, when it is true, will use `navigator.language` overwrite default
		baseNavigator: false,
		// baseSeparator: '_',
	},
	dynamicImport: {
		loading: '@ant-design/pro-layout/es/PageLoading',
	},
	targets: {
		ie: 11,
	},
	routes,
	// Theme for antd: https://ant.design/docs/react/customize-theme-cn
	theme: {
		'primary-color': defaultSettings.primaryColor,
		'border-radius-base': defaultSettings.borderRadiusBase,
	},
	// esbuild is father build tools
	// https://umijs.org/plugins/plugin-esbuild
	esbuild: {},
	title: false,
	ignoreMomentLocale: true,
	// proxy: proxy[REACT_APP_ENV || 'dev'],
	manifest: {
		basePath: '/',
	},
	// Fast Refresh 热更新
	fastRefresh: {},

	nodeModulesTransform: {
		type: 'none',
	},
	// mfsu: {},
	webpack5: {},
	exportStatic: {},
	define: Object.entries(process.env).reduce((result, [key, value]) => {
		if (key.startsWith('APP_CONFIG_')) {
			return {
				...result,
				[key]: value,
			};
		}
		return result;
	}, {}),
});
