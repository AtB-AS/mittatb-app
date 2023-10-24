import {Dispatch, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import {updateMetadata} from '@atb/chat/metadata';
import {AuthReducerAction} from './types';
import {getAuthenticationType} from './utils';
import {useResubscribeToggle} from '@atb/utils/use-resubscribe-toggle';

export const useSubscribeToAuthUserChange = (
  dispatch: Dispatch<AuthReducerAction>,
) => {
  const {resubscribeToggle, resubscribe} = useResubscribeToggle();

  useEffect(() => {
    dispatch({type: 'SET_AUTH_STATUS', authStatus: 'loading'});
    const unsubscribe = auth().onUserChanged((user) => {
      if (user) {
        updateMetadata({
          'AtB-Firebase-Auth-Id': user.uid,
          'AtB-Auth-Type': getAuthenticationType(user),
        });
        dispatch({type: 'SET_USER', user});
      } else {
        /*
        Sign in anonymously if the onUserChanged event fired immediately on
        subscription did not include user data. In other words, user was not
        previously signed in.
         */
        auth().signInAnonymously();
      }
    });
    return () => unsubscribe();
  }, [resubscribeToggle]);

  return {
    resubscribe: resubscribe,
  };
};
