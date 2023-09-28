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
  ConfirmationErrorCode,
  PhoneSignInErrorCode,
  AuthStatus,
  VippsSignInErrorCode,
  AuthReducerAction,
} from '@atb/auth/types';
import {getAuthenticationType} from './utils';
import {useFetchCustomerDataAfterUserChanged} from './use-fetch-customer-data-after-user-changed';
import {
  authConfirmCode,
  authSignInWithCustomToken,
  authSignInWithPhoneNumber,
} from './auth-utils';
import {useUpdateAuthLanguageOnChange} from './use-update-auth-language-on-change';
import {useCheckIfAccountCreationFinished} from './use-check-if-account-creation-finished';

type AuthReducerState = {
  user: FirebaseAuthTypes.User | null;
  confirmationHandler: FirebaseAuthTypes.ConfirmationResult | undefined;
  abtCustomerId: string | undefined;
  /** Full abt customer id, including prefix like "ABT:CustomerAccount:" */
  abtCustomerIdFull: string | undefined;
  customerNumber: number | undefined;
  authStatus: AuthStatus;
};

type AuthReducer = (
  prevState: AuthReducerState,
  action: AuthReducerAction,
) => AuthReducerState;

const authReducer: AuthReducer = (prevState, action): AuthReducerState => {
  switch (action.type) {
    case 'SIGN_IN_INITIATED': {
      return {
        ...prevState,
        confirmationHandler: action.confirmationHandler,
      };
    }
    case 'SET_USER': {
      const sameUser = prevState.user?.uid === action.user?.uid;
      if (sameUser) {
        return {
          ...prevState,
          user: action.user,
        };
      } else {
        return {
          confirmationHandler: undefined,
          abtCustomerId: undefined,
          abtCustomerIdFull: undefined,
          customerNumber: undefined,
          user: action.user,
          authStatus: 'loading',
        };
      }
    }
    case 'SET_CUSTOMER_DATA': {
      return {
        ...prevState,
        abtCustomerId: action.abtCustomerId,
        abtCustomerIdFull: action.abtCustomerIdFull,
        customerNumber: action.customerNumber,
        /*
          If no customerNumber, this means the user was newly created in Firestore,
          but the asynchronous creation of the Entur account is not finished yet.
        */
        authStatus: action.customerNumber
          ? 'authenticated'
          : 'creating-account',
      };
    }
    case 'SET_AUTH_STATUS': {
      return {
        ...prevState,
        authStatus: action.authStatus,
        customerNumber: action.customerNumber,
      };
    }
  }
};

const initialReducerState: AuthReducerState = {
  confirmationHandler: undefined,
  abtCustomerId: undefined,
  abtCustomerIdFull: undefined,
  customerNumber: undefined,
  user: null,
  authStatus: 'loading',
};

type AuthContextState = {
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
} & Omit<AuthReducerState, 'confirmationHandler'>;

const AuthContext = createContext<AuthContextState | undefined>(undefined);

export const AuthContextProvider = ({children}: PropsWithChildren<{}>) => {
  const [state, dispatch] = useReducer(authReducer, initialReducerState);

  useSubscribeToAuthUserChange(dispatch);
  useFetchCustomerDataAfterUserChanged(state.user, dispatch);
  useCheckIfAccountCreationFinished(state.user, state.authStatus, dispatch);

  useUpdateAuthLanguageOnChange();

  const retryAuth = useCallback(() => {
    if (state.authStatus === 'create-account-timeout') {
      dispatch({type: 'SET_AUTH_STATUS', authStatus: 'creating-account'});
    }
  }, [state.user?.uid]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
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
        authenticationType: getAuthenticationType(state.user),
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
