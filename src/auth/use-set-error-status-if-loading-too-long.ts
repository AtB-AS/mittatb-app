import {Dispatch, useEffect} from 'react';
import {AuthReducerAction, AuthStatus} from './types';

export const useSetErrorStatusIfLoadingTooLong = (
  authStatus: AuthStatus,
  dispatch: Dispatch<AuthReducerAction>,
) => {
  useEffect(() => {
    if (authStatus === 'loading') {
      const id = setTimeout(
        () => dispatch({type: 'SET_AUTH_STATUS', authStatus: 'error'}),
        10000,
      );
      return () => clearTimeout(id);
    }
  }, [authStatus]);
};
