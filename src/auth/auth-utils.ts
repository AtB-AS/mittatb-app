import {Dispatch} from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import Bugsnag from '@bugsnag/react-native';
import {AuthReducerAction, ConfirmationErrorCode} from './types';
import {authenticateWithSms, verifySms} from '@atb/api/identity';
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
  } catch (e: any) {
    const error = getAxiosErrorMetadata(e);
    if (error.responseStatus === 400) {
      const errorData = error.responseData && JSON.parse(error.responseData);
      if (errorData?.error_code === 'BAD_REQUEST') {
        return 'invalid_phone';
      }
    }
    if (error.responseStatus === 429) {
      return 'too_many_attempts';
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

export const authConfirmCode = async (
  code: string,
  phoneNumber?: string,
): Promise<undefined | ConfirmationErrorCode> => {
  if (!phoneNumber) return 'unknown_error';
  try {
    const token = await verifySms(phoneNumber, code);
    return await authSignInWithCustomToken(token);
  } catch (e) {
    const error = getAxiosErrorMetadata(e as any);
    const status = error.responseStatus;
    switch (status) {
      case 400:
        const errorData = error.responseData && JSON.parse(error.responseData);
        if (errorData?.error_code === 'INVALID_CODE') {
          return 'invalid_code';
        }
        if (errorData?.error_code === 'NOT_FOUND') {
          // 10 minutes passed since the code was sent
          return 'session_expired';
        }
        break;
      case 429:
        // 5 attempts to verify the code failed
        return 'too_many_attempts';
    }
    notifyBugsnag('Unexpected response on login OTP attempt', {
      errorGroupHash: 'LoginConfirmCode',
      metadata: {status, responseData: error.responseData, error: e},
    });
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
