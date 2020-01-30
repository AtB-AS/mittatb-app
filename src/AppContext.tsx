import React, {
  createContext,
  useReducer,
  useContext,
  Dispatch,
  useEffect,
  useMemo,
} from 'react';
import {getSetting, saveSetting, removeSetting} from './settings';

export type Location = {
  id: string;
  name: string;
  locality: string;
  label?: string;
  coordinates: {longitude: number; latitude: number};
};

export type UserLocations = {
  home: Location;
  work: Location;
};

type AppState = {
  isLoading: boolean;
  userLocations: UserLocations | null;
};

type AppReducerAction =
  | {type: 'LOAD_APP_SETTINGS'; userLocations: UserLocations | null}
  | {type: 'SET_USER_LOCATIONS'; userLocations: UserLocations}
  | {type: 'RESET_APP'};

type AppContextState = AppState & {
  completeOnboarding: (userlocations: UserLocations) => void;
  resetOnboarding: () => void;
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
        isLoading: false,
      };
    case 'SET_USER_LOCATIONS':
      return {
        ...prevState,
        userLocations: action.userLocations,
      };
    case 'RESET_APP':
      return {
        userLocations: null,
        isLoading: false,
      };
  }
};

const defaultAppState: AppState = {
  isLoading: true,
  userLocations: null,
};

const AppContextProvider: React.FC = ({children}) => {
  const [state, dispatch] = useReducer<AppReducer>(appReducer, defaultAppState);

  useEffect(() => {
    async function checkOnboarded() {
      const userLocations = await getSetting<UserLocations>(
        'stored_user_locations',
      );
      dispatch({
        type: 'LOAD_APP_SETTINGS',
        userLocations,
      });
    }
    checkOnboarded();
  }, []);

  const {completeOnboarding, resetOnboarding} = useMemo(
    () => ({
      completeOnboarding: async (userLocations: UserLocations) => {
        await saveSetting('stored_user_locations', userLocations);
        dispatch({type: 'SET_USER_LOCATIONS', userLocations});
      },
      resetOnboarding: async () => {
        await removeSetting('stored_user_locations');
        dispatch({type: 'RESET_APP'});
      },
    }),
    [],
  );

  return (
    <AppContext.Provider
      value={{...state, completeOnboarding, resetOnboarding}}
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
