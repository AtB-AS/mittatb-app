import {getRealtimeDepartureV2} from '@atb/api/departures';
import {getStopPlaceDepartures} from '@atb/api/departures/stops-nearest';
import {EstimatedCall, Place as StopPlace} from '@atb/api/types/departures';
import {ErrorType, getAxiosErrorType} from '@atb/api/utils';
import {useFavorites} from '@atb/favorites';
import {UserFavoriteDepartures} from '@atb/favorites/types';
import {DeparturesRealtimeData} from '@atb/sdk';
import useInterval from '@atb/utils/use-interval';
import {useIsFocused} from '@react-navigation/native';
import {differenceInMinutes} from 'date-fns';
import {flatMap} from 'lodash';
import {useCallback, useEffect} from 'react';
import {LayoutAnimation} from 'react-native';
import useReducerWithSideEffects, {
  NoUpdate,
  ReducerWithSideEffects,
  SideEffect,
  Update,
  UpdateWithSideEffect,
} from 'use-reducer-with-side-effects';
import {updateDeparturesWithRealtimeV2} from '../../../departure-list/utils';
import {getSecondsUntilMidnightOrMinimum} from './quay-state';

export const DEFAULT_NUMBER_OF_DEPARTURES_PER_QUAY_TO_SHOW = 5;

// We fetch double the number of departures to be shown, so that we have more
// departures to show when one or more departures have already passed.
const DEFAULT_NUMBER_OF_DEPARTURES_PER_QUAY_TO_BE_FETCHED =
  DEFAULT_NUMBER_OF_DEPARTURES_PER_QUAY_TO_SHOW * 2;

// Used to re-trigger full refresh after N minutes.
// To repopulate the view when we get fewer departures.
const HARD_REFRESH_LIMIT_IN_MINUTES = 10;
const MIN_TIME_RANGE = 3 * 60 * 60; // Three hours

export type DepartureDataState = {
  data: EstimatedCall[] | null;
  showOnlyFavorites: boolean;
  tick?: Date;
  error?: {type: ErrorType};
  locationId?: string;
  isLoading: boolean;
  queryInput: QueryInput;
  lastRefreshTime: Date;
};

const initialQueryInput: QueryInput = {
  numberOfDepartures: DEFAULT_NUMBER_OF_DEPARTURES_PER_QUAY_TO_BE_FETCHED,
  startTime: new Date().toISOString(),
};
const initialState: DepartureDataState = {
  data: null,
  showOnlyFavorites: false,
  error: undefined,
  locationId: undefined,
  isLoading: false,
  queryInput: initialQueryInput,
  lastRefreshTime: new Date(),

  // Store date as update tick to know when to rerender
  // and re-sort objects.
  tick: undefined,
};

type DepartureDataActions =
  | {
      type: 'LOAD_INITIAL_DEPARTURES';
      stopPlace: StopPlace;
      startTime?: string;
      favoriteDepartures?: UserFavoriteDepartures;
    }
  | {
      type: 'LOAD_REALTIME_DATA';
      stopPlace: StopPlace;
    }
  | {
      type: 'STOP_LOADER';
    }
  | {
      type: 'UPDATE_DEPARTURES';
      locationId?: string;
      reset?: boolean;
      result: EstimatedCall[];
    }
  | {
      type: 'SET_SHOW_FAVORITES';
      showOnlyFavorites: boolean;
      stopPlace: StopPlace;
      startTime?: string;
      favoriteDepartures?: UserFavoriteDepartures;
    }
  | {
      type: 'SET_ERROR';
      error: ErrorType;
      reset?: boolean;
    }
  | {
      type: 'UPDATE_REALTIME';
      realtimeData: DeparturesRealtimeData;
    }
  | {
      type: 'TICK_TICK';
    };

const reducer: ReducerWithSideEffects<
  DepartureDataState,
  DepartureDataActions
