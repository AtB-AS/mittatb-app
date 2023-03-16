import {getRealtimeDepartures} from '@atb/api/departures';
import {
  DeparturesVariables,
  getDepartures,
} from '@atb/api/departures/stops-nearest';
import * as DepartureTypes from '@atb/api/types/departures';
import {ErrorType, getAxiosErrorType} from '@atb/api/utils';
import {useFavorites} from '@atb/favorites';
import {UserFavoriteDepartures} from '@atb/favorites';
import {DeparturesRealtimeData} from '@atb/sdk';
import {animateNextChange} from '@atb/utils/animation';
import useInterval from '@atb/utils/use-interval';
import {differenceInMinutes} from 'date-fns';
import {useCallback, useEffect} from 'react';
import useReducerWithSideEffects, {
  NoUpdate,
  ReducerWithSideEffects,
  SideEffect,
  Update,
  UpdateWithSideEffect,
} from 'use-reducer-with-side-effects';
import {updateDeparturesWithRealtimeV2} from '@atb/departure-list/utils';
import {StopPlacesMode} from '@atb/nearby-stop-places';
import {getLimitOfDeparturesPerLineByMode, getTimeRangeByMode} from '../utils';
import {TimeoutRequest, useTimeoutRequest} from '@atb/api/client';
import {AxiosRequestConfig} from 'axios';
import {useRefreshOnFocus} from '@atb/utils/use-refresh-on-focus';
import {flatMap} from '@atb/utils/array';

const MAX_NUMBER_OF_DEPARTURES_PER_QUAY_TO_SHOW = 1000;

// Used to re-trigger full refresh after N minutes.
// To repopulate the view when we get fewer departures.
const HARD_REFRESH_LIMIT_IN_MINUTES = 10;

export type DepartureDataState = {
  data: DepartureTypes.EstimatedCall[] | null;
  tick?: Date;
  error?: {type: ErrorType};
  locationId?: string[];
  isLoading: boolean;
  queryInput: QueryInput;
  lastRefreshTime: Date;
};

const initialQueryInput = {
  numberOfDepartures: MAX_NUMBER_OF_DEPARTURES_PER_QUAY_TO_SHOW,
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
      quayIds: string[];
      startTime?: string;
      favoriteDepartures?: UserFavoriteDepartures;
      limitPerLine?: number;
      timeRange?: number;
      timeout: TimeoutRequest;
    }
  | {
      type: 'LOAD_REALTIME_DATA';
      quayIds: string[];
      favoriteDepartures?: UserFavoriteDepartures;
    }
  | {
      type: 'STOP_LOADER';
    }
  | {
      type: 'UPDATE_DEPARTURES';
      locationId?: string[];
      reset?: boolean;
      result: DepartureTypes.EstimatedCall[];
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
      const queryInput: DeparturesVariables = {
        ids: action.quayIds,
        numberOfDepartures: MAX_NUMBER_OF_DEPARTURES_PER_QUAY_TO_SHOW,
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
        async (_, dispatch) => {
          try {
            action.timeout.start();
            const result = await fetchEstimatedCalls(
              queryInput,
              action.quayIds,
              action.favoriteDepartures,
              {
                signal: action.timeout.signal,
              },
            );
            action.timeout.clear();
            dispatch({
              type: 'UPDATE_DEPARTURES',
              reset: true,
              locationId: action.quayIds,
              result: result,
            });
          } catch (e) {
            const errorType = getAxiosErrorType(e, action.timeout.didTimeout);
            // Not show error msg if the request was cancelled by a new search
            if (errorType === 'cancel') return;
            dispatch({
              type: 'SET_ERROR',
              reset: false,
              error: errorType,
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
            const lineIds = action.favoriteDepartures?.map((f) => f.lineId);
            const realtimeData = await getRealtimeDepartures({
              quayIds: action.quayIds,
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

export function useDeparturesData(
  quayIds: string[],
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
    const limitPerLine = getLimitOfDeparturesPerLineByMode(mode);
    const timeRange = getTimeRangeByMode(mode, startTime);
    dispatch({
      type: 'LOAD_INITIAL_DEPARTURES',
      quayIds,
      startTime,
      favoriteDepartures: activeFavoriteDepartures,
      limitPerLine,
      timeRange,
      timeout,
    });
  }, [JSON.stringify(quayIds), startTime, activeFavoriteDepartures, mode]);
  const loadRealTimeData = useCallback(
    () =>
      dispatch({
        type: 'LOAD_REALTIME_DATA',
        quayIds: quayIds,
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
    quayIds,
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
  timeRange?: number;
  limitPerLine?: number;
};

async function fetchEstimatedCalls(
  queryInput: QueryInput,
  quayIds: string[],
  favoriteDepartures?: UserFavoriteDepartures,
  opts?: AxiosRequestConfig,
): Promise<DepartureTypes.EstimatedCall[]> {
  const result = await getDepartures(
    {
      ids: quayIds,
      startTime: queryInput.startTime,
      numberOfDepartures: queryInput.numberOfDepartures,
      timeRange: queryInput.timeRange,
      limitPerLine: queryInput.limitPerLine,
    },
    favoriteDepartures,
    opts,
  );
  return flatMap(
    result.quays,
    (q) => q.estimatedCalls,
  ) as DepartureTypes.EstimatedCall[];
}
