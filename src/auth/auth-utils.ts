import {Dispatch} from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import Bugsnag from '@bugsnag/react-native';
import {AuthReducerAction} from './types';

const ERROR_INVALID_PHONE_NUMBER = 'auth/invalid-phone-number';
const ERROR_INVALID_CONFIRMATION_CODE = 'auth/invalid-verification-code';
const ERROR_SESSION_EXPIRED = 'auth/session-expired';
const ERROR_CODE_EXPIRED = 'auth/code-expired';

export const authSignInWithPhoneNumber = async (
  phoneNumberWithPrefix: string,
  forceResend: boolean = false,
  dispatch: Dispatch<AuthReducerAction>,
) => {
  try {
    const confirmationHandler = await auth().signInWithPhoneNumber(
      phoneNumberWithPrefix,
      forceResend,
    );
    dispatch({type: 'SIGN_IN_INITIATED', confirmationHandler});
  } catch (error) {
    if (isAuthError(error) && error.code === ERROR_INVALID_PHONE_NUMBER) {
      return 'invalid_phone';
    }
    Bugsnag.notify(error as any);
    return 'unknown_error';
  }
};

export const authConfirmCode = async (
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

export const authSignInWithCustomToken = async (token: string) => {
  try {
    await auth().signInWithCustomToken(token);
  } catch (err) {
    return 'unknown_error';
  }
};

/*
 * Check whether the user creation is finished up to 10 times with an interval
 * of 1 second.
 */
export const startAccountCreationFinishedCheck = (
  user: FirebaseAuthTypes.User | null,
  dispatch: Dispatch<AuthReducerAction>,
) => {
  let retryCount = 0;
  const intervalId = setInterval(async () => {
    const idToken = await user?.getIdTokenResult(true);
    const customerNumber = idToken?.claims['customer_number'];
    if (customerNumber) {
      dispatch({
        type: 'SET_ACCOUNT_CREATION_FINISHED',
        customerNumber,
      });
      clearInterval(intervalId);
    } else if (retryCount >= 10) {
      dispatch({type: 'SET_AUTH_ERROR'});
      clearInterval(intervalId);
    } else {
      retryCount += 1;
    }
  }, 1000);
  return intervalId;
};

export const isAuthError = (
  error: any,
): error is FirebaseAuthTypes.NativeFirebaseAuthError => 'code' in error;
