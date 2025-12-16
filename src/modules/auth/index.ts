export {
  AuthContextProvider,
  getCurrentUserIdGlobal,
  getIdTokenGlobal,
  getDebugUserInfoHeaderGlobal,
  useAuthContext,
  getIdTokenExpirationTimeGlobal,
} from './AuthContext';
export {getIdTokenValidityStatus} from './utils';
export type {
  AuthStateChangeListenerCallback,
  AuthStatus,
  ConfirmationErrorCode,
  PhoneSignInErrorCode,
  VippsSignInErrorCode,
  AuthenticationType,
} from './types';
export {useUpdateIntercomOnUserChange} from './use-update-intercom-on-user-change';
export {useRefreshIdTokenWhenNecessary} from './use-refresh-id-token-when-necessary';
export {useOnAuthStateChanged} from './use-subscribe-to-auth-user-change';
export {useAuthenticateVipps} from './use-authenticate-vipps';
