import {Dispatch} from 'react';
import {getAuth, signInWithCustomToken} from '@react-native-firebase/auth';
import Bugsnag from '@bugsnag/react-native';
import {
  AuthReducerAction,
  ConfirmationErrorCode,
  EmailSignInErrorCode,
} from './types';
import {
  authenticateWithSms,
  emailCreate,
  emailLogIn,
  emailReset,
  emailResetConfirm,
  emailStart,
  EmailStartResponse,
  verifySms,
} from '@atb/api/identity';
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

/**
 * Maps identity e-mail endpoint errors to error codes. See the "Step 1 API"
 * section in the identity repo's docs/auth-initiative-poc.md.
 */
const toEmailSignInErrorCode = (e: unknown): EmailSignInErrorCode => {
  const error = e as RequestError;
  if (!isErrorResponse(error)) return 'unknown_error';

  const status = error.http.code;
  const errorCode = errorDetailsToResponseData(error)?.error_code;
  switch (status) {
    case 400:
      if (errorCode === 'INVALID_CODE') return 'invalid_code';
      // No code stored, i.e. it expired or was used up
      if (errorCode === 'NOT_FOUND') return 'session_expired';
      if (errorCode === 'WEAK_PASSWORD') return 'weak_password';
      if (errorCode === 'BAD_REQUEST') return 'invalid_email';
      break;
    case 401:
      return 'wrong_credentials';
    case 403:
      if (errorCode === 'EMAIL_NOT_VERIFIED') return 'email_not_verified';
      break;
    case 409:
      return 'user_exists';
    case 429:
      return 'too_many_attempts';
  }

  notifyBugsnag('Unexpected response on e-mail login', {
    errorGroupHash: 'LoginEmail',
    metadata: {status, responseData: error.details},
  });
  return 'unknown_error';
};

type EmailResult<T> =
  | {data: T; error?: never}
  | {data?: never; error: EmailSignInErrorCode};

export const authEmailStart = async (
  email: string,
  language: Language,
): Promise<EmailResult<EmailStartResponse>> => {
  try {
    return {data: await emailStart(email, language)};
  } catch (e) {
    return {error: toEmailSignInErrorCode(e)};
  }
};

export const authEmailReset = async (
  email: string,
  language: Language,
): Promise<EmailSignInErrorCode | undefined> => {
  try {
    await emailReset(email, language);
  } catch (e) {
    return toEmailSignInErrorCode(e);
  }
};

const signInWithEmailToken = async (
  getToken: () => Promise<string>,
): Promise<EmailSignInErrorCode | undefined> => {
  let token: string;
  try {
    token = await getToken();
  } catch (e) {
    return toEmailSignInErrorCode(e);
  }
  return authSignInWithCustomToken(token);
};

export const authEmailCreate = (
  email: string,
  password: string,
  code: string,
) => signInWithEmailToken(() => emailCreate(email, password, code));

export const authEmailLogIn = (
  email: string,
  password: string,
  language: Language,
  code?: string,
) => signInWithEmailToken(() => emailLogIn(email, password, language, code));

export const authEmailResetConfirm = (
  email: string,
  code: string,
  newPassword: string,
) => signInWithEmailToken(() => emailResetConfirm(email, code, newPassword));

export const authSignInWithCustomToken = async (token: string) => {
  try {
    await signInWithCustomToken(getAuth(), token);
  } catch {
    return 'unknown_error';
  }
};
