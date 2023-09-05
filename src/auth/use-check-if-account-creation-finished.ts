import {Dispatch, useEffect} from 'react';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {AuthReducerAction, AuthStatus} from './types';

/*
 * Check whether the user creation is finished up to 10 times with an interval
 * of 1 second.
 */
export const useCheckIfAccountCreationFinished = (
  user: FirebaseAuthTypes.User | null,
  authStatus: AuthStatus,
  dispatch: Dispatch<AuthReducerAction>,
) => {
  useEffect(() => {
    if (user && authStatus === 'creating-account') {
      let retryCount = 0;
      const intervalId = setInterval(async () => {
        const idToken = await user?.getIdTokenResult(true);
        const customerNumber = idToken?.claims['customer_number'];
        if (customerNumber) {
          dispatch({
            type: 'SET_AUTH_STATUS',
            authStatus: 'authenticated',
            customerNumber,
          });
          clearInterval(intervalId);
        } else if (retryCount >= 10) {
          dispatch({type: 'SET_AUTH_STATUS', authStatus: 'error'});
          clearInterval(intervalId);
        } else {
          retryCount += 1;
        }
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [user?.uid, authStatus]);
};
