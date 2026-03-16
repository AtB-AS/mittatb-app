import {Dispatch} from 'react';
import auth from '@react-native-firebase/auth';
import Bugsnag from '@bugsnag/react-native';
import {AuthReducerAction, ConfirmationErrorCode} from './types';
import {authenticateWithSms, verifySms} from '@atb/api/identity';
import {Language} from '@atb/translations';
import {
  isErrorResponse,
  errorDetailsToResponseData,
  RequestError,
} from '@atb/api/utils';
import {notifyBugsnag} from '@atb/utils/bugsnag-utils';

export const authSignInWithPhoneNumber = async (
  phoneNumberWithPrefix: string,
  language: Language,
  dispatch: Dispatch<AuthReducerAction>,
) => {
  try {
    await authenticateWithSms(phoneNumberWithPrefix, language);
    dispatch({type: 'SIGN_IN_INITIATED', phoneNumber: phoneNumberWithPrefix});
  } catch (e: any) {
    const error = e as RequestError;
    if (isErrorResponse(error) && error.http.code === 400) {
      const errorData = errorDetailsToResponseData(error);
      if (errorData?.error_code === 'BAD_REQUEST') {
        return 'invalid_phone';
      }
    }
    if (isErrorResponse(error) && error.http.code === 429) {
      return 'too_many_attempts';
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
    const error = e as RequestError;

    if (isErrorResponse(error)) {
      const status = error.http.code;
      switch (status) {
        case 400:
          const responseData = errorDetailsToResponseData(error);
          if (responseData?.error_code === 'INVALID_CODE') {
            return 'invalid_code';
          }
          if (responseData?.error_code === 'NOT_FOUND') {
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
        metadata: {status, responseData: error.details, error: e},
      });
    }

    return 'unknown_error';
  }
};

export const authSignInWithCustomToken = async (token: string) => {
  try {
    await auth().signInWithCustomToken(token);
  } catch {
    return 'unknown_error';
  }
};
