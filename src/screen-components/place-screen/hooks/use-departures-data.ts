import {
  DepartureRealtimeQuery,
  getRealtimeDepartures,
} from '@atb/api/bff/departures';
import {DeparturesVariables, getDepartures} from '@atb/api/bff/departures';
import {EstimatedCall} from '@atb/api/types/departures';
import {ErrorType, getAxiosErrorType} from '@atb/api/utils';
import {
  useFavoritesContext,
  UserFavoriteDepartures,
} from '@atb/modules/favorites';
import {DeparturesRealtimeData} from '@atb/sdk';
import {animateNextChange} from '@atb/utils/animation';
import {useInterval} from '@atb/utils/use-interval';
import {differenceInMinutes, differenceInSeconds} from 'date-fns';
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import useReducerWithSideEffects, {
  NoUpdate,
  ReducerWithSideEffects,
  SideEffect,
  Update,
  UpdateWithSideEffect,
} from 'use-reducer-with-side-effects';
import {updateDeparturesWithRealtimeV2} from '@atb/departure-list/utils';
import {StopPlacesMode} from '@atb/screen-components/nearby-stop-places';
import {getLimitOfDeparturesPerLineByMode, getTimeRangeByMode} from '../utils';
import {TimeoutRequest, useTimeoutRequest} from '@atb/api/client';
import {AxiosRequestConfig} from 'axios';
import {flatMap} from '@atb/utils/array';

// Used to re-trigger full refresh after N minutes.
// To repopulate the view when we get fewer departures.
const HARD_REFRESH_LIMIT_IN_MINUTES = 10;

export type DepartureDataState = {
  data: EstimatedCall[] | null;
  tick?: Date;
  error?: {type: ErrorType};
  locationId?: string[];
  isLoading: boolean;
};

const initialState: DepartureDataState = {
  data: null,
  error: undefined,
  locationId: undefined,
  isLoading: false,

  // Store date as update tick to know when to rerender
  // and re-sort objects.
  tick: undefined,
};

