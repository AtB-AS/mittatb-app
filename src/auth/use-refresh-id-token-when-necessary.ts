import {Dispatch} from 'react';
import {AuthReducerAction} from './types';
import {AuthReducerState} from '@atb/auth/AuthContext';
import {secondsToTokenExpiry} from '@atb/auth/utils.ts';
import {useAppStateStatus} from '@atb/utils/use-app-state-status.ts';
import {useInterval} from '@atb/utils/use-interval.ts';
import {errorToMetadata, logToBugsnag} from '@atb/utils/bugsnag-utils.ts';
import {ONE_SECOND_MS} from '@atb/utils/durations.ts';

export const useRefreshIdTokenWhenNecessary = (
  state: AuthReducerState,
  dispatch: Dispatch<AuthReducerAction>,
) => {
  const appState = useAppStateStatus();
  const disableInterval =
    appState !== 'active' || state.authStatus !== 'authenticated';

  useInterval(
    async () => {
      if (state.user && state.idTokenResult) {
        const secondsToExpiry = secondsToTokenExpiry(state.idTokenResult);
        if (secondsToExpiry < 300) {
          try {
            const idTokenResult = await state.user.getIdTokenResult(true);
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
    [dispatch, state.user, state.idTokenResult],
    30 * ONE_SECOND_MS,
    disableInterval,
    true,
  );
};
