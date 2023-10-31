import {Dispatch, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import {updateMetadata} from '@atb/chat/metadata';
import {AuthReducerAction} from './types';
import {mapAuthenticationType} from './utils';
import Bugsnag from '@bugsnag/react-native';
import {useResubscribeToggle} from '@atb/utils/use-resubscribe-toggle';

export const useSubscribeToAuthUserChange = (
  dispatch: Dispatch<AuthReducerAction>,
) => {
  const {resubscribeToggle, resubscribe} = useResubscribeToggle();

  useEffect(() => {
    Bugsnag.leaveBreadcrumb('Subscribing to auth user changes');
    dispatch({type: 'SET_AUTH_STATUS', authStatus: 'loading'});
    let signInInitiated = false;
    const unsubscribe = auth().onUserChanged((user) => {
      if (user) {
        updateMetadata({
          'AtB-Firebase-Auth-Id': user?.uid,
          'AtB-Auth-Type': mapAuthenticationType(user),
        });
        dispatch({
          type: 'SET_USER',
          userId: user?.uid,
          phoneNumber: user?.phoneNumber || undefined,
          authenticationType: mapAuthenticationType(user),
        });
      } else if (!signInInitiated) {
        /*
        Sign in anonymously if the onUserChanged event fired immediately on
        subscription did not include user data. In other words, user was not
        previously signed in.
         */
        auth()
          .signInAnonymously()
          .then(() => {
            signInInitiated = true;
          });
      }
    });
    return () => unsubscribe();
  }, [resubscribeToggle, dispatch]);

  return {
    resubscribe: resubscribe,
  };
};
