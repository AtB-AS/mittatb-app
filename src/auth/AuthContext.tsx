import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {usePreferences} from '../preferences';

type AuthReducerState = {
  isInitialized: boolean;
  abtCustomerId: string | undefined;
  user: FirebaseAuthTypes.User | null;
};

type AuthReducerAction =
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
    case 'SET_USER': {
      return {
        ...prevState,
        isInitialized: true,
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
  isInitialized: false,
  abtCustomerId: undefined,
  user: null,
};

type AuthContextState = {
  signInAnonymously: () => Promise<void>;
  signOut: () => Promise<void>;
  updateEmail: (email: string) => Promise<void>;
  syncAbtCustomer: () => Promise<void>;
} & AuthReducerState;

const AuthContext = createContext<AuthContextState | undefined>(undefined);

export default function AuthContextProvider({children}: PropsWithChildren<{}>) {
  const [state, dispatch] = useReducer(authReducer, initialReducerState);
  const {
    preferences: {language},
  } = usePreferences();

  useEffect(() => {
    if (language) auth().setLanguageCode(language);
  }, [language]);

  const onUserChanged = useCallback(
    async function (user: FirebaseAuthTypes.User | null) {
      dispatch({type: 'SET_USER', user});
    },
    [dispatch],
  );

  useEffect(() => {
    syncAbtCustomer();
  }, [state.user]);

  const getAbtCustomerId = useCallback(
    async function () {
      if (!state.user) return undefined;
      const idToken = await state.user.getIdTokenResult(true);
      return idToken.claims['abt_id'] as string | undefined;
    },
    [state.user],
  );

  const syncAbtCustomer = useCallback(
    async function () {
      async function sync(retries: number = 0): Promise<string | undefined> {
        if (retries > 3) return undefined;

        const abtCustomerId = await getAbtCustomerId();
        if (abtCustomerId) {
          return abtCustomerId;
        } else {
          return sync(retries + 1);
        }
      }

      const abtCustomerId = await sync();
      dispatch({type: 'SET_ABT_CUSTOMER_ID', abtCustomerId});
    },
    [getAbtCustomerId],
  );

  useEffect(() => {
    const subscriber = auth().onUserChanged(onUserChanged);
    return subscriber;
  }, [onUserChanged]);

  const signInAnonymously = useCallback(async function () {
    await auth().signInAnonymously();
  }, []);

  const signOut = useCallback(async function () {
    await auth().signOut();
  }, []);

  useEffect(() => {
    if (state.isInitialized && !state.user) {
      signInAnonymously();
    }
  }, [state.isInitialized]);

  const updateEmail = useCallback(
    async function (email: string) {
      await state.user?.updateEmail(email);
    },
    [state.user],
  );

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signInAnonymously,
        signOut,
        updateEmail,
        syncAbtCustomer,
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
