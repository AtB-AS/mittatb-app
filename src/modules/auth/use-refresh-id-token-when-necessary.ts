import {Dispatch} from 'react';
import {AuthReducerAction} from './types';
import {AuthReducerState} from './AuthContext';
import {secondsToTokenExpiry} from './utils';
import {useInterval} from '@atb/utils/use-interval';
import {errorToMetadata, logToBugsnag} from '@atb/utils/bugsnag-utils';
import {ONE_SECOND_MS} from '@atb/utils/durations';

export const useRefreshIdTokenWhenNecessary = (
  state: AuthReducerState,
  dispatch: Dispatch<AuthReducerAction>,
) => {
  const disableInterval = state.authStatus !== 'authenticated';

  useInterval(
    async () => {
      if (state.user && state.idTokenResult) {
        const secondsToExpiry = secondsToTokenExpiry(
          state.idTokenResult.expirationTime,
        );
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
