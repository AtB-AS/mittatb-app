import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useReducer,
} from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {useSubscribeToAuthUserChange} from './use-subscribe-to-auth-user-change';
import {
  AuthenticationType,
  AuthReducerAction,
  AuthStatus,
  ConfirmationErrorCode,
  PhoneSignInErrorCode,
  VippsSignInErrorCode,
} from '@atb/auth/types';
import {
  authConfirmCode,
  authSignInWithCustomToken,
  authSignInWithPhoneNumber,
} from './auth-utils';
import {useUpdateAuthLanguageOnChange} from './use-update-auth-language-on-change';
import {useFetchIdTokenWithCustomClaims} from './use-fetch-id-token-with-custom-claims';
import Bugsnag from '@bugsnag/react-native';
import isEqual from 'lodash.isequal';
import {mapAuthenticationType} from '@atb/auth/utils';

export type AuthReducerState = {
  authStatus: AuthStatus;
  user?: FirebaseAuthTypes.User;
  idToken?: FirebaseAuthTypes.IdTokenResult;
  confirmationHandler?: FirebaseAuthTypes.ConfirmationResult;
};

type AuthReducer = (
  prevState: AuthReducerState,
  action: AuthReducerAction,
) => AuthReducerState;

const authReducer: AuthReducer = (prevState, action): AuthReducerState => {
  switch (action.type) {
    case 'SIGN_IN_INITIATED': {
      return {...prevState, confirmationHandler: action.confirmationHandler};
    }
    case 'SET_USER': {
      const sameUser = isEqual(action.user, prevState.user);
      if (sameUser) {
        return prevState;
      } else {
        Bugsnag.leaveBreadcrumb('Auth user change', {userId: action.user.uid});
        return {user: action.user, authStatus: 'fetching-id-token'};
      }
    }
    case 'SET_ID_TOKEN': {
      const tokenSub = action.idToken.claims['sub'];
      if (tokenSub !== prevState.user?.uid) {
        /*
        This is a precaution against race conditions. It might be that there has
        been a user change between the time when the async fetch id token
        operation was triggered, and when the response was actually returned.
         */
        Bugsnag.leaveBreadcrumb(
          'The fetched id token is not for the logged in user',
          {
            tokenSub,
            userId: prevState.user?.uid,
          },
        );
        return prevState;
      }
      const customerNumber = action.idToken.claims['customer_number'];
      const authStatus = customerNumber ? 'authenticated' : 'creating-account';
      Bugsnag.leaveBreadcrumb('Retrieved id token', {
        customerNumber,
        authStatus,
      });
      return {
        ...prevState,
        idToken: action.idToken,
        authStatus: 'authenticated',
      };
    }
    case 'SET_FETCH_ID_TOKEN_TIMEOUT': {
      Bugsnag.leaveBreadcrumb('Fetch id token with custom claims timeout');
      return {...prevState, authStatus: 'fetch-id-token-timeout'};
    }
    case 'RETRY_FETCH_ID_TOKEN': {
      Bugsnag.leaveBreadcrumb(
        'Retry fetching id token with custom claims timeout',
      );
      return {...prevState, authStatus: 'fetching-id-token'};
    }
    case 'RESET_AUTH_STATUS': {
      Bugsnag.leaveBreadcrumb('Auth status reset');
      return {authStatus: 'loading'};
    }
  }
};

const initialReducerState: AuthReducerState = {
  authStatus: 'loading',
};

type AuthContextState = {
  authStatus: AuthStatus;
  userId?: string;
  phoneNumber?: string;
  customerNumber?: number;
  abtCustomerId?: string;
  signInWithPhoneNumber: (
    number: string,
    forceResend?: boolean,
  ) => Promise<PhoneSignInErrorCode | undefined>;
  signOut: () => Promise<void>;
  confirmCode: (code: string) => Promise<ConfirmationErrorCode | undefined>;
  authenticationType: AuthenticationType;
  signInWithCustomToken: (
    token: string,
  ) => Promise<VippsSignInErrorCode | undefined>;
  retryAuth: () => void;
};

const AuthContext = createContext<AuthContextState | undefined>(undefined);

export const AuthContextProvider = ({children}: PropsWithChildren<{}>) => {
  const [state, dispatch] = useReducer(authReducer, initialReducerState);

  const {resubscribe} = useSubscribeToAuthUserChange(dispatch);
  useFetchIdTokenWithCustomClaims(state, dispatch);

  useUpdateAuthLanguageOnChange();

  const retryAuth = useCallback(() => {
    if (state.authStatus === 'fetch-id-token-timeout') {
      dispatch({type: 'RETRY_FETCH_ID_TOKEN'});
    } else if (state.authStatus === 'loading') {
      dispatch({type: 'RESET_AUTH_STATUS'});
      resubscribe();
    }
  }, [state.authStatus, resubscribe]);

  return (
    <AuthContext.Provider
      value={{
        authStatus: state.authStatus,
        userId: state.user?.uid,
        phoneNumber: state.user?.phoneNumber || undefined,
        customerNumber: state.idToken?.claims['customer_number'],
        abtCustomerId: state.idToken?.claims['abt_id'],
        signInWithPhoneNumber: useCallback(
          async (phoneNumberWithPrefix: string, forceResend?: boolean) =>
            authSignInWithPhoneNumber(
              phoneNumberWithPrefix,
              forceResend,
              dispatch,
            ),
          [],
        ),
        confirmCode: useCallback(
          (code: string) => authConfirmCode(state.confirmationHandler, code),
          [state.confirmationHandler],
        ),
        signOut: useCallback(async () => {
          await auth().signInAnonymously();
        }, []),
        authenticationType: mapAuthenticationType(state.user),
        signInWithCustomToken: useCallback(authSignInWithCustomToken, []),
        retryAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuthState() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthState must be used within a AuthContextProvider');
  }
  return context;
}

if (__DEV__) {
  tryUseAuthEmulator();
}

async function tryUseAuthEmulator() {
  try {
    const isAlive = await fetch('http://localhost:9099');
    if (isAlive.ok) {
      auth().useEmulator('http://localhost:9099');
      console.warn(
        'Running Firebase Auth on local emulator (found localhost:9099)',
      );
    }
  } catch {}
}
