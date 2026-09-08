import {Dispatch, useEffect} from 'react';
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
} from '@react-native-firebase/auth';
import {AuthReducerAction, AuthStateChangeListenerCallback} from './types';
import Bugsnag from '@bugsnag/react-native';
import {useResubscribeToggle} from '@atb/utils/use-resubscribe-toggle';

export const useSubscribeToAuthUserChange = (
  dispatch: Dispatch<AuthReducerAction>,
) => {
  const {resubscribeToggle, resubscribe} = useResubscribeToggle();

  useEffect(() => {
    Bugsnag.leaveBreadcrumb('Subscribing to auth user changes');
    let signInInitiated = false;
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        dispatch({type: 'SET_USER', user});
      } else if (!signInInitiated) {
        /*
        Sign in anonymously if the onUserChanged event fired immediately on
        subscription did not include user data. In other words, user was not
        previously signed in.
         */
        Bugsnag.leaveBreadcrumb('Signing-in anonymously');
        signInAnonymously(getAuth()).then(() => {
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

export const useOnAuthStateChanged = (
  callback: AuthStateChangeListenerCallback,
) => {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), callback);
    return () => unsubscribe();
  }, [callback]);
};
