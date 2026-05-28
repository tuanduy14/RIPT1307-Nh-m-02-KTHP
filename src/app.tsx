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
import NotAccessible from './pages/exception/403';
import NotFoundContent from './pages/exception/404';
import type { IInitialState } from './services/base/typing';
import './styles/global.less';
import { currentRole } from './utils/ip';
import { CrownOutlined } from '@ant-design/icons';

export const initialStateConfig = { loading: <></> };

export async function getInitialState(): Promise<IInitialState> {
    return { permissionLoading: true };
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
                    <NotAccessible />
                </TechnicalSupportBounder>
            </OIDCBounder>
        ),
        noFound: <NotFoundContent />,
        rightContentRender: () => <RightContent />,
        disableContentMargin: false,

        // ======================================================
        // CẤU HÌNH GIAO DIỆN & MENU QUAN TRỌNG (CHÌA KHÓA HIỂN THỊ)
        // ======================================================
        layout: 'side',
        navTheme: 'light',
        siderWidth: 240,
        menu: {
            locale: false, // BẮT BUỘC CÓ: Tắt dịch thuật để UmiJS không ẩn các menu tiếng Việt
        },

        footerRender: () => {
            const isAdminPath = window.location.pathname.startsWith('/admin');
            if (isAdminPath) {
                return (
                    <div style={{ textAlign: 'center', padding: '16px 0', color: '#8c8c8c', fontSize: 13 }}>
                        CLB Manager © 2026 - Phát triển bởi Nhóm X
                    </div>
                );
            }
            return <Footer />;
        },

        onPageChange: () => {
            if (initialState?.currentUser) {
                const { location } = history;
                const isUncheckPath = unCheckPermissionPaths.some((path) => window.location.pathname.includes(path));

                if (location.pathname === '/') {
                    history.replace('/user/login');
                } else if (
                    !isUncheckPath &&
                    currentRole &&
                    initialState?.authorizedPermissions?.length &&
                    !initialState?.authorizedPermissions?.find((item) => item.rsname === currentRole)
                ) {
                    history.replace('/403');
                }
            }
        },

        menuItemRender: (item: any, dom: any) => {
            const isAlertMenu = item.path === '/admin/alerts';
            return (
                <a
                    className='not-underline'
                    key={item?.path}
                    href={item?.path}
                    onClick={(e) => {
                        e.preventDefault();
                        history.push(item?.path ?? '/');
                    }}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center' }}>{dom}</div>
                    {isAlertMenu && (
                        <div style={{ backgroundColor: '#f5222d', color: '#fff', borderRadius: '12px', padding: '0 8px', fontSize: 12, fontWeight: 700, lineHeight: '20px' }}>
                            3
                        </div>
                    )}
                </a>
            );
        },

        childrenRender: (dom) => {
            const isLoginPage = window.location.pathname.startsWith('/user/login');
            if (isLoginPage) {
                return <ErrorBoundary>{dom}</ErrorBoundary>;
            }
            return (
                <OIDCBounder>
                    <ErrorBoundary>
                        <OneSignalBounder>{dom}</OneSignalBounder>
                    </ErrorBoundary>
                </OIDCBounder>
            );
        },

        menuHeaderRender: (logo, title) => {
            const isAdminPath = window.location.pathname.startsWith('/admin');
            if (isAdminPath) {
                return (
                    <div style={{ display: 'flex', alignItems: 'center', padding: '16px 8px', cursor: 'pointer' }}>
                        {/* 1. KHỐI ICON BÊN TRÁI */}
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            width: 40, 
                            height: 40, 
                            background: '#e6f7ff', // Nền xanh nhạt
                            borderRadius: '8px', 
                            marginRight: 12 
                        }}>
                            <CrownOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                        </div>
                        
                        {/* 2. KHỐI CHỮ BÊN PHẢI (Giữ nguyên) */}
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1890ff' }}>
                                CLB Manager
                            </h1>
                            <span style={{ fontSize: 13, color: '#8c8c8c', marginTop: 4 }}>
                                Quản trị viên
                            </span>
                        </div>
                    </div>
                );
            }
            return (
                <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    {logo}
                    {title}
                </div>
            );
        },

        headerRender: (props, defaultDom) => {
            const isAdminPath = window.location.pathname.startsWith('/admin');
            if (isAdminPath) {
                return false; // Ẩn header ngang phía trên trang Admin
            }
            return defaultDom;
        },

        ...initialState?.settings,
    };
};