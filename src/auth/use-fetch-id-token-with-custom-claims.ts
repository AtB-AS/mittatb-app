import {Dispatch, useEffect} from 'react';
import {AuthReducerAction} from './types';
import {AuthReducerState} from '@atb/auth/AuthContext';
import {useQuery} from '@tanstack/react-query';
import {logToBugsnag, notifyBugsnag} from '@atb/utils/bugsnag-utils';

const RETRY_COUNT = 3;

/**
 * Variable signalling whether the next fetch id token request should be force
 * refreshed or not. The first request should not be force refreshed, but
 * retries should.
 */
let shouldForceRefresh = false;

/**
 * Fetch the id token for the user. The id token is only "accepted" if it
 * contains custom claims (checked by looking up the 'customer-number' claim).
 *
 * If the custom claim is not present on the id token, or fetching fails, it
 * will try to force refresh id token up to 3 times with a linear backoff
 * starting at 3 seconds.
 */
export const useFetchIdTokenWithCustomClaims = (
  state: AuthReducerState,
  dispatch: Dispatch<AuthReducerAction>,
) => {
  useEffect(() => {
    shouldForceRefresh = false;
  }, [state.user]);

  const query = useQuery({
    queryKey: ['FETCH_ID_TOKEN'],
    queryFn: async () => {
      logToBugsnag(
        `Fetching id token with force refresh ${
          shouldForceRefresh ? 'on' : 'off'
        }`,
      );
      const idToken = await state.user?.getIdTokenResult(shouldForceRefresh); // Force refresh from server if retry
      const isMissingCustomClaims = !idToken?.claims['customer_number'];
      if (isMissingCustomClaims) {
        shouldForceRefresh = true;
        throw new Error("Token doesn't contain custom claims");
      }
      return idToken;
    },
    enabled: state.authStatus === 'fetching-id-token',
    retry: RETRY_COUNT,
    retryDelay: (attempt) => (attempt + 1) * 3000,
  });

  useEffect(() => {
    if (query.data) {
      dispatch({type: 'SET_ID_TOKEN', idToken: query.data});
    }
  }, [dispatch, query.data]);

  useEffect(() => {
    if (query.error) {
      notifyBugsnag(query.error as any, {
        errorGroupHash: 'AuthError',
        metadata: {
          description: `No id token with custom claims received after ${RETRY_COUNT} retries`,
        },
      });
      dispatch({type: 'SET_FETCH_ID_TOKEN_TIMEOUT'});
    }
  }, [dispatch, query.error]);
};
