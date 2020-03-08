import React, {
  createContext,
  useReducer,
  useContext,
  Dispatch,
  useEffect,
  useMemo,
} from 'react';
import storage from '../storage';
import {UserLocations, Location} from './types';

type AppState = {
  isLoading: boolean;
  onboarded: boolean;
  userLocations: UserLocations | null;
};

type AppReducerAction =
  | {type: 'LOAD_APP_SETTINGS'; userLocations: UserLocations | null}
  | {type: 'SET_USER_LOCATIONS'; userLocations: UserLocations}
  | {type: 'RESTART_ONBOARDING'};

type AppContextState = AppState & {
  completeOnboarding: (userlocations: UserLocations) => void;
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
      const userLocations = await storage.get('stored_user_locations');
      dispatch({
        type: 'LOAD_APP_SETTINGS',
        userLocations: userLocations ? JSON.parse(userLocations) : null,
      });
    }
    checkOnboarded();
  }, []);

  const {completeOnboarding, restartOnboarding} = useMemo(
    () => ({
      async addFavorite(location: Location) {},
      completeOnboarding: async (userLocations: UserLocations) => {
        await storage.set(
          'stored_user_locations',
          JSON.stringify(userLocations),
        );

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
      value={{...state, completeOnboarding, restartOnboarding}}
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
