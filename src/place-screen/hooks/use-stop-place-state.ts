import {getRealtimeDepartures} from '@atb/api/departures';
import {getStopPlaceDepartures} from '@atb/api/departures/stops-nearest';
import {EstimatedCall, StopPlace} from '@atb/api/types/departures';
import {ErrorType, getAxiosErrorType} from '@atb/api/utils';
import {useFavorites} from '@atb/favorites';
import {UserFavoriteDepartures} from '@atb/favorites/types';
import {DeparturesRealtimeData} from '@atb/sdk';
import {animateNextChange} from '@atb/utils/animation';
import useInterval from '@atb/utils/use-interval';
import {differenceInMinutes} from 'date-fns';
import {flatMap} from 'lodash';
import {useCallback, useEffect} from 'react';
import useReducerWithSideEffects, {
  NoUpdate,
  ReducerWithSideEffects,
  SideEffect,
  Update,
  UpdateWithSideEffect,
} from 'use-reducer-with-side-effects';
import {updateDeparturesWithRealtimeV2} from '@atb/departure-list/utils';
import {StopPlacesMode} from '../../nearby-stop-places/types';
import {getLimitOfDeparturesPerLineByMode, getTimeRangeByMode} from '../utils';
import {TimeoutRequest, useTimeoutRequest} from '@atb/api/client';
import {AxiosRequestConfig} from 'axios';
import {useRefreshOnFocus} from '@atb/utils/use-refresh-on-focus';

export const DEFAULT_NUMBER_OF_DEPARTURES_PER_QUAY_TO_SHOW = 5;

// We fetch double the number of departures to be shown, so that we have more
// departures to show when one or more departures have already passed.
const DEFAULT_NUMBER_OF_DEPARTURES_PER_QUAY_TO_BE_FETCHED =
  DEFAULT_NUMBER_OF_DEPARTURES_PER_QUAY_TO_SHOW * 2;

// Used to re-trigger full refresh after N minutes.
// To repopulate the view when we get fewer departures.
const HARD_REFRESH_LIMIT_IN_MINUTES = 10;

export type DepartureDataState = {
  data: EstimatedCall[] | null;
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
      timeRange?: number;
      favoriteDepartures?: UserFavoriteDepartures;
      limitPerLine?: number;
      timeOut: TimeoutRequest;
    }
  | {
      type: 'LOAD_REALTIME_DATA';
      stopPlace: StopPlace;
      favoriteDepartures?: UserFavoriteDepartures;
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
      // Update input data with new date as this
      // is a fresh fetch. We should fetch the latest information.
      const queryInput: QueryInput = {
        numberOfDepartures: DEFAULT_NUMBER_OF_DEPARTURES_PER_QUAY_TO_BE_FETCHED,
        startTime: action.startTime ?? new Date().toISOString(),
        limitPerLine: action.limitPerLine,
        timeRange: action.timeRange,
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
            action.timeOut.start();
            const result = await fetchEstimatedCalls(
              queryInput,
              action.stopPlace,
              action.favoriteDepartures,
              {
                signal: action.timeOut.signal,
              },
            );
            action.timeOut.clear();
            dispatch({
              type: 'UPDATE_DEPARTURES',
              reset: true,
              locationId: action.stopPlace.id,
              result: result,
            });
          } catch (e) {
            const errorType = getAxiosErrorType(e, action.timeOut.didTimeout);
            // Not show error msg if the request was cancelled by a new search
            if (errorType === 'cancel') return;
            dispatch({
              type: 'SET_ERROR',
              reset: action.stopPlace.id !== state.locationId,
              error: errorType,
            });
          } finally {
            dispatch({type: 'STOP_LOADER'});
          }
        },
      );
    }

    case 'LOAD_REALTIME_DATA': {
      if (!state.data?.length || !action.stopPlace.quays) return NoUpdate();
      return SideEffect<DepartureDataState, DepartureDataActions>(
        async (_, dispatch) => {
          // Use same query input with same startTime to ensure that
          // we get the same result.
          try {
            const quayIds = action.stopPlace.quays?.map((q) => q.id) ?? [];
            const lineIds = action.favoriteDepartures?.map((f) => f.lineId);
            const realtimeData = await getRealtimeDepartures({
              quayIds,
              lineIds,
              limit: state.queryInput.numberOfDepartures,
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

    case 'UPDATE_DEPARTURES': {
      animateNextChange();
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
      animateNextChange();
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
  isFocused: boolean,
  mode: StopPlacesMode,
  startTime?: string,
  updateFrequencyInSeconds: number = 30,
  tickRateInSeconds: number = 10,
) {
  const [state, dispatch] = useReducerWithSideEffects(reducer, initialState);
  const {favoriteDepartures} = useFavorites();
  const activeFavoriteDepartures = showOnlyFavorites
    ? favoriteDepartures
    : undefined;
  const timeout = useTimeoutRequest();

  const loadDepartures = useCallback(() => {
    const timeRange = getTimeRangeByMode(mode, startTime);
    const limitPerLine = getLimitOfDeparturesPerLineByMode(mode);
    dispatch({
      type: 'LOAD_INITIAL_DEPARTURES',
      stopPlace,
      startTime,
      timeRange,
      limitPerLine,
      favoriteDepartures: activeFavoriteDepartures,
      timeOut: timeout,
    });
  }, [stopPlace, startTime, activeFavoriteDepartures, mode]);
  const loadRealTimeData = useCallback(
    () =>
      dispatch({
        type: 'LOAD_REALTIME_DATA',
        stopPlace,
        favoriteDepartures: activeFavoriteDepartures,
      }),
    [JSON.stringify(activeFavoriteDepartures)],
  );

  useEffect(() => {
    loadDepartures();
    return () => timeout.abort();
  }, [loadDepartures]);

  useEffect(() => {
    if (!state.tick) {
      return;
    }
    const diff = differenceInMinutes(state.tick, state.lastRefreshTime);

    if (diff >= HARD_REFRESH_LIMIT_IN_MINUTES) {
      loadDepartures();
    }
  }, [state.tick, state.lastRefreshTime]);

  useInterval(
    loadRealTimeData,
    updateFrequencyInSeconds * 1000,
    [stopPlace.id],
    !isFocused || mode === 'Favourite',
  );
  useInterval(
    () => dispatch({type: 'TICK_TICK'}),
    tickRateInSeconds * 1000,
    [],
    !isFocused || mode === 'Favourite',
  );
  useRefreshOnFocus(
    isFocused,
    state.tick,
    HARD_REFRESH_LIMIT_IN_MINUTES * 60,
    loadDepartures,
    loadRealTimeData,
  );

  return {
    state,
    forceRefresh: loadDepartures,
  };
}

type QueryInput = {
  numberOfDepartures: number;
  startTime: string;
  limitPerLine?: number;
  timeRange?: number;
};

async function fetchEstimatedCalls(
  queryInput: QueryInput,
  stopPlace: StopPlace,
  favoriteDepartures?: UserFavoriteDepartures,
  opts?: AxiosRequestConfig,
): Promise<EstimatedCall[]> {
  const result = await getStopPlaceDepartures(
    {
      id: stopPlace.id,
      startTime: queryInput.startTime,
      numberOfDepartures: queryInput.numberOfDepartures,
      timeRange: queryInput.timeRange,
      limitPerLine: queryInput.limitPerLine,
    },
    favoriteDepartures,
    opts,
  );

  return flatMap(
    result.stopPlace?.quays,
    (quay) => quay.estimatedCalls,
  ) as EstimatedCall[];
}