> = (state, action) => {
  switch (action.type) {
    case 'LOAD_INITIAL_DEPARTURES': {
      if (state.isLoading === true) {
        return NoUpdate();
      }

      // Update input data with new date as this
      // is a fresh fetch. We should fetch the latest information.
      const queryInput: QueryInput = {
        numberOfDepartures: DEFAULT_NUMBER_OF_DEPARTURES_PER_QUAY_TO_BE_FETCHED,
        startTime: action.startTime ?? new Date().toISOString(),
      };

      return UpdateWithSideEffect<DepartureDataState, DepartureDataActions>(
        {
          ...state,
          isLoading: true,
          error: undefined,
          queryInput,
        },
        async (state, dispatch) => {
          try {
            const result = await fetchEstimatedCalls(
              queryInput,
              action.stopPlace,
              state.showOnlyFavorites ? action.favoriteDepartures : undefined,
            );

            dispatch({
              type: 'UPDATE_DEPARTURES',
              reset: true,
              locationId: action.stopPlace.id,
              result: result,
            });
          } catch (e) {
            dispatch({
              type: 'SET_ERROR',
              reset: action.stopPlace.id !== state.locationId,
              error: getAxiosErrorType(e),
            });
          } finally {
            dispatch({type: 'STOP_LOADER'});
          }
        },
      );
    }

    case 'LOAD_REALTIME_DATA': {
      if (!state.data?.length) return NoUpdate();
      return SideEffect<DepartureDataState, DepartureDataActions>(
        async (_, dispatch) => {
          // Use same query input with same startTime to ensure that
          // we get the same result.
          try {
            const quayIds = action.stopPlace.quays?.map((q) => q.id);
            const realtimeData = await getRealtimeDepartureV2(quayIds, {
              limitPerLine: state.queryInput.numberOfDepartures,
              startTime: state.queryInput.startTime,
            });
            dispatch({
              type: 'UPDATE_REALTIME',
              realtimeData,
            });
          } catch (e) {
            console.warn(e);
          }
        },
      );
    }

    case 'STOP_LOADER': {
      return Update<DepartureDataState>({
        ...state,
        isLoading: false,
      });
    }

    case 'TICK_TICK': {
      return Update<DepartureDataState>({
        ...state,

        // We set lastUpdated here to count as a "tick" to
        // know when to update components while still being performant.
        tick: new Date(),
      });
    }

    case 'SET_SHOW_FAVORITES': {
      return UpdateWithSideEffect<DepartureDataState, DepartureDataActions>(
        {
          ...state,
          showOnlyFavorites: action.showOnlyFavorites,
        },
        async (_, dispatch) => {
          dispatch({
            type: 'LOAD_INITIAL_DEPARTURES',
            stopPlace: action.stopPlace,
            startTime: action.startTime,
            favoriteDepartures: action.favoriteDepartures,
          });
        },
      );
    }

    case 'UPDATE_DEPARTURES': {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      return Update<DepartureDataState>({
        ...state,
        isLoading: false,
        locationId: action.locationId,
        data: action.result,
        tick: new Date(),
        lastRefreshTime: new Date(),
      });
    }

    case 'UPDATE_REALTIME': {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      return Update<DepartureDataState>({
        ...state,
        data: updateDeparturesWithRealtimeV2(state.data, action.realtimeData),

        // We set lastUpdated here to count as a "tick" to
        // know when to update components while still being performant.
        tick: new Date(),
      });
    }

    case 'SET_ERROR': {
      return Update<DepartureDataState>({
        ...state,
        error: {
          type: action.error,
        },
        data: action.reset ? null : state.data,
      });
    }

    default:
      return NoUpdate();
  }
};

export function useStopPlaceData(
  stopPlace: StopPlace,
  showOnlyFavorites: boolean,
  startTime?: string,
  updateFrequencyInSeconds: number = 30,
  tickRateInSeconds: number = 10,
) {
  const [state, dispatch] = useReducerWithSideEffects(reducer, initialState);
  const isFocused = useIsFocused();
  const {favoriteDepartures} = useFavorites();

  const dispatchLoadInitialDepartures = () =>
    dispatch({
      type: 'LOAD_INITIAL_DEPARTURES',
      stopPlace,
      startTime,
      favoriteDepartures: showOnlyFavorites ? favoriteDepartures : undefined,
    });

  const refresh = useCallback(dispatchLoadInitialDepartures, [
    stopPlace.id,
    startTime,
    showOnlyFavorites,
    favoriteDepartures,
  ]);

  useEffect(
    () =>
      dispatch({
        type: 'SET_SHOW_FAVORITES',
        stopPlace,
        startTime,
        showOnlyFavorites,
        favoriteDepartures,
      }),
    [stopPlace.id, favoriteDepartures, showOnlyFavorites],
  );
  useEffect(dispatchLoadInitialDepartures, [stopPlace.id, startTime]);
  useEffect(() => {
    if (!state.tick) {
      return;
    }
    const diff = differenceInMinutes(state.tick, state.lastRefreshTime);

    if (diff >= HARD_REFRESH_LIMIT_IN_MINUTES) {
      dispatchLoadInitialDepartures();
    }
  }, [state.tick, state.lastRefreshTime]);
  useInterval(
    () => dispatch({type: 'LOAD_REALTIME_DATA', stopPlace}),
    updateFrequencyInSeconds * 1000,
    [stopPlace.id],
    !isFocused,
  );
  useInterval(
    () => dispatch({type: 'TICK_TICK'}),
    tickRateInSeconds * 1000,
    [],
    !isFocused,
  );

  return {
    state,
    refresh,
  };
}

type QueryInput = {
  numberOfDepartures: number;
  startTime: string;
};

async function fetchEstimatedCalls(
  queryInput: QueryInput,
  stopPlace: StopPlace,
  favoriteDepartures?: UserFavoriteDepartures,
): Promise<EstimatedCall[]> {
  const timeRange = getSecondsUntilMidnightOrMinimum(
    queryInput.startTime ?? new Date().toISOString(),
    MIN_TIME_RANGE,
  );

  const result = await getStopPlaceDepartures(
    {
      id: stopPlace.id,
      startTime: queryInput.startTime,
      numberOfDepartures: queryInput.numberOfDepartures,
      timeRange: timeRange,
    },
    favoriteDepartures,
  );

  return flatMap(
    result.stopPlace?.quays,
    (quay) => quay.estimatedCalls,
  ) as EstimatedCall[];
}
