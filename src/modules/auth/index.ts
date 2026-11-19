export {
  AuthContextProvider,
  getCurrentUserIdGlobal,
  getIdTokenGlobal,
  getDebugUserInfoHeaderGlobal,
  useAuthContext,
  getIdTokenExpirationTimeGlobal,
} from './AuthContext';
export {getIdTokenValidityStatus, isLoggedInAuthenticationType} from './utils';
export type {
  AuthStateChangeListenerCallback,
  AuthStatus,
  ConfirmationErrorCode,
  PhoneSignInErrorCode,
  EmailSignInErrorCode,
  VippsSignInErrorCode,
  AuthenticationType,
} from './types';
export {useUpdateIntercomOnUserChange} from './use-update-intercom-on-user-change';
export {
  useRefreshIdTokenWhenNecessary,
  isIdTokenRefreshEnabled,
} from './use-refresh-id-token-when-necessary';
export {useOnAuthStateChanged} from './use-subscribe-to-auth-user-change';
export {useAuthenticateVipps} from './use-authenticate-vipps';
export {
  authEmailCreate,
  authEmailLogIn,
  authEmailReset,
  authEmailResetConfirm,
  authEmailStart,
} from './auth-utils';
export {
  clearPendingEmailPassword,
  getPendingEmailPassword,
  isValidPassword,
  MIN_PASSWORD_LENGTH,
  setPendingEmailPassword,
} from './email-login-session';
