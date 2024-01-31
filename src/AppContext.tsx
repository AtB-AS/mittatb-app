import React, {
  createContext,
  Dispatch,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import RNBootSplash from 'react-native-bootsplash';
import {register as registerChatUser} from './chat/user';
import {storage} from '@atb/storage';
import {
  OnboardingSection,
  OnboardingSectionId,
  staticOnboardingSectionsInPrioritizedOrder,
  getOnboardingSection,
  LoadedOnboardingSection,
} from './utils/use-onboarding-sections';

export type AppState = {
  isLoading: boolean;
  loadedOnboardingSections: LoadedOnboardingSection[];
};

type AppContextState = AppState & {
  completeOnboardingSection: (onboardingSectionId: OnboardingSectionId) => void;
  restartOnboardingSection: (onboardingSectionId: OnboardingSectionId) => void;
  restartAllOnboardingSections: () => void;
};

type AppReducerAction =
  | {
      type: 'LOAD_APP_SETTINGS';
      loadedOnboardingSections: LoadedOnboardingSection[];
    }
  | {
      type: 'COMPLETE_ONBOARDING_SECTION';
      onboardingSectionId: OnboardingSectionId;
    }
  | {
      type: 'RESTART_ONBOARDING_SECTION';
      onboardingSectionId: OnboardingSectionId;
    };

const AppContext = createContext<AppContextState | undefined>(undefined);
const AppDispatch = createContext<Dispatch<AppReducerAction> | undefined>(
  undefined,
);

type AppReducer = (prevState: AppState, action: AppReducerAction) => AppState;

const appReducer: AppReducer = (prevState, action) => {
  switch (action.type) {
    case 'LOAD_APP_SETTINGS':
      const {loadedOnboardingSections} = action;
      return {
        ...prevState,
        isLoading: false,
        loadedOnboardingSections,
      };
    case 'COMPLETE_ONBOARDING_SECTION':
      return {
        ...prevState,
        loadedOnboardingSections: getUpdatedOnboardingSections(
          prevState.loadedOnboardingSections,
          action.onboardingSectionId,
          true,
        ),
      };
    case 'RESTART_ONBOARDING_SECTION':
      return {
        ...prevState,
        loadedOnboardingSections: getUpdatedOnboardingSections(
          prevState.loadedOnboardingSections,
          action.onboardingSectionId,
          false,
        ),
      };
  }
};

const defaultAppState: AppState = {
  isLoading: true,
  loadedOnboardingSections: [],
};

export const AppContextProvider: React.FC = ({children}) => {
  const [state, dispatch] = useReducer<AppReducer>(appReducer, defaultAppState);

  useEffect(() => {
    async function loadAppSettings() {
      const loadedOnboardingSections = await Promise.all(
        staticOnboardingSectionsInPrioritizedOrder.map(
          async (staticOnboardingSection) => {
            const savedIsOnboarded = await storage.get(
              staticOnboardingSection.isOnboardedStoreKey,
            );
            const isOnboarded = !savedIsOnboarded
              ? false
              : JSON.parse(savedIsOnboarded);
            return {...staticOnboardingSection, isOnboarded};
          },
        ),
      );

      const userCreationOnboardedScreen = loadedOnboardingSections.find(
        (sOS) => sOS.onboardingSectionId === 'userCreation',
      );
      if (userCreationOnboardedScreen?.isOnboarded) {
        registerChatUser();
      }

      dispatch({
        type: 'LOAD_APP_SETTINGS',
        loadedOnboardingSections,
      });

      RNBootSplash.hide({fade: true});
    }
    loadAppSettings();
  }, []);

  const {completeOnboardingSection, restartOnboardingSection} = useMemo(
    () => ({
      completeOnboardingSection: async (
        onboardingSectionId: OnboardingSectionId,
      ) => {
        dispatch({
          type: 'COMPLETE_ONBOARDING_SECTION',
          onboardingSectionId,
        });
        await storeOnboardingSectionIsOnboarded(
          state.loadedOnboardingSections,
          onboardingSectionId,
          true,
        );
      },
      restartOnboardingSection: async (
        onboardingSectionId: OnboardingSectionId,
      ) => {
        dispatch({
          type: 'RESTART_ONBOARDING_SECTION',
          onboardingSectionId,
        });
        await storeOnboardingSectionIsOnboarded(
          state.loadedOnboardingSections,
          onboardingSectionId,
          false,
        );
      },
    }),
    [state.loadedOnboardingSections],
  );

  const restartAllOnboardingSections = useCallback(
    () =>
      Promise.all(
        state.loadedOnboardingSections.map((loadedOnboardingSection) =>
          restartOnboardingSection(loadedOnboardingSection.onboardingSectionId),
        ),
      ),
    [state.loadedOnboardingSections, restartOnboardingSection],
  );

  return (
    <AppContext.Provider
      value={{
        ...state,
        completeOnboardingSection,
        restartOnboardingSection,
        restartAllOnboardingSections,
      }}
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

const getUpdatedOnboardingSections = (
  onboardingSections: OnboardingSection[],
  onboardingSectionId: OnboardingSectionId,
  isOnboarded: boolean,
) => {
  const index = onboardingSections.findIndex(
    (sOS) => sOS.onboardingSectionId === onboardingSectionId,
  );
  if (index !== -1) {
    // only return a new array if a value is changed
    if (onboardingSections[index].isOnboarded !== isOnboarded) {
      const updatedOnboardingSections = [...onboardingSections];
      updatedOnboardingSections[index].isOnboarded = isOnboarded;
      return updatedOnboardingSections;
    }
  }
  return onboardingSections;
};

const storeOnboardingSectionIsOnboarded = async (
  onboardingSections: OnboardingSection[],
  onboardingSectionId: OnboardingSectionId,
  isOnboarded: boolean,
) => {
  const isOnboardedStoreKey = getOnboardingSection(
    onboardingSections,
    onboardingSectionId,
  )?.isOnboardedStoreKey;
  if (isOnboardedStoreKey) {
    await storage.set(isOnboardedStoreKey, JSON.stringify(isOnboarded));
  }
};
