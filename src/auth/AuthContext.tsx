import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {useTranslation} from '../translations';
import {updateMetadata} from '@atb/chat/metadata';

const ERROR_INVALID_PHONE_NUMBER = 'auth/invalid-phone-number';
const ERROR_INVALID_CONFIRMATION_CODE = 'auth/invalid-verification-code';

type AuthReducerState = {
  isAuthConnectionInitialized: boolean;
  confirmationHandler: FirebaseAuthTypes.ConfirmationResult | undefined;
  abtCustomerId: string | undefined;
  user: FirebaseAuthTypes.User | null;
};

type AuthReducerAction =
  | {
      type: 'SIGN_IN_INITIATED';
      confirmationHandler: FirebaseAuthTypes.ConfirmationResult;
    }
  | {
      type: 'SET_USER';
      user: FirebaseAuthTypes.User | null;
    }
  | {type: 'SET_ABT_CUSTOMER_ID'; abtCustomerId: string | undefined};

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
      return {
        ...prevState,
        isAuthConnectionInitialized: true,
        user: action.user,
      };
    }
    case 'SET_ABT_CUSTOMER_ID': {
      return {
        ...prevState,
        abtCustomerId: action.abtCustomerId,
      };
    }
  }
};

const initialReducerState: AuthReducerState = {
  isAuthConnectionInitialized: false,
  confirmationHandler: undefined,
  abtCustomerId: undefined,
  user: null,
};

type AuthenticationType = 'none' | 'anonymous' | 'phone';

const getAuthenticationType = (state: AuthReducerState): AuthenticationType => {
  if (state.user?.phoneNumber) return 'phone';
  else if (state.user?.isAnonymous) return 'anonymous';
  else return 'none';
};

export type ConfirmationErrorCode = 'invalid_code' | 'unknown_error';
export type PhoneSignInErrorCode = 'invalid_phone' | 'unknown_error';

type AuthContextState = {
  signInWithPhoneNumber: (
    number: string,
  ) => Promise<PhoneSignInErrorCode | undefined>;
  signOut: () => Promise<void>;
  confirmCode: (code: string) => Promise<ConfirmationErrorCode | undefined>;
  authenticationType: AuthenticationType;
} & AuthReducerState;

const AuthContext = createContext<AuthContextState | undefined>(undefined);

export default function AuthContextProvider({children}: PropsWithChildren<{}>) {
  const [state, dispatch] = useReducer(authReducer, initialReducerState);
  const {language} = useTranslation();

  const confirmCode = useCallback(
    async function confirmCode(code: string) {
      try {
        await state.confirmationHandler?.confirm(code);
      } catch (error) {
        if (error.code === ERROR_INVALID_CONFIRMATION_CODE) {
          return 'invalid_code';
        }
        console.warn(error);
        return 'unknown_error';
      }
    },
    [state.confirmationHandler],
  );

  useEffect(() => {
    if (language) auth().setLanguageCode(language);
  }, [language]);

  const onUserChanged = useCallback(
    async function (user: FirebaseAuthTypes.User | null) {
      if (user) updateMetadata({'AtB-Firebase-Auth-Id': user.uid});
      dispatch({type: 'SET_USER', user});
    },
    [dispatch],
  );

  // Refresh abt customer id from id token after logged in user changes
  useEffect(() => {
    (async function () {
      if (state.user) {
        const idToken = await state.user.getIdTokenResult();
        const abtCustomerId = idToken.claims['sub'];
        dispatch({type: 'SET_ABT_CUSTOMER_ID', abtCustomerId});
      }
    })();
  }, [state.user?.uid]);

  // Subscribe to user changes. Will fire a onChangeEvent immediately on subscription.
  useEffect(() => {
    const subscriber = auth().onUserChanged(onUserChanged);
    return subscriber;
  }, [onUserChanged]);

  const signInWithPhoneNumber = useCallback(
    async function signInWithPhoneNumber(phoneNumber: string) {
      try {
        const confirmationHandler = await auth().signInWithPhoneNumber(
          '+47' + phoneNumber,
        );
        dispatch({type: 'SIGN_IN_INITIATED', confirmationHandler});
      } catch (error) {
        if (error.code === ERROR_INVALID_PHONE_NUMBER) {
          return 'invalid_phone';
        }
        console.warn(error);
        return 'unknown_error';
      }
    },
    [],
  );

  const signInAnonymously = useCallback(async function () {
    await auth().signInAnonymously();
  }, []);

  const signOut = useCallback(async function () {
    await auth().signInAnonymously();
  }, []);

  // Sign in if the onChangeEvent fired immediately on subscription did not include user data. (in other words, user was not previously signed in)
  useEffect(() => {
    if (state.isAuthConnectionInitialized && !state.user) {
      signInAnonymously();
    }
  }, [state.isAuthConnectionInitialized, state.user?.uid]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signInWithPhoneNumber,
        confirmCode,
        signOut,
        authenticationType: getAuthenticationType(state),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

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
