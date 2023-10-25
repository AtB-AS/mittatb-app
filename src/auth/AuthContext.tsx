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
import {useFetchCustomerDataAfterUserChanged} from './use-fetch-customer-data-after-user-changed';
import {
  authConfirmCode,
  authSignInWithCustomToken,
  authSignInWithPhoneNumber,
} from './auth-utils';
import {useUpdateAuthLanguageOnChange} from './use-update-auth-language-on-change';
import {useCheckIfAccountCreationFinished} from './use-check-if-account-creation-finished';
import Bugsnag from '@bugsnag/react-native';

type AuthReducerState = {
  userId: string | undefined;
  authenticationType: AuthenticationType;
  phoneNumber: string | undefined;
  confirmationHandler: FirebaseAuthTypes.ConfirmationResult | undefined;
  /** Full abt customer id, which is the user id including prefix like "ABT:CustomerAccount:" */
  abtCustomerId: string | undefined;
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
      const sameUser = prevState.userId === action.userId;
      if (sameUser) {
        return {
          ...prevState,
          phoneNumber: action.phoneNumber,
          authenticationType: action.authenticationType,
        };
      } else {
        Bugsnag.leaveBreadcrumb('Auth user change', {userId: action.userId});
        return {
          userId: action.userId,
          phoneNumber: action.phoneNumber,
          authenticationType: action.authenticationType,
          confirmationHandler: undefined,
          abtCustomerId: undefined,
          customerNumber: undefined,
          authStatus: 'loading',
        };
      }
    }
    case 'SET_CUSTOMER_DATA': {
      const authStatus = action.customerNumber
        ? 'authenticated'
        : 'creating-account';
      Bugsnag.leaveBreadcrumb('Retrieved auth user data', {
        abtCustomerIdFull: action.abtCustomerIdFull,
        customerNumber: action.customerNumber,
        authStatus,
      });
      return {
        ...prevState,
        abtCustomerId: action.abtCustomerIdFull,
        customerNumber: action.customerNumber,
        authStatus,
      };
    }
    case 'SET_AUTH_STATUS': {
      Bugsnag.leaveBreadcrumb('Updating auth status', {
        authStatus: action.authStatus,
        customerNumber: action.customerNumber,
      });
      return {
        ...prevState,
        authStatus: action.authStatus,
        customerNumber: action.customerNumber,
      };
    }
  }
};

const initialReducerState: AuthReducerState = {
  userId: undefined,
  phoneNumber: undefined,
  authenticationType: 'none',
  confirmationHandler: undefined,
  abtCustomerIdFull: undefined,
  customerNumber: undefined,
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

  const {resubscribe} = useSubscribeToAuthUserChange(dispatch);
  useFetchCustomerDataAfterUserChanged(state.userId, dispatch);
  useCheckIfAccountCreationFinished(state.userId, state.authStatus, dispatch);

  useUpdateAuthLanguageOnChange();

  const retryAuth = useCallback(() => {
    if (state.authStatus === 'create-account-timeout') {
      dispatch({type: 'SET_AUTH_STATUS', authStatus: 'creating-account'});
    } else if (state.authStatus === 'loading') {
      resubscribe();
    }
  }, [state.authStatus, resubscribe]);

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
        authenticationType: state.authenticationType,
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
