import {Dispatch, useEffect} from 'react';
import {AuthReducerAction} from './types';
import Bugsnag from '@bugsnag/react-native';
import {AuthReducerState} from '@atb/auth/AuthContext';

/*
 * Fetch the id token for the user. The id token is only "accepted" if it
 * contains custom claims (checked by looking up the 'customer-number' claim).
 *
 * If the custom claim is not present on the id token, it will try to force
 * refetch up to 10 times with an interval of 1 second.
 */
export const useFetchIdTokenWithCustomClaims = (
  state: AuthReducerState,
  dispatch: Dispatch<AuthReducerAction>,
) => {
  useEffect(() => {
    if (state.authStatus === 'fetching-id-token') {
      let retryCount = 0;
      const intervalId = setInterval(async () => {
        const idToken = await state.user?.getIdTokenResult(!!retryCount); // First try without force refresh from server
        if (idToken?.claims['customer_number']) {
          Bugsnag.leaveBreadcrumb(
            `Received id token with custom claims after ${
              retryCount + 1
            } tries`,
          );
          dispatch({type: 'SET_ID_TOKEN', idToken});
          clearInterval(intervalId);
        } else if (retryCount >= 10) {
          Bugsnag.leaveBreadcrumb(
            `No id token with custom claims received after 10 tries`,
          );
          dispatch({type: 'SET_FETCH_ID_TOKEN_TIMEOUT'});
          clearInterval(intervalId);
        } else {
          retryCount += 1;
        }
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [state.user, state.authStatus, dispatch]);
};
