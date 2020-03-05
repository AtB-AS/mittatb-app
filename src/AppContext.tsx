import React, {
  createContext,
  useReducer,
  useContext,
  Dispatch,
  useEffect,
  useMemo,
} from 'react';
import {getFavorites, setFavorites__legacy} from './favorites/storage';
import {UserFavorites, UserLocations} from './favorites/types';

type AppState = {
  isLoading: boolean;
  onboarded: boolean;
  userLocations: UserFavorites | null;
};

type AppReducerAction =
  | {type: 'LOAD_APP_SETTINGS'; userLocations: UserFavorites | null}
  | {type: 'SET_USER_LOCATIONS'; userLocations: UserFavorites}
  | {type: 'RESTART_ONBOARDING'};

type AppContextState = AppState & {
  completeOnboarding__legacy: (userlocations: UserLocations) => void;
  restartOnboarding: () => void;
};
const AppContext = createContext<AppContextState | undefined>(undefined);
const AppDispatch = createContext<Dispatch<AppReducerAction> | undefined>(
  undefined,
);

type AppReducer = (prevState: AppState, action: AppReducerAction) => AppState;

const appReducer: AppReducer = (prevState, action) => {
  switch (action.type) {
    case 'LOAD_APP_SETTINGS':
      return {
        ...prevState,
        userLocations: action.userLocations,
        onboarded: action.userLocations != null,
        isLoading: false,
      };
    case 'SET_USER_LOCATIONS':
      return {
        ...prevState,
        userLocations: action.userLocations,
        onboarded: true,
      };
    case 'RESTART_ONBOARDING':
      return {
        ...prevState,
        onboarded: false,
      };
  }
};

const defaultAppState: AppState = {
  isLoading: true,
  userLocations: null,
  onboarded: false,
};

const AppContextProvider: React.FC = ({children}) => {
  const [state, dispatch] = useReducer<AppReducer>(appReducer, defaultAppState);

  useEffect(() => {
    async function checkOnboarded() {
      const userLocations = await getFavorites();
      dispatch({
        type: 'LOAD_APP_SETTINGS',
        userLocations: userLocations,
      });
    }
    checkOnboarded();
  }, []);

  const {completeOnboarding__legacy, restartOnboarding} = useMemo(
    () => ({
      completeOnboarding__legacy: async (input: UserLocations) => {
        const userLocations = await setFavorites__legacy(input);
        dispatch({type: 'SET_USER_LOCATIONS', userLocations});
      },
      restartOnboarding: async () => {
        dispatch({type: 'RESTART_ONBOARDING'});
      },
    }),
    [],
  );

  return (
    <AppContext.Provider
      value={{...state, completeOnboarding__legacy, restartOnboarding}}
    >
      <AppDispatch.Provider value={dispatch}>{children}</AppDispatch.Provider>
    </AppContext.Provider>
  );
};

export function useAppState() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within a AppContextProvider');
  }
  return context;
}

export function useAppDispatch() {
  const context = useContext(AppDispatch);
  if (context === undefined) {
    throw new Error('useAppDispatch must be used within a AppContextProvider');
  }
  return context;
}

export default AppContextProvider;
