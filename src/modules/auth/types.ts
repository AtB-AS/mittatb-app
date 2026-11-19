import {IdTokenResult, User} from '@react-native-firebase/auth';

export type AuthenticationType = 'none' | 'anonymous' | 'phone' | 'email';

export type AuthStatus =
  | 'loading'
  | 'fetching-id-token'
  | 'authenticated'
  | 'fetch-id-token-timeout';

export type AuthReducerAction =
  | {type: 'SIGN_IN_INITIATED'; phoneNumber: string}
  | {type: 'SET_USER'; user: User}
  | {type: 'SET_ID_TOKEN'; idTokenResult: IdTokenResult}
  | {type: 'SET_FETCH_ID_TOKEN_TIMEOUT'}
  | {type: 'RETRY_FETCH_ID_TOKEN'}
  | {type: 'RESET_AUTH_STATUS'};

export type ConfirmationErrorCode =
  | 'invalid_code'
  | 'unknown_error'
  | 'session_expired'
  | 'too_many_attempts';
export type PhoneSignInErrorCode =
  | 'invalid_phone'
  | 'unknown_error'
  | 'too_many_attempts';
export type EmailSignInErrorCode =
  | 'invalid_email'
  | 'wrong_credentials'
  | 'email_not_verified'
  | 'weak_password'
  | 'invalid_code'
  | 'session_expired'
  | 'user_exists'
  | 'too_many_attempts'
  | 'unknown_error';
export type VippsSignInErrorCode =
  | 'access_denied'
  | 'outdated_app_version'
  | 'unknown_error';

export type AuthStateChangeListenerCallback = (user: User | null) => void;
