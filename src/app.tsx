import type { ReactNode } from 'react';
import { notification } from 'antd';
import 'moment/locale/vi';
import type { RequestConfig } from 'umi';
import { getIntl, getLocale } from 'umi';
import type { RequestOptionsInit, ResponseError } from 'umi-request';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/global.less';

export const initialStateConfig = {
  loading: <></>,
};

export async function getInitialState() {
  return { permissionLoading: false };
}

const authHeaderInterceptor = (url: string, options: RequestOptionsInit) => ({});

export function rootContainer(container: ReactNode) {
  return <ErrorBoundary>{container}</ErrorBoundary>;
}

export const request: RequestConfig = {
  errorHandler: (error: ResponseError) => {
    const { messages } = getIntl(getLocale());
    const { response } = error;
    if (response && response.status) {
      const { status, statusText, url } = response;
      notification.error({
        message: `${messages['app.request.error']} ${status}: ${url}`,
        description: messages[`app.request.${status}`] || statusText,
      });
    }
    if (!response) {
      notification.error({ description: 'Yêu cầu gặp lỗi', message: 'Bạn hãy thử lại sau' });
    }
    throw error;
  },
  requestInterceptors: [authHeaderInterceptor],
};