import {FirebaseAuthTypes} from '@react-native-firebase/auth';

export type AuthenticationType = 'none' | 'anonymous' | 'phone';

export type AuthStatus =
  | 'loading'
  | 'fetching-id-token'
  | 'authenticated'
  | 'fetch-id-token-timeout';

export type AuthReducerAction =
  | {type: 'SIGN_IN_INITIATED'; phoneNumber: string}
  | {
      type: 'LEGACY_SIGN_IN_INITIATED';
      confirmationHandler: FirebaseAuthTypes.ConfirmationResult;
    }
  | {type: 'SET_USER'; user: FirebaseAuthTypes.User}
  | {type: 'SET_ID_TOKEN'; idTokenResult: FirebaseAuthTypes.IdTokenResult}
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
export type VippsSignInErrorCode =
  | 'access_denied'
  | 'outdated_app_version'
  | 'unknown_error';

export type AuthStateChangeListenerCallback = (
  user: FirebaseAuthTypes.User | null,
) => void;
