import { AppModules, EModuleKey } from '@/services/base/constant';

// Điền chính xác link Render Backend của bạn vào đây (nhớ giữ dấu nháy đơn)
const ipRoot = 'https://club-backend-dmy7.onrender.com/api/'; 

// Ip Chính => Mặc định dùng trong các useInitModel
const ip3 = ipRoot + 'slink'; 

// Ip khác
const ipNotif = ipRoot + 'notification'; 
const ipSlink = ipRoot + 'slink'; 

const currentRole = EModuleKey.CONNECT;
const oneSignalRole = EModuleKey.CONNECT;

// DO NOT TOUCH
const keycloakClientID = AppModules[currentRole].clientId;
const keycloakAuthority = 'APP_CONFIG_KEYCLOAK_AUTHORITY';
const resourceServerClientId = 'auth_resource_client_id';
const keycloakAuthEndpoint = 'APP_CONFIG_KEYCLOAK_AUTHORITY/protocol/openid-connect/auth';
const keycloakTokenEndpoint = 'APP_CONFIG_KEYCLOAK_AUTHORITY/protocol/openid-connect/token';
const keycloakUserInfoEndpoint = 'APP_CONFIG_KEYCLOAK_AUTHORITY/protocol/openid-connect/userinfo';
const sentryDSN = 'APP_CONFIG_SENTRY_DSN';
const oneSignalClient = 'APP_CONFIG_ONE_SIGNAL_ID';

export {
    ip3,
    ipNotif,
    ipSlink,
    currentRole,
    oneSignalRole,
    keycloakClientID,
    resourceServerClientId,
    keycloakAuthEndpoint,
    keycloakTokenEndpoint,
    keycloakUserInfoEndpoint,
    keycloakAuthority,
    sentryDSN,
    oneSignalClient,
};