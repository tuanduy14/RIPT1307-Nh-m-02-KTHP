import { type Login } from './typing';

export enum EModuleKey {
    CONNECT = 'cong-hoc-vien',
    CONG_CAN_BO = 'cong-can-bo',
    QLDT = 'quan-ly-dao-tao',
    CORE = 'danh-muc-chung',
    TCNS = 'to-chuc-nhan-su',
    CTSV = 'cong-tac-sinh-vien',
    VPS = 'van-phong-so',
    TC = 'tai-chinh',
    QLKH = 'quan-ly-khoa-hoc',
    KT = 'khao-thi',
    CSVC = 'co-so-vat-chat',
}

export const AppModules: Record<EModuleKey, Login.TModule> = {
    [EModuleKey.CONNECT]: {
        title: 'APP_CONFIG_TITLE_CONNECT',
        clientId: 'connect_client_id',
        url: 'APP_CONFIG_URL_CONNECT',
        icon: EModuleKey.CONNECT + '.svg',
    },
    [EModuleKey.CONG_CAN_BO]: {
        title: 'APP_CONFIG_TITLE_CAN_BO',
        clientId: 'connect_client_id',
        url: 'APP_CONFIG_URL_CAN_BO',
        icon: EModuleKey.CONG_CAN_BO + '.svg',
    },
    [EModuleKey.CORE]: {
        title: 'APP_CONFIG_TITLE_CORE',
        clientId: 'core_client_id',
        url: 'APP_CONFIG_URL_CORE',
        icon: EModuleKey.CORE + '.svg',
    },
    [EModuleKey.QLDT]: {
        title: 'APP_CONFIG_TITLE_DAO_TAO',
        clientId: 'qldt_client_id',
        url: 'APP_CONFIG_URL_DAO_TAO',
        icon: EModuleKey.QLDT + '.svg',
    },
    [EModuleKey.TCNS]: {
        title: 'APP_CONFIG_TITLE_NHAN_SU',
        clientId: 'tcns_client_id',
        url: 'APP_CONFIG_URL_NHAN_SU',
        icon: EModuleKey.TCNS + '.svg',
    },
    [EModuleKey.CTSV]: {
        title: 'APP_CONFIG_TITLE_CTSV',
        clientId: 'ctsv_client_id',
        url: 'APP_CONFIG_URL_CTSV',
        icon: EModuleKey.CTSV + '.svg',
    },
    [EModuleKey.VPS]: {
        title: 'APP_CONFIG_TITLE_VPS',
        clientId: 'vps_client_id',
        url: 'APP_CONFIG_URL_VPS',
        icon: EModuleKey.VPS + '.svg',
    },
    [EModuleKey.QLKH]: {
        title: 'APP_CONFIG_TITLE_QLKH',
        clientId: 'qlkh_client_id',
        url: 'APP_CONFIG_URL_QLKH',
        icon: EModuleKey.QLKH + '.svg',
    },
    [EModuleKey.TC]: {
        title: 'APP_CONFIG_TITLE_TAI_CHINH',
        clientId: 'tc_client_id',
        url: 'APP_CONFIG_URL_TAI_CHINH',
        icon: EModuleKey.TC + '.svg',
    },
    [EModuleKey.KT]: {
        title: 'APP_CONFIG_TITLE_KHAO_THI',
        clientId: 'kt_client_id',
        url: 'APP_CONFIG_URL_KHAO_THI',
        icon: EModuleKey.KT + '.svg',
    },
    [EModuleKey.CSVC]: {
        title: 'APP_CONFIG_TITLE_CSVC',
        clientId: 'csvc_client_id',
        url: 'APP_CONFIG_URL_CSVC',
        icon: EModuleKey.CSVC + '.svg',
    },
};

export const moduleThuVien: Partial<Login.TModule> = {
    title: 'APP_CONFIG_TITLE_THU_VIEN',
    url: 'APP_CONFIG_URL_THU_VIEN',
    icon: 'thu-vien.svg',
};

export const moduleQuanLyVanBan: Partial<Login.TModule> = {
    title: 'APP_CONFIG_TITLE_QLVB',
    url: 'APP_CONFIG_URL_QLVB',
    icon: 'quan-ly-van-ban.svg',
};

export const moduleCongThongTin: Partial<Login.TModule> = {
    title: 'APP_CONFIG_TITLE_LANDING',
    url: 'APP_CONFIG_URL_LANDING',
    icon: 'cong-thong-tin.svg',
};

/** Đường link landing page */
export const landingUrl = 'APP_CONFIG_URL_LANDING';

/** Màu sắc chủ đạo */
export const primaryColor = '#1890ff'; // Gán mặc định màu xanh dương phổ biến của Ant Design

/** Tên trường Học viện */
export const unitName = 'Học viện BCVT';

/** Cơ quan chủ quản của trường */
export const coQuanChuQuan = 'Bộ Thông tin và Truyền thông';

/** Trường / Học viện */
export const unitPrefix = 'Học viện';

/** Tên tiếng anh của trường */
export const tenTruongVietTatTiengAnh = 'PTIT';

/** Cài đặt hệ thống */
export enum ESettingKey {
    KEY = 'KEY',
}

/** Định dạng file */
export enum EDinhDangFile {
    WORD = 'word',
    EXCEL = 'excel',
    POWERPOINT = 'powerpoint',
    PDF = 'pdf',
    IMAGE = 'image',
    VIDEO = 'video',
    AUDIO = 'audio',
    TEXT = 'text',
    UNKNOWN = 'unknown',
}

export enum EScopeFile {
    PUBLIC = 'Public',
    INTERNAL = 'Internal',
    PRIVATE = 'Private',
}

export enum EStorageFile {
    DATABASE = 'Database',
    S3 = 'S3',
}