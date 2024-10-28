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
} from './types';
import {
  authConfirmCode,
  authSignInWithCustomToken,
  authSignInWithPhoneNumber,
  legacyAuthConfirmCode,
  legacyAuthSignInWithPhoneNumber,
} from './auth-utils';
import {useUpdateAuthLanguageOnChange} from './use-update-auth-language-on-change';
import {useFetchIdTokenWithCustomClaims} from './use-fetch-id-token-with-custom-claims';
import Bugsnag from '@bugsnag/react-native';
import isEqual from 'lodash.isequal';
import {mapAuthenticationType} from './utils';
import {useClearQueriesOnUserChange} from './use-clear-queries-on-user-change';
import {useUpdateIntercomOnUserChange} from '@atb/auth/use-update-intercom-on-user-change';
import {useLocaleContext} from '@atb/LocaleProvider';
import {useRefreshIdTokenWhenNecessary} from '@atb/auth/use-refresh-id-token-when-necessary.ts';
import {useFeatureToggles} from '@atb/feature-toggles';

export type AuthReducerState = {
  authStatus: AuthStatus;
  user?: FirebaseAuthTypes.User;
  idTokenResult?: FirebaseAuthTypes.IdTokenResult;
  phoneNumberToBeVerified?: string;
  /** @deprecated Remove once legacy login is removed */
  confirmationHandler?: FirebaseAuthTypes.ConfirmationResult;
};

type AuthReducer = (
  prevState: AuthReducerState,
  action: AuthReducerAction,
) => AuthReducerState;

let idTokenGlobal: string | undefined = undefined;
export const getIdTokenGlobal = () => idTokenGlobal;

let currentUserIdGlobal: string | undefined = undefined;
export const getCurrentUserIdGlobal = () => currentUserIdGlobal;

const authReducer: AuthReducer = (prevState, action): AuthReducerState => {
  switch (action.type) {
    case 'SIGN_IN_INITIATED': {
      return {...prevState, phoneNumberToBeVerified: action.phoneNumber};
    }
    case 'LEGACY_SIGN_IN_INITIATED': {
      return {...prevState, confirmationHandler: action.confirmationHandler};
    }
    case 'SET_USER': {
      const sameUser = isEqual(action.user, prevState.user);
      if (sameUser) {
        return prevState;
      } else {
        Bugsnag.leaveBreadcrumb('Auth user change', {
          userId: action.user.uid,
          authType: mapAuthenticationType(action.user),
        });
        currentUserIdGlobal = action.user.uid;
        idTokenGlobal = undefined;
        return {user: action.user, authStatus: 'fetching-id-token'};
      }
    }
    case 'SET_ID_TOKEN': {
      const tokenSub = action.idTokenResult.claims['sub'];
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
      const customerNumber = action.idTokenResult.claims['customer_number'];
      const authStatus = customerNumber ? 'authenticated' : 'creating-account';
      Bugsnag.leaveBreadcrumb('Retrieved id token', {
        customerNumber,
        authStatus,
      });
      idTokenGlobal = action.idTokenResult.token;
      return {
        ...prevState,
        idTokenResult: action.idTokenResult,
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
  debug: {
    user?: FirebaseAuthTypes.User;
    idTokenResult?: FirebaseAuthTypes.IdTokenResult;
  };
};

const AuthContext = createContext<AuthContextState | undefined>(undefined);

export const AuthContextProvider = ({children}: PropsWithChildren<{}>) => {
  const {language} = useLocaleContext();
  const [state, dispatch] = useReducer(authReducer, initialReducerState);

  const {isBackendSmsAuthEnabled: backendSmsEnabled} = useFeatureToggles();

  const {resubscribe} = useSubscribeToAuthUserChange(dispatch);
  useClearQueriesOnUserChange(state);
  useFetchIdTokenWithCustomClaims(state, dispatch);
  useRefreshIdTokenWhenNecessary(state, dispatch);

  useUpdateAuthLanguageOnChange();
  useUpdateIntercomOnUserChange(state);

  const retryAuth = useCallback(() => {
    dispatch({type: 'RESET_AUTH_STATUS'});
    resubscribe();
  }, [resubscribe]);

  return (
    <AuthContext.Provider
      value={{
        authStatus: state.authStatus,
        userId: state.user?.uid,
        phoneNumber: state.user?.phoneNumber || undefined,
        customerNumber: state.idTokenResult?.claims['customer_number'],
        abtCustomerId: state.idTokenResult?.claims['abt_id'],
        signInWithPhoneNumber: useCallback(
          async (phoneNumberWithPrefix: string, forceResend?: boolean) => {
            if (!backendSmsEnabled) {
              return await legacyAuthSignInWithPhoneNumber(
                phoneNumberWithPrefix,
                forceResend,
                dispatch,
              );
            }
            return await authSignInWithPhoneNumber(
              phoneNumberWithPrefix,
              language,
              dispatch,
            );
          },
          [backendSmsEnabled, language],
        ),
        confirmCode: useCallback(
          (code: string) => {
            if (!backendSmsEnabled) {
              return legacyAuthConfirmCode(state.confirmationHandler, code);
            }
            return authConfirmCode(code, state.phoneNumberToBeVerified);
          },
          [
            state.phoneNumberToBeVerified,
            state.confirmationHandler,
            backendSmsEnabled,
          ],
        ),
        signOut: useCallback(async () => {
          await auth().signInAnonymously();
        }, []),
        authenticationType: mapAuthenticationType(state.user),
        signInWithCustomToken: useCallback(authSignInWithCustomToken, []),
        retryAuth,
        debug: {
          user: state.user,
          idTokenResult: state.idTokenResult,
        },
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
