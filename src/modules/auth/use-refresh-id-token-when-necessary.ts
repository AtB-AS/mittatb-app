import {Dispatch, useEffect, useRef} from 'react';
import {AuthReducerAction, AuthStatus} from './types';
import {AuthReducerState} from './AuthContext';
import {secondsToTokenExpiry} from './utils';
import {useInterval} from '@atb/utils/use-interval';
import {useAppStateStatus} from '@atb/utils/use-app-state-status';
import {errorToMetadata, logToBugsnag} from '@atb/utils/bugsnag-utils';
import {ONE_SECOND_MS} from '@atb/utils/durations';

export const useRefreshIdTokenWhenNecessary = (
  state: AuthReducerState,
  dispatch: Dispatch<AuthReducerAction>,
) => {
  const appStateStatus = useAppStateStatus();
  const disableInterval =
    !isIdTokenRefreshEnabled(state.authStatus) || appStateStatus !== 'active';

  // Read state through a ref, so that a new id token (e.g. from our own
  // refresh) doesn't restart the interval and trigger an immediate re-check.
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useInterval(
    async () => {
      const {user, idTokenResult: currentIdTokenResult} = stateRef.current;
      if (user && currentIdTokenResult) {
        const secondsToExpiry = secondsToTokenExpiry(
          currentIdTokenResult.expirationTime,
        );
        if (secondsToExpiry < 300) {
          try {
            const idTokenResult = await user.getIdTokenResult(true);
            dispatch({type: 'SET_ID_TOKEN', idTokenResult});
          } catch (err) {
            logToBugsnag(
              'Error when refreshing id token',
              errorToMetadata(err),
            );
          }
        }
      }
    },
    [dispatch],
    30 * ONE_SECOND_MS,
    disableInterval,
    true,
  );
};

export const isIdTokenRefreshEnabled = (authStatus: AuthStatus) => {
  return authStatus === 'authenticated';
};
