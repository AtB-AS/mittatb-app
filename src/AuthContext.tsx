import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {usePreferences} from './preferences';

type AuthReducerState = {
  isInitialized: boolean;
  user: FirebaseAuthTypes.User | null;
};

type AuthReducerAction = {
  type: 'SET_USER';
  user: FirebaseAuthTypes.User | null;
};

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
  }
};

const initialReducerState: AuthReducerState = {
  isInitialized: false,
  user: null,
};

type AuthContextState = {
  signInAnonymously: () => Promise<void>;
  signOut: () => Promise<void>;
  updateEmail: (email: string) => Promise<void>;
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

  const onAuthStateChanged = useCallback(
    function (user: FirebaseAuthTypes.User | null) {
      dispatch({type: 'SET_USER', user});
    },
    [dispatch],
  );

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, [onAuthStateChanged]);

  const signInAnonymously = useCallback(async function () {
    await auth().signInAnonymously();
  }, []);

  const signOut = useCallback(async function () {
    await auth().signOut();
  }, []);

  const updateEmail = useCallback(
    async function (email: string) {
      await state.user?.updateEmail(email);
    },
    [state.user],
  );

  return (
    <AuthContext.Provider
      value={{...state, signInAnonymously, signOut, updateEmail}}
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
