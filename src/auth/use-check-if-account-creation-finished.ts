import {Dispatch, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import {AuthReducerAction, AuthStatus} from './types';
import Bugsnag from '@bugsnag/react-native';

/*
 * Check whether the user creation is finished up to 10 times with an interval
 * of 1 second.
 */
export const useCheckIfAccountCreationFinished = (
  userId: string | undefined,
  authStatus: AuthStatus,
  dispatch: Dispatch<AuthReducerAction>,
) => {
  useEffect(() => {
    if (userId && authStatus === 'creating-account') {
      const user = auth().currentUser;
      let retryCount = 0;
      const intervalId = setInterval(async () => {
        const idToken = await user?.getIdTokenResult(true);
        const customerNumber = idToken?.claims['customer_number'];
        if (customerNumber) {
          Bugsnag.leaveBreadcrumb(
            `Received custom claims after ${retryCount + 1} tries`,
          );
          dispatch({
            type: 'SET_AUTH_STATUS',
            authStatus: 'authenticated',
            customerNumber,
          });
          clearInterval(intervalId);
        } else if (retryCount >= 10) {
          Bugsnag.leaveBreadcrumb(`No custom claims received after 10 tries`);
          dispatch({
            type: 'SET_AUTH_STATUS',
            authStatus: 'create-account-timeout',
          });
          clearInterval(intervalId);
        } else {
          retryCount += 1;
        }
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [dispatch, userId, authStatus]);
};
