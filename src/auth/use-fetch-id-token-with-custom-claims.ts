import {Dispatch, useEffect} from 'react';
import {AuthReducerAction} from './types';
import {AuthReducerState} from '@atb/auth/AuthContext';
import {useQuery} from '@tanstack/react-query';
import {
  errorToMetadata,
  logToBugsnag,
  notifyBugsnag,
} from '@atb/utils/bugsnag-utils';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {useRemoteConfigContext} from '@atb/RemoteConfigContext.tsx';

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

  const {fetch_id_token_retry_count: retryCount} = useRemoteConfigContext();

  const query = useQuery({
    queryKey: ['FETCH_ID_TOKEN'],
    queryFn: async () => {
      logToBugsnag(
        `Fetching id token with force refresh ${
          shouldForceRefresh ? 'on' : 'off'
        }`,
      );

      let idToken: FirebaseAuthTypes.IdTokenResult;
      try {
        idToken = await state.user!.getIdTokenResult(shouldForceRefresh); // Force refresh from server if retry
      } catch (err) {
        logToBugsnag('Error when fetching id token', errorToMetadata(err));
        throw err;
      }
      const isMissingCustomClaims = !idToken?.claims['customer_number'];
      if (isMissingCustomClaims) {
        const errMsg = 'Fetched id token, but custom claims are missing';
        logToBugsnag(errMsg);
        shouldForceRefresh = true;
        throw new Error(errMsg);
      }
      return idToken;
    },
    enabled: !!state.user && state.authStatus === 'fetching-id-token',
    retry: retryCount,
    retryDelay: (attempt) => (attempt + 1) * 2000,
  });

  useEffect(() => {
    if (query.data) {
      dispatch({type: 'SET_ID_TOKEN', idTokenResult: query.data});
    }
  }, [dispatch, query.data]);

  useEffect(() => {
    if (query.error) {
      notifyBugsnag(
        `No id token with custom claims received after ${
          query.failureCount - 1
        } retries`,
        {
          errorGroupHash: 'AuthError',
          metadata: errorToMetadata(query.error),
        },
      );
      dispatch({type: 'SET_FETCH_ID_TOKEN_TIMEOUT'});
    }
  }, [dispatch, query.error, query.failureCount]);
};
