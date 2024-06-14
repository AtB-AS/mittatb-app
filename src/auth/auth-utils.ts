import {Dispatch} from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import Bugsnag from '@bugsnag/react-native';
import {AuthReducerAction} from './types';
import {TwilioStatus, authenticateWithSms, verifySms} from '@atb/api/identity';
import {Language} from '@atb/translations';
import {getAxiosErrorMetadata} from '@atb/api/utils';
import {notifyBugsnag} from '@atb/utils/bugsnag-utils';

const ERROR_INVALID_PHONE_NUMBER = 'auth/invalid-phone-number';
const ERROR_INVALID_CONFIRMATION_CODE = 'auth/invalid-verification-code';
const ERROR_SESSION_EXPIRED = 'auth/session-expired';
const ERROR_CODE_EXPIRED = 'auth/code-expired';

export const legacyAuthSignInWithPhoneNumber = async (
  phoneNumberWithPrefix: string,
  forceResend: boolean = false,
  dispatch: Dispatch<AuthReducerAction>,
) => {
  try {
    const confirmationHandler = await auth().signInWithPhoneNumber(
      phoneNumberWithPrefix,
      forceResend,
    );
    dispatch({type: 'LEGACY_SIGN_IN_INITIATED', confirmationHandler});
  } catch (error) {
    if (isAuthError(error) && error.code === ERROR_INVALID_PHONE_NUMBER) {
      return 'invalid_phone';
    }
    Bugsnag.notify(error as any);
    return 'unknown_error';
  }
};

export const authSignInWithPhoneNumber = async (
  phoneNumberWithPrefix: string,
  language: Language,
  dispatch: Dispatch<AuthReducerAction>,
) => {
  try {
    await authenticateWithSms(phoneNumberWithPrefix, language);
    dispatch({type: 'SIGN_IN_INITIATED', phoneNumber: phoneNumberWithPrefix});
  } catch (error: any) {
    if (getAxiosErrorMetadata(error).responseStatus === 400) {
      return 'invalid_phone';
    }
    Bugsnag.notify(error as any);
    return 'unknown_error';
  }
};

export const legacyAuthConfirmCode = async (
  confirmationResult: FirebaseAuthTypes.ConfirmationResult | undefined,
  code: string,
) => {
  try {
    await confirmationResult?.confirm(code);
  } catch (error) {
    if (isAuthError(error))
      switch (error.code) {
        case ERROR_INVALID_CONFIRMATION_CODE:
          return 'invalid_code';
        case ERROR_CODE_EXPIRED:
        case ERROR_SESSION_EXPIRED:
          return 'session_expired';
      }
    Bugsnag.notify(error as any);
    return 'unknown_error';
  }
};

export const authConfirmCode = async (code: string, phoneNumber?: string) => {
  if (!phoneNumber) return 'unknown_error';
  try {
    const {token, status} = await verifySms(phoneNumber, code);
    if (token) {
      return await authSignInWithCustomToken(token);
    }
    switch (status) {
      case TwilioStatus.APPROVED:
        return;
      case TwilioStatus.PENDING:
        return 'invalid_code';
      case TwilioStatus.CANCELED:
      case TwilioStatus.EXPIRED:
        return 'session_expired';
      case TwilioStatus.MAX_ATTEMPTS_REACHED:
        return 'unknown_error';
      case TwilioStatus.FAILED:
      case TwilioStatus.DELETED:
      default:
        notifyBugsnag('Unexpected status on login OTP attempt', {
          errorGroupHash: 'LoginConfirmCode',
          metadata: {status},
        });
        return 'unknown_error';
    }
  } catch (error) {
    Bugsnag.notify(error as any);
    return 'unknown_error';
  }
};

export const authSignInWithCustomToken = async (token: string) => {
  try {
    await auth().signInWithCustomToken(token);
  } catch (err) {
    return 'unknown_error';
  }
};

export const isAuthError = (
  error: any,
): error is FirebaseAuthTypes.NativeFirebaseAuthError => 'code' in error;
