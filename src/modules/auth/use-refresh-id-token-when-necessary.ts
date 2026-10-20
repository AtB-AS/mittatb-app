import {Dispatch, useEffect, useRef} from 'react';
import {AuthReducerAction, AuthStatus} from './types';
import {AuthReducerState} from './AuthContext';
import {secondsToTokenExpiry} from './utils';
import {useInterval} from '@atb/utils/use-interval';
import {useAppStateStatus} from '@atb/utils/use-app-state-status';
import {errorToMetadata, logToBugsnag} from '@atb/utils/bugsnag-utils';
import {ONE_SECOND_MS} from '@atb/utils/durations';

const REFRESH_INTERVAL_SECONDS = 30;
const MAX_BACKOFF_SECONDS = 10 * 60;

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

  // Backoff after rate limited refreshes. Uses timestamps so that time spent
  // in the background counts towards the wait.
  const failedRefreshCountRef = useRef(0);
  const nextAttemptAtMsRef = useRef(0);
  useEffect(() => {
    failedRefreshCountRef.current = 0;
    nextAttemptAtMsRef.current = 0;
  }, [state.user]);

  useInterval(
    async () => {
      const {user, idTokenResult: currentIdTokenResult} = stateRef.current;
      if (user && currentIdTokenResult) {
        const secondsToExpiry = secondsToTokenExpiry(
          currentIdTokenResult.expirationTime,
        );
        if (secondsToExpiry < 300) {
          if (isBackingOff(nextAttemptAtMsRef.current)) return;
          try {
            const idTokenResult = await user.getIdTokenResult(true);
            failedRefreshCountRef.current = 0;
            dispatch({type: 'SET_ID_TOKEN', idTokenResult});
          } catch (err) {
            // Only back off when Firebase is rate limiting us, so other errors
            // (e.g. network) still retry on the next tick.
            if (isTooManyRequestsError(err)) {
              failedRefreshCountRef.current++;
              nextAttemptAtMsRef.current =
                Date.now() +
                getBackoffSeconds(failedRefreshCountRef.current) *
                  ONE_SECOND_MS;
            } else {
              failedRefreshCountRef.current = 0;
              nextAttemptAtMsRef.current = 0;
            }
            logToBugsnag(
              'Error when refreshing id token',
              errorToMetadata(err),
            );
          }
        }
      }
    },
    [dispatch],
    REFRESH_INTERVAL_SECONDS * ONE_SECOND_MS,
    disableInterval,
    true,
  );
};

const isTooManyRequestsError = (err: unknown) =>
  (err as {code?: unknown} | undefined)?.code === 'auth/too-many-requests';

/**
 * Doubles the wait between retries for each consecutive failure, starting at
 * one interval (30s, 60s, 120s, ...), capped at MAX_BACKOFF_SECONDS.
 */
const getBackoffSeconds = (failedRefreshCount: number) =>
  Math.min(
    REFRESH_INTERVAL_SECONDS * 2 ** (failedRefreshCount - 1),
    MAX_BACKOFF_SECONDS,
  );

/**
 * If the remaining wait is longer than the max backoff, the device clock has
 * been set back, so the backoff is ignored to avoid waiting indefinitely.
 */
const isBackingOff = (nextAttemptAtMs: number) => {
  const remainingMs = nextAttemptAtMs - Date.now();
  return remainingMs > 0 && remainingMs <= MAX_BACKOFF_SECONDS * ONE_SECOND_MS;
};

export const isIdTokenRefreshEnabled = (authStatus: AuthStatus) => {
  return authStatus === 'authenticated';
};
