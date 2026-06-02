import type { ReactNode } from 'react';
import { notification } from 'antd';
import 'moment/locale/vi';
import type { RequestConfig } from 'umi';
import { getIntl, getLocale } from 'umi';
import type { RequestOptionsInit, ResponseError } from 'umi-request';
import ErrorBoundary from './components/ErrorBoundary';
import { OIDCBounder } from './components/OIDCBounder';
import OneSignalBounder from './components/OneSignalBounder';
import type { IInitialState } from './services/base/typing';
import './styles/global.less';

export const initialStateConfig = {
	loading: <></>,
};

export async function getInitialState(): Promise<IInitialState> {
	return {
		permissionLoading: true,
	};
}

const authHeaderInterceptor = (url: string, options: RequestOptionsInit) => ({});

export function rootContainer(container: ReactNode) {
	return (
		<OIDCBounder>
			<ErrorBoundary>
				<OneSignalBounder>{container}</OneSignalBounder>
			</ErrorBoundary>
		</OIDCBounder>
	);
}

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


