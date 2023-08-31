import {FirebaseAuthTypes} from '@react-native-firebase/auth';

export type AuthenticationType = 'none' | 'anonymous' | 'phone';

export type AuthStatus =
  | 'loading'
  | 'creating-account'
  | 'authenticated'
  | 'error';

export type AuthReducerAction =
  | {
      type: 'SIGN_IN_INITIATED';
      confirmationHandler: FirebaseAuthTypes.ConfirmationResult;
    }
  | {
      type: 'SET_USER';
      user: FirebaseAuthTypes.User | null;
    }
  | {
      type: 'SET_CUSTOMER_DATA';
      abtCustomerId: string | undefined;
      abtCustomerIdFull: string | undefined;
      customerNumber: number | undefined;
      authStatus: AuthStatus;
    }
  | {
      type: 'SET_AUTH_STATUS';
      authStatus: AuthStatus;
      customerNumber?: number;
    };

export type ConfirmationErrorCode =
  | 'invalid_code'
  | 'unknown_error'
  | 'session_expired';
export type PhoneSignInErrorCode = 'invalid_phone' | 'unknown_error';
export type VippsSignInErrorCode =
  | 'access_denied'
  | 'outdated_app_version'
  | 'unknown_error';
