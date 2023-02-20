import {getRealtimeDepartures} from '@atb/api/departures';
import {
  getQuayDepartures,
  QuayDeparturesVariables,
} from '@atb/api/departures/stops-nearest';
import * as DepartureTypes from '@atb/api/types/departures';
import {ErrorType, getAxiosErrorType} from '@atb/api/utils';
import {useFavorites} from '@atb/favorites';
import {UserFavoriteDepartures} from '@atb/favorites/types';
import {DeparturesRealtimeData} from '@atb/sdk';
import {animateNextChange} from '@atb/utils/animation';
import useInterval from '@atb/utils/use-interval';
import {useIsFocused} from '@react-navigation/native';
import {
  addDays,
  differenceInMinutes,
  differenceInSeconds,
  parseISO,
} from 'date-fns';
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

const MAX_NUMBER_OF_DEPARTURES_PER_QUAY_TO_SHOW = 1000;

// Used to re-trigger full refresh after N minutes.
// To repopulate the view when we get fewer departures.
const HARD_REFRESH_LIMIT_IN_MINUTES = 10;

export type DepartureDataState = {
  data: DepartureTypes.EstimatedCall[] | null;
  tick?: Date;
  error?: {type: ErrorType};
  locationId?: string;
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
      quay: DepartureTypes.Quay;
      startTime?: string;
      favoriteDepartures?: UserFavoriteDepartures;
      limitPerLine?: number;
      timeRange?: number;
      timeout: TimeoutRequest;
    }
  | {
      type: 'LOAD_REALTIME_DATA';
      quay: DepartureTypes.Quay;
      favoriteDepartures?: UserFavoriteDepartures;
    }
  | {
      type: 'STOP_LOADER';
    }
  | {
      type: 'UPDATE_DEPARTURES';
      locationId?: string;
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
      const queryInput: QuayDeparturesVariables = {
        id: action.quay.id,
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
              action.quay,
              action.favoriteDepartures,
              {
                signal: action.timeout.signal,
              },
            );
            action.timeout.clear();
            dispatch({
              type: 'UPDATE_DEPARTURES',
              reset: true,
              locationId: action.quay.id,
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
              quayIds: [action.quay.id],
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

export function useQuayData(
  quay: DepartureTypes.Quay,
  showOnlyFavorites: boolean,
  mode: StopPlacesMode,
  startTime?: string,
  updateFrequencyInSeconds: number = 30,
  tickRateInSeconds: number = 10,
) {
  const [state, dispatch] = useReducerWithSideEffects(reducer, initialState);
  const isFocused = useIsFocused();
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
      quay,
      startTime,
      favoriteDepartures: activeFavoriteDepartures,
      limitPerLine,
      timeRange,
      timeout,
    });
  }, [quay, startTime, activeFavoriteDepartures, mode]);
  const loadRealTimeData = useCallback(
    () =>
      dispatch({
        type: 'LOAD_REALTIME_DATA',
        quay,
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
    [quay.id],
    !isFocused || mode !== 'Departure',
  );
  useInterval(
    () => dispatch({type: 'TICK_TICK'}),
    tickRateInSeconds * 1000,
    [],
    !isFocused || mode !== 'Departure',
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

// Get seconds until midnight, but a minimum of `minSeconds`
export function getSecondsUntilMidnightOrMinimum(
  isoTime: string,
  minimumSeconds: number = 0,
): number {
  const timeUntilMidnight = differenceInSeconds(
    addDays(parseISO(isoTime), 1).setHours(0, 0, 0),
    parseISO(isoTime),
  );
  return Math.round(Math.max(timeUntilMidnight, minimumSeconds));
}

type QueryInput = {
  numberOfDepartures: number;
  startTime: string;
  timeRange?: number;
  limitPerLine?: number;
};

async function fetchEstimatedCalls(
  queryInput: QueryInput,
  quay: DepartureTypes.Quay,
  favoriteDepartures?: UserFavoriteDepartures,
  opts?: AxiosRequestConfig,
): Promise<DepartureTypes.EstimatedCall[]> {
  const result = await getQuayDepartures(
    {
      id: quay.id,
      startTime: queryInput.startTime,
      numberOfDepartures: queryInput.numberOfDepartures,
      timeRange: queryInput.timeRange,
      limitPerLine: queryInput.limitPerLine,
    },
    favoriteDepartures,
    opts,
  );
  return result.quay?.estimatedCalls as DepartureTypes.EstimatedCall[];
}
