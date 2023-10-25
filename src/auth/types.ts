import {FirebaseAuthTypes} from '@react-native-firebase/auth';

export type AuthenticationType = 'none' | 'anonymous' | 'phone';

export type AuthStatus =
  | 'loading'
  | 'creating-account'
  | 'authenticated'
  | 'create-account-timeout';

export type AuthReducerAction =
  | {
      type: 'SIGN_IN_INITIATED';
      confirmationHandler: FirebaseAuthTypes.ConfirmationResult;
    }
  | {
      type: 'SET_USER';
      userId?: string;
      phoneNumber?: string;
      authenticationType: AuthenticationType;
    }
  | {
      type: 'SET_CUSTOMER_DATA';
      abtCustomerIdFull: string | undefined;
      customerNumber: number | undefined;
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