type DepartureDataActions =
  | {
      type: 'LOAD_INITIAL_DEPARTURES';
      quayIds: string[];
      startTime: string;
      limitPerQuay: number;
      favoriteDepartures?: UserFavoriteDepartures;
      limitPerLine?: number;
      timeRange?: number;
      timeout: TimeoutRequest;
      lastHardRefreshTime: MutableRefObject<Date>;
      lastRealtimeRefreshTime: MutableRefObject<Date>;
    }
  | {
      type: 'LOAD_REALTIME_DATA';
      quayIds: string[];
      startTime: string;
      limitPerQuay: number;
      limitPerLine?: number;
      timeRange: number;
      favoriteDepartures?: UserFavoriteDepartures;
      lastRealtimeRefreshTime: MutableRefObject<Date>;
    }
  | {
      type: 'STOP_LOADER';
    }
  | {
      type: 'UPDATE_DEPARTURES';
      locationId?: string[];
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
      if (!action.quayIds.length) return NoUpdate();

      // Update input data with new date as this
      // is a fresh fetch. We should fetch the latest information.
      const queryInput: DeparturesVariables = {
        ids: action.quayIds,
        numberOfDepartures: action.limitPerQuay,
        startTime: action.startTime,
        limitPerLine: action.limitPerLine,
        timeRange: action.timeRange,
      };

      return UpdateWithSideEffect<DepartureDataState, DepartureDataActions>(
        {
          ...state,
          isLoading: true,
          error: undefined,
        },
        async (_, dispatch) => {
          try {
            action.timeout.start();
            const result = await fetchEstimatedCalls(
              queryInput,
              action.favoriteDepartures,
              {
                signal: action.timeout.signal,
              },
            );
            action.timeout.clear();
            action.lastHardRefreshTime.current = new Date();
            action.lastRealtimeRefreshTime.current = new Date();
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
      const lineIds = action.favoriteDepartures?.map((f) => f.lineId);
      const queryInput: DepartureRealtimeQuery = {
        quayIds: action.quayIds,
        startTime: action.startTime,
        limit: action.limitPerQuay,
        limitPerLine: action.limitPerLine,
        timeRange: action.timeRange,
        lineIds,
      };
      return SideEffect<DepartureDataState, DepartureDataActions>(
        async (_, dispatch) => {
          try {
            const realtimeData = await getRealtimeDepartures(queryInput);
            action.lastRealtimeRefreshTime.current = new Date();
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
      });
    }

    case 'UPDATE_REALTIME': {
      animateNextChange();
      return Update<DepartureDataState>({
        ...state,
        data: updateDeparturesWithRealtimeV2(state.data, action.realtimeData),
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
  limitPerQuay: number,
  showOnlyFavorites: boolean,
  isFocused: boolean,
  mode: StopPlacesMode,
  startTime?: string,
  updateFrequencyInSeconds: number = 30,
  tickRateInSeconds: number = 10,
) {
  const [state, dispatch] = useReducerWithSideEffects(reducer, initialState);
  const {favoriteDepartures, potentiallyMigrateFavoriteDepartures} =
    useFavoritesContext();
  const [queryStartTime, setQueryStartTime] = useState<string | undefined>();
  const [timeRange, setTimeRange] = useState<number | undefined>();
  const lastHardRefreshTime = useRef<Date>(new Date());
  const lastRealtimeRefreshTime = useRef<Date>(new Date());
  const activeFavoriteDepartures = showOnlyFavorites
    ? favoriteDepartures
    : undefined;
  const limitPerLine = getLimitOfDeparturesPerLineByMode(mode);

  const timeout = useTimeoutRequest();

  const loadDepartures = useCallback(() => {
    const updatedQueryStartTime = startTime ?? new Date().toISOString();
    setQueryStartTime(updatedQueryStartTime);
    const updatedTimeRange = getTimeRangeByMode(mode, updatedQueryStartTime);
    setTimeRange(updatedTimeRange);
    dispatch({
      type: 'LOAD_INITIAL_DEPARTURES',
      quayIds,
      startTime: updatedQueryStartTime,
      limitPerLine,
      limitPerQuay,
      timeRange: updatedTimeRange,
      favoriteDepartures: activeFavoriteDepartures,
      timeout,
      lastHardRefreshTime,
      lastRealtimeRefreshTime,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(quayIds), startTime, activeFavoriteDepartures, mode]);

  const loadRealTimeData = useCallback(() => {
    if (!queryStartTime || !timeRange) return;
    dispatch({
      type: 'LOAD_REALTIME_DATA',
      quayIds,
      startTime: queryStartTime,
      limitPerLine,
      limitPerQuay,
      timeRange,
      favoriteDepartures: activeFavoriteDepartures,
      lastRealtimeRefreshTime,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(quayIds),
    queryStartTime,
    limitPerLine,
    limitPerQuay,
    timeRange,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(activeFavoriteDepartures),
  ]);

  useEffect(() => {
    loadDepartures();
    return () => timeout.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadDepartures]);
  useEffect(() => {
    if (!state.tick) return;

    const timeSinceLastHardRefresh = differenceInMinutes(
      state.tick,
      lastHardRefreshTime.current,
    );
    const timeSinceLastRealtimeRefresh = differenceInSeconds(
      state.tick,
      lastRealtimeRefreshTime.current,
      // Rounding up makes ticks 10, 20 and 30s instead of 9, 19, and 29
      {roundingMethod: 'ceil'},
    );

    if (timeSinceLastHardRefresh >= HARD_REFRESH_LIMIT_IN_MINUTES) {
      loadDepartures();
    } else if (timeSinceLastRealtimeRefresh >= updateFrequencyInSeconds) {
      loadRealTimeData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.tick]);
  useInterval(
    () => dispatch({type: 'TICK_TICK'}),
    [dispatch],
    tickRateInSeconds * 1000,
    !isFocused || mode === 'Favourite',
    // Trigger immediately on focus only if the view is already initialized
    !!state.tick,
  );

  useEffect(() => {
    const estimatedCalls = state.data;
    estimatedCalls && potentiallyMigrateFavoriteDepartures(estimatedCalls);
  }, [state.data, potentiallyMigrateFavoriteDepartures]);

  return {
    state,
    forceRefresh: loadDepartures,
  };
}

async function fetchEstimatedCalls(
  queryInput: DeparturesVariables,
  favoriteDepartures?: UserFavoriteDepartures,
  opts?: AxiosRequestConfig,
): Promise<EstimatedCall[]> {
  const result = await getDepartures(queryInput, favoriteDepartures, opts);
  return flatMap(result.quays, (q) => q.estimatedCalls) as EstimatedCall[];
}
