import React, {useReducer, useMemo} from 'react';
import {Location, useAppState} from '../../AppContext';
import searchJournies from './searchJournies';
import Splash from '../Splash';
import {useGeolocationState} from '../../GeolocationContext';
import {TripPattern} from 'src/sdk';
import Overview from './Overview';

type PlannerState = {
  isSearching: boolean;
  tripPatterns: TripPattern[] | null;
};

type PlannerReducerAction =
  | {type: 'SET_TRIP_PATTERNS'; tripPatterns: TripPattern[] | null}
  | {type: 'SET_IS_SEARCHING'};

type PlannerReducer = (
  prevState: PlannerState,
  action: PlannerReducerAction,
) => PlannerState;

const plannerReducer: PlannerReducer = (prevState, action) => {
  switch (action.type) {
    case 'SET_TRIP_PATTERNS':
      return {
        tripPatterns: action.tripPatterns,
        isSearching: false,
      };
    case 'SET_IS_SEARCHING':
      return {
        ...prevState,
        isSearching: true,
      };
  }
};

const defaultState: PlannerState = {
  tripPatterns: null,
  isSearching: true,
};

const PlannerRoot = () => {
  const {userLocations} = useAppState();
  const {location} = useGeolocationState();
  const [state, dispatch] = useReducer(plannerReducer, defaultState);

  const currentLocation = useMemo<Location | null>(
    () =>
      location
        ? {
            id: 'current',
            name: 'current',
            label: 'current',
            coordinates: {
              longitude: location.coords.longitude,
              latitude: location.coords.latitude,
            },
          }
        : null,
    [location?.coords?.latitude, location?.coords?.longitude],
  );

  if (!userLocations || !currentLocation) {
    return <Splash />;
  }

  async function search(from: Location, to: Location) {
    dispatch({type: 'SET_IS_SEARCHING'});
    const tripPatterns = await searchJournies(from, to);
    dispatch({type: 'SET_TRIP_PATTERNS', tripPatterns});
  }

  return (
    <Overview
      userLocations={userLocations}
      currentLocation={currentLocation}
      {...state}
      search={search}
    />
  );
};

export default PlannerRoot;
