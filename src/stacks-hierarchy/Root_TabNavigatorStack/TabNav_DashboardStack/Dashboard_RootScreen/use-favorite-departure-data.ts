import {useIsFocused} from '@react-navigation/native';
import {useCallback, useEffect} from 'react';
import useReducerWithSideEffects, {
  NoUpdate,
  ReducerWithSideEffects,
  SideEffect,
  Update,
  UpdateWithSideEffect,
} from 'use-reducer-with-side-effects';
import {
  getFavouriteDepartures,
  getStopPlaceGroupRealtime,
} from '@atb/api/departures';
import {
  DepartureFavoritesQuery,
  DepartureGroupMetadata,
} from '@atb/api/departures/departure-group';
import {ErrorType, getAxiosErrorType} from '@atb/api/utils';
import {useFavorites} from '@atb/favorites';
import {UserFavoriteDepartures} from '@atb/favorites/types';
import {DeparturesRealtimeData} from '@atb/sdk';
import {differenceInMinutes} from 'date-fns';
import useInterval from '@atb/utils/use-interval';
import {updateStopsWithRealtime} from '@atb/departure-list/utils';
import {SearchTime} from '@atb/journey-date-picker';
import {animateNextChange} from '@atb/utils/animation';
import {useRefreshOnFocus} from '@atb/utils/use-refresh-on-focus';

const DEFAULT_NUMBER_OF_DEPARTURES_PER_LINE_TO_SHOW = 7;

// Used to re-trigger full refresh after N minutes.
// To repopulate the view when we get fewer departures.
const HARD_REFRESH_LIMIT_IN_MINUTES = 10;

type LoadType = 'initial' | 'more';

export type DepartureDataState = {
  data: DepartureGroupMetadata['data'] | null;
  showOnlyFavorites: boolean;
  tick?: Date;
  error?: {type: ErrorType; loadType: LoadType};
  isLoading: boolean;
  isFetchingMore: boolean;
  queryInput: DepartureFavoritesQuery;
  cursorInfo: DepartureGroupMetadata['metadata'] | undefined;
  lastRefreshTime: Date;
  searchTime: SearchTime;
};

const initialState: Omit<
  DepartureDataState,
  'searchTime' | 'queryInput' | 'lastRefreshTime'
> = {
  data: null,
  showOnlyFavorites: false,
  error: undefined,
  isLoading: false,
  isFetchingMore: false,
  cursorInfo: undefined,
  // Store date as update tick to know when to rerender
  // and re-sort objects.
  tick: undefined,
};

type DepartureDataActions =
  | {
      type: 'LOAD_INITIAL_DEPARTURES';
      favoriteDepartures?: UserFavoriteDepartures;
    }
  | {
      type: 'LOAD_REALTIME_DATA';
    }
  | {
      type: 'STOP_LOADER';
    }
  | {
      type: 'UPDATE_DEPARTURES';
      reset?: boolean;
      result: DepartureGroupMetadata | null;
    }
  | {
      type: 'SET_ERROR';
      loadType: LoadType;
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
      const {option, date} = state.searchTime;

      const startTime = option === 'now' ? new Date().toISOString() : date;

      const queryInput: DepartureFavoritesQuery = {
        limitPerLine: DEFAULT_NUMBER_OF_DEPARTURES_PER_LINE_TO_SHOW,
        startTime,
      };

      return UpdateWithSideEffect<DepartureDataState, DepartureDataActions>(
        {
          ...state,
          isLoading: true,
          error: undefined,
          isFetchingMore: true,
          searchTime: {option, date: startTime},
          lastRefreshTime: new Date(),
          queryInput,
        },
        async (_, dispatch) => {
          try {
            // Fresh fetch, reset paging and use new query input with new startTime
            const result = await getFavouriteDepartures(
              action.favoriteDepartures || [],
              queryInput,
            );

            dispatch({
              type: 'UPDATE_DEPARTURES',
              reset: true,
              result: result,
            });
          } catch (e) {
            dispatch({
              type: 'SET_ERROR',
              loadType: 'initial',
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
            const realtimeData = await getStopPlaceGroupRealtime(
              state.data ?? [],
              state.queryInput,
            );
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
        isFetchingMore: false,
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
        data: action.reset
          ? action.result?.data ?? []
          : (state.data ?? []).concat(action.result?.data ?? []),
        cursorInfo: action.result?.metadata,
        tick: new Date(),
      });
    }

    case 'UPDATE_REALTIME': {
      animateNextChange();
      return Update<DepartureDataState>({
        ...state,
        data: updateStopsWithRealtime(state.data ?? [], action.realtimeData),

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
          loadType: action.loadType,
        },
        data: action.reset ? null : state.data,
      });
    }

    default:
      return NoUpdate();
  }
};

/***
 * Use state for fetching departure groups and keeping data up to date with realtime
 * predictions.
 *
 * @param {number} [updateFrequencyInSeconds=30] - frequency to fetch new data from realtime endpoint. Should not be too frequent as it can fetch a lot of data.
 * @param {number} [tickRateInSeconds=10] - "tick frequency" is how often we retrigger time calculations and sorting. More frequent means more CPU load/battery drain. Less frequent can mean outdated data.
 */
export function useFavoriteDepartureData(
  updateFrequencyInSeconds: number = 30,
  tickRateInSeconds: number = 10,
) {
  const searchDate = new Date().toISOString();

  const [state, dispatch] = useReducerWithSideEffects(reducer, {
    ...initialState,
    searchTime: {option: 'now', date: searchDate},
    queryInput: {
      limitPerLine: DEFAULT_NUMBER_OF_DEPARTURES_PER_LINE_TO_SHOW,
      startTime: searchDate,
    },
    lastRefreshTime: new Date(),
  });
  const isFocused = useIsFocused();
  const {favoriteDepartures} = useFavorites();
  const dashboardFavorites = favoriteDepartures.filter(
    (f) => f.visibleOnDashboard,
  );

  const dashboardFavoriteIds = dashboardFavorites.map((f) => f.id);
  const loadInitialDepartures = useCallback(
    () =>
      dispatch({
        type: 'LOAD_INITIAL_DEPARTURES',
        favoriteDepartures: dashboardFavorites,
      }),
    [JSON.stringify(dashboardFavoriteIds)],
  );

  useEffect(() => {
    if (!state.tick) {
      return;
    }
    const diff = differenceInMinutes(state.tick, state.lastRefreshTime);

    if (diff >= HARD_REFRESH_LIMIT_IN_MINUTES) {
      loadInitialDepartures();
    }
  }, [state.tick, state.lastRefreshTime]);
  useRefreshOnFocus(
    state.tick,
    HARD_REFRESH_LIMIT_IN_MINUTES * 60,
    loadInitialDepartures,
    useCallback(() => dispatch({type: 'LOAD_REALTIME_DATA'}), []),
  );

  useInterval(
    () => dispatch({type: 'LOAD_REALTIME_DATA'}),
    updateFrequencyInSeconds * 1000,
    [],
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
    loadInitialDepartures,
    searchDate,
  };
}
