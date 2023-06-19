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
import Bugsnag from '@bugsnag/react-native';

const ERROR_INVALID_PHONE_NUMBER = 'auth/invalid-phone-number';
const ERROR_INVALID_CONFIRMATION_CODE = 'auth/invalid-verification-code';

function isAuthError(
  error: any,
): error is FirebaseAuthTypes.NativeFirebaseAuthError {
  return 'code' in error;
}

type AuthReducerState = {
  isAuthConnectionInitialized: boolean;
  confirmationHandler: FirebaseAuthTypes.ConfirmationResult | undefined;
  abtCustomerId: string | undefined;
  customerNumber: number | undefined;
  user: FirebaseAuthTypes.User | null;
  userCreationFinished: boolean;
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
  | {type: 'SET_ABT_CUSTOMER_ID'; abtCustomerId: string | undefined}
  | {type: 'SET_USER_CREATION_FINISHED'; customer_number: number};

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
        userCreationFinished:
          action.user?.uid === prevState.user?.uid
            ? prevState.userCreationFinished
            : false,
      };
    }
    case 'SET_ABT_CUSTOMER_ID': {
      return {
        ...prevState,
        abtCustomerId: action.abtCustomerId,
      };
    }
    case 'SET_USER_CREATION_FINISHED': {
      console.log(
        'SET_USER_CREATION_FINISHED, customer_number: ' +
          action.customer_number,
      );
      return {
        ...prevState,
        userCreationFinished: true,
        customerNumber: action.customer_number,
      };
    }
  }
};

const initialReducerState: AuthReducerState = {
  isAuthConnectionInitialized: false,
  confirmationHandler: undefined,
  abtCustomerId: undefined,
  customerNumber: undefined,
  user: null,
  userCreationFinished: false,
};

type AuthenticationType = 'none' | 'anonymous' | 'phone';

const getAuthenticationType = (
  user: FirebaseAuthTypes.User | null,
): AuthenticationType => {
  if (user?.phoneNumber) return 'phone';
  else if (user?.isAnonymous) return 'anonymous';
  else return 'none';
};

export type ConfirmationErrorCode = 'invalid_code' | 'unknown_error';
export type PhoneSignInErrorCode = 'invalid_phone' | 'unknown_error';
export type VippsSignInErrorCode =
  | 'access_denied'
  | 'outdated_app_version'
  | 'unknown_error';

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
  ) => Promise<{error?: VippsSignInErrorCode}>;
} & AuthReducerState;

const AuthContext = createContext<AuthContextState | undefined>(undefined);

export const AuthContextProvider = ({children}: PropsWithChildren<{}>) => {
  const [state, dispatch] = useReducer(authReducer, initialReducerState);
  const {language} = useTranslation();

  const confirmCode = useCallback(
    async function confirmCode(code: string) {
      try {
        await state.confirmationHandler?.confirm(code);
      } catch (error) {
        if (
          isAuthError(error) &&
          error.code === ERROR_INVALID_CONFIRMATION_CODE
        ) {
          return 'invalid_code';
        }
        Bugsnag.notify(error as any);
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
      if (user) {
        updateMetadata({
          'AtB-Firebase-Auth-Id': user.uid,
          'AtB-Auth-Type': getAuthenticationType(user),
        });
      }
      // console.log('onUserChanged, user: ' + JSON.stringify(user));
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

  /*
   * Check whether the user creation is finished. After the first login the user
   * is created immediately at Firebase, but created asynchronously at Entur.
   * When receiving the user created callback from Entur then additional custom
   * claims get added to the user's id token. This method force refreshes the id
   * token and checks whether these custom claims have been set.
   *
   * Will retry up to 10 times with an interval of 1 second.
   */
  // And this is where we want to check whether user profile with Entur has been created
  // If we retry for more than 10 sec. we should log this in bugsnag and intercom
  // When we initiate the call to create a new customer account we should navigate to a page with a spinner for instance.
  // --> Then once we have confirmed that hasCustomerClaims / account was created with Entur we can navigate them to correct place in the app.
  // This navigation to new screen should be in a toggle, so that we can turn it off in case we see that many users are stuck with the spinner.

  // her er kanskje SET_USER_CREATION_FINISHED tom eller på en måte ikke satt i state helt man gjør det her, så man kan sjekke opp i mot den om man skal navigere videre
  useEffect(() => {
    let retryCount = 0;
    console.log('state.user?.uid: ' + state.user?.uid);

    const checkCustomClaims = async () => {
      const token = await state.user?.getIdTokenResult(true);
      console.log('token: ' + JSON.stringify(token));
      const abt_id = token?.claims['abt_id'];
      const customer_number = token?.claims['customer_number'];
      const hasCustomClaims = !!abt_id && !!customer_number;

      if (hasCustomClaims) {
        dispatch({type: 'SET_USER_CREATION_FINISHED', customer_number});
      } else {
        if (retryCount < 10) {
          console.log('retryCount: ' + retryCount);
          console.log('retry, hasCustomClaims: ' + hasCustomClaims);
          // if retry cont 10 --> log to bugsnag that there must have been an error and we need to investigate backend
          retryCount++;
          setTimeout(() => checkCustomClaims(), 10000);
        }
      }
    };

    checkCustomClaims();
  }, [state.user?.uid]);

  // Subscribe to user changes. Will fire a onChangeEvent immediately on subscription.
  useEffect(() => {
    return auth().onUserChanged(onUserChanged);
  }, [onUserChanged]);

  const signInWithPhoneNumber = useCallback(
    async function signInWithPhoneNumber(
      phoneNumberWithPrefix: string,
      forceResend: boolean = false,
    ) {
      try {
        const confirmationHandler = await auth().signInWithPhoneNumber(
          phoneNumberWithPrefix,
          forceResend,
        );
        dispatch({type: 'SIGN_IN_INITIATED', confirmationHandler});
      } catch (error) {
        if (isAuthError(error) && error.code === ERROR_INVALID_PHONE_NUMBER) {
          return 'invalid_phone';
        }
        Bugsnag.notify(error as any);
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

  const signInWithCustomToken = async (token: string) => {
    try {
      await auth().signInWithCustomToken(token);
      return {};
    } catch (err) {
      console.warn(err);
      return {error: 'unknown_error' as VippsSignInErrorCode};
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signInWithPhoneNumber,
        confirmCode,
        signOut,
        authenticationType: getAuthenticationType(state.user),
        signInWithCustomToken,
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
