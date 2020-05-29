import React, {
  createContext,
  useReducer,
  useContext,
  Dispatch,
  useEffect,
  useMemo,
} from 'react';
import RNBootSplash from 'react-native-bootsplash';

import storage from './storage';

type AppState = {
  isLoading: boolean;
  onboarded: boolean;
};

type AppReducerAction =
  | {
      type: 'LOAD_APP_SETTINGS';
      onboarded: boolean;
    }
  | {type: 'COMPLETE_ONBOARDING'}
  | {type: 'RESTART_ONBOARDING'};

type AppContextState = AppState & {
  completeOnboarding: () => void;
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
        onboarded: action.onboarded,
        isLoading: false,
      };
    case 'COMPLETE_ONBOARDING':
      return {
        ...prevState,
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
  onboarded: false,
};

const AppContextProvider: React.FC = ({children}) => {
  const [state, dispatch] = useReducer<AppReducer>(appReducer, defaultAppState);

  useEffect(() => {
    async function loadAppSettings() {
      const savedOnboarded = await storage.get('onboarded');
      const onboarded = !savedOnboarded ? false : JSON.parse(savedOnboarded);
      dispatch({
        type: 'LOAD_APP_SETTINGS',
        onboarded,
      });
      RNBootSplash.hide({duration: 100});
    }
    loadAppSettings();
  }, []);

  const {completeOnboarding, restartOnboarding} = useMemo(
    () => ({
      completeOnboarding: async () => {
        await storage.set('onboarded', JSON.stringify(true));
        dispatch({type: 'COMPLETE_ONBOARDING'});
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
