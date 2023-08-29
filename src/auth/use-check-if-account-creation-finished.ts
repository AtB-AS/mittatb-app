import {Dispatch, useEffect} from 'react';
import {startAccountCreationFinishedCheck} from './auth-utils';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {AuthReducerAction, AuthStatus} from './types';

export const useCheckIfAccountCreationFinished = (
  user: FirebaseAuthTypes.User | null,
  authStatus: AuthStatus,
  dispatch: Dispatch<AuthReducerAction>,
) => {
  useEffect(() => {
    if (user && authStatus === 'creating-account') {
      const id = startAccountCreationFinishedCheck(user, dispatch);
      return () => clearInterval(id);
    }
  }, [user?.uid, authStatus]);
};
