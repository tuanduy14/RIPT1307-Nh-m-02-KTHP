import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import { notification } from 'antd';
import 'moment/locale/vi';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { getIntl, getLocale, history } from 'umi';
import type { RequestOptionsInit, ResponseError } from 'umi-request';
import ErrorBoundary from './components/ErrorBoundary';
import { OIDCBounder } from './components/OIDCBounder';
import { unCheckPermissionPaths } from './components/OIDCBounder/constant';
import OneSignalBounder from './components/OneSignalBounder';
import TechnicalSupportBounder from './components/TechnicalSupportBounder';
import type { IInitialState } from './services/base/typing';
import './styles/global.less';
import { currentRole } from './utils/ip';

export const initialStateConfig = {
	loading: <></>,
};

export async function getInitialState(): Promise<IInitialState> {
	return {
		permissionLoading: true,
	};
}

const authHeaderInterceptor = (url: string, options: RequestOptionsInit) => ({});

export const request: RequestConfig = {
	errorHandler: (error: ResponseError) => {
		const { messages } = getIntl(getLocale());
		const { response } = error;

		if (response && response.status) {
			const { status, statusText, url } = response;
			const requestErrorMessage = messages['app.request.error'];
			const errorMessage = `${requestErrorMessage} ${status}: ${url}`;
			const errorDescription = messages[`app.request.${status}`] || statusText;
			notification.error({
				message: errorMessage,
				description: errorDescription,
			});
		}

		if (!response) {
			notification.error({
				description: 'Yêu cầu gặp lỗi',
				message: 'Bạn hãy thử lại sau',
			});
		}
		throw error;
	},
	requestInterceptors: [authHeaderInterceptor],
};

export const layout: RunTimeLayoutConfig = ({ initialState }) => {
	return {
		unAccessible: (
			<OIDCBounder>
				<TechnicalSupportBounder>
					<div>403 - Không có quyền truy cập</div>
				</TechnicalSupportBounder>
			</OIDCBounder>
		),
		noFound: <div>404 - Không tìm thấy trang</div>,
		rightContentRender: () => <RightContent />,
		disableContentMargin: false,
		footerRender: () => <Footer />,

		onPageChange: () => {
			if (initialState?.currentUser) {
				const { location } = history;
				const isUncheckPath = unCheckPermissionPaths.some((path) => window.location.pathname.includes(path));

				if (location.pathname === '/') {
					history.replace('/dashboard');
				} else if (
					!isUncheckPath &&
					currentRole &&
					initialState?.authorizedPermissions?.length &&
					!initialState?.authorizedPermissions?.find((item) => item.rsname === currentRole)
				)
					history.replace('/403');
			}
		},

		menuItemRender: (item: any, dom: any) => (
			<a
				className='not-underline'
				key={item?.path}
				href={item?.path}
				onClick={(e) => {
					e.preventDefault();
					history.push(item?.path ?? '/');
				}}
				style={{ display: 'block' }}
			>
				{dom}
			</a>
		),

		childrenRender: (dom: any) => (
			<OIDCBounder>
				<ErrorBoundary>
					<OneSignalBounder>{dom}</OneSignalBounder>
				</ErrorBoundary>
			</OIDCBounder>
		),
		menuHeaderRender: undefined,
		...initialState?.settings,
	};
};