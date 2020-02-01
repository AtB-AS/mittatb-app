import React, {
  createContext,
  useReducer,
  useContext,
  Dispatch,
  useEffect,
} from 'react';
import Splash from '../Splash';
import {GeolocationResponse} from '@react-native-community/geolocation';
import {Location, useAppState} from '../../AppContext';
import {useGeolocationState} from '../../GeolocationContext';

type OnboardingContextValue = {
  location: GeolocationResponse | null;
  home: Location | null;
  work: Location | null;
  dispatch: Dispatch<OnboardingAction>;
};

export const OnboardingContext = createContext<
  OnboardingContextValue | undefined
>(undefined);

type OnboardingState = {
  home: Location | null;
  work: Location | null;
  completed: boolean;
};

type OnboardingAction =
  | {type: 'SET_HOME'; home: Location}
  | {type: 'SET_WORK'; work: Location};

type OnboardingReducer = (
  prevState: OnboardingState,
  action: OnboardingAction,
) => OnboardingState;

const onboardingReducer: OnboardingReducer = (prevState, action) => {
  switch (action.type) {
    case 'SET_HOME':
      return {
        ...prevState,
        home: action.home,
      };
    case 'SET_WORK':
      return {
        ...prevState,
        work: action.work,
        completed: true,
      };
  }
};

const OnboardingContextProvider: React.FC = ({children}) => {
  const {userLocations, completeOnboarding} = useAppState();
  const {status: permissionStatus, location} = useGeolocationState();
  const [{home, work, completed}, dispatch] = useReducer<OnboardingReducer>(
    onboardingReducer,
    {
      home: userLocations?.home ?? null,
      work: userLocations?.work ?? null,
      completed: false,
    },
  );

  useEffect(() => {
    if (completed && home && work) {
      completeOnboarding({home, work});
    }
  }, [completed]);

  if (!permissionStatus) {
    return <Splash />;
  }

  return (
    <OnboardingContext.Provider
      value={{
        location,
        home,
        work,
        dispatch,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export function useOnboardingState() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error(
      'useOnboardingState must be used within a OnboardingContextProvider',
    );
  }
  return context;
}

export default OnboardingContextProvider;
