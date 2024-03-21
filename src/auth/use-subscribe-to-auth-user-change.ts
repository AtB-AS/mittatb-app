import {Dispatch, useEffect} from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {updateMetadata} from '@atb/chat/metadata';
import {AuthReducerAction} from './types';
import {mapAuthenticationType} from './utils';
import Bugsnag from '@bugsnag/react-native';
import {useResubscribeToggle} from '@atb/utils/use-resubscribe-toggle';
//import {useOnboardingState} from '@atb/onboarding';

export const useSubscribeToAuthUserChange = (
  dispatch: Dispatch<AuthReducerAction>,
) => {
  const {resubscribeToggle, resubscribe} = useResubscribeToggle();
  //const {completeOnboardingSection} = useOnboardingState();

  useEffect(() => {
    Bugsnag.leaveBreadcrumb('Subscribing to auth user changes');
    let signInInitiated = false;
    const unsubscribe = auth().onAuthStateChanged((user) => {
      //!user?.isAnonymous && completeOnboardingSection('userCreation');
      if (user) {
        updateMetadata({
          'AtB-Firebase-Auth-Id': user?.uid,
          'AtB-Auth-Type': mapAuthenticationType(user),
        });
        dispatch({type: 'SET_USER', user});
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
  }, [resubscribeToggle, dispatch]); // completeOnboardingSection

  return {
    resubscribe: resubscribe,
  };
};

export const useOnAuthStateChanged = (
  callback: (user: FirebaseAuthTypes.User | null) => void,
) => {
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(callback);
    return () => unsubscribe();
  }, [callback]);
};
