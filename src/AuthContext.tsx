import React, {useEffect, createContext, useState, useContext} from 'react';
import auth from '@react-native-firebase/auth';

interface User {
  uid: string;
}

interface AuthenticationState {
  user: User | null;
}

const initialState = {
  user: null,
};

export const AuthenticationContext = createContext<AuthenticationState>(
  initialState,
);

export const AuthenticationContextProvider: React.FC<{}> = (props) => {
  const [state, setState] = useState<AuthenticationState>(initialState);

  useEffect(() => {
    const signIn = async () => {
      await auth().signInAnonymously();
    };

    const unsubcribe = auth().onAuthStateChanged((u) => {
      u
        ? setState((state) => ({...state, user: {uid: u.uid}}))
        : setState((state) => ({...state, user: null}));
    });

    signIn();

    return unsubcribe;
  }, []);
  return (
    <AuthenticationContext.Provider value={state}>
      {props.children}
    </AuthenticationContext.Provider>
  );
};

export function useCurrentUser() {
  const ctx = useContext(AuthenticationContext);
  if (ctx === undefined) {
    throw new Error(
      'useCurrentUser must be used within a AuthenticationContextProvider',
    );
  }

  return ctx.user ? ctx.user.uid : null;
}
