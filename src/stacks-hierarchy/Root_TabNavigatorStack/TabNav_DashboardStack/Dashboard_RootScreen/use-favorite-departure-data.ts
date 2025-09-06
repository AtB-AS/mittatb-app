import {useIsFocused} from '@react-navigation/native';
import {MutableRefObject, useCallback, useEffect, useRef} from 'react';
import useReducerWithSideEffects, {
  NoUpdate,
  ReducerWithSideEffects,
  SideEffect,
  Update,
  UpdateWithSideEffect,
} from 'use-reducer-with-side-effects';
import {getStopPlaceGroupRealtime} from '@atb/api/bff/departures';

import {DepartureGroupMetadata} from '@atb/api/bff/types';
import {ErrorType, getAxiosErrorType} from '@atb/api/utils';
import {useFavoritesContext} from '@atb/modules/favorites';
import {UserFavoriteDepartures} from '@atb/modules/favorites';
import {DeparturesRealtimeData} from '@atb/api/bff/departures';
import {differenceInMinutes, differenceInSeconds} from 'date-fns';
import {useInterval} from '@atb/utils/use-interval';
import {updateStopsWithRealtime} from '@atb/departure-list/utils';
import {animateNextChange} from '@atb/utils/animation';

import {flatten} from 'lodash';
import {DepartureLineInfo} from '@atb/api/bff/types';
import type {DateOptionAndValue} from '@atb/components/date-selection';
import {
  DepartureFavoritesQuery,
  getFavouriteDepartures,
} from '@atb/api/bff/departure-favorites';

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
  searchTime: DateOptionAndValue<'now'>;
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
      dashboardFavoriteDepartures: UserFavoriteDepartures;
      lastHardRefreshTime: MutableRefObject<Date>;
      lastRealtimeRefreshTime: MutableRefObject<Date>;
    }
  | {
      type: 'LOAD_REALTIME_DATA';
      favoriteDepartureIds: string[];
      lastRealtimeRefreshTime: MutableRefObject<Date>;
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
        includeCancelledTrips: true,
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
              action.dashboardFavoriteDepartures,
              queryInput,
            );
            action.lastHardRefreshTime.current = new Date();
            action.lastRealtimeRefreshTime.current = new Date();

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
              {
                limitPerLine: state.queryInput.limitPerLine,
                startTime: state.queryInput.startTime,
                lineIds: action.favoriteDepartureIds,
              },
            );
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
          ? (action.result?.data ?? [])
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
  const lastHardRefreshTime = useRef<Date>(new Date());
  const lastRealtimeRefreshTime = useRef<Date>(new Date());

  const [state, dispatch] = useReducerWithSideEffects(reducer, {
    ...initialState,
    searchTime: {option: 'now', date: searchDate},
    queryInput: {
      limitPerLine: DEFAULT_NUMBER_OF_DEPARTURES_PER_LINE_TO_SHOW,
      startTime: searchDate,
      includeCancelledTrips: true,
    },
    lastRefreshTime: new Date(),
  });
  const isFocused = useIsFocused();
  const {favoriteDepartures, potentiallyMigrateFavoriteDepartures} =
    useFavoritesContext();
  const dashboardFavoriteDepartures = favoriteDepartures.filter(
    (f) => f.visibleOnDashboard,
  );

  const dashboardFavoriteDepartureIds = dashboardFavoriteDepartures.map(
    (f) => f.id,
  );
  const loadInitialDepartures = useCallback(
    () =>
      dispatch({
        type: 'LOAD_INITIAL_DEPARTURES',
        dashboardFavoriteDepartures,
        lastHardRefreshTime,
        lastRealtimeRefreshTime,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(dashboardFavoriteDepartureIds), favoriteDepartures],
  );

  useEffect(() => {
    const stopPlaceGroups = state.data;
    if (!stopPlaceGroups?.length) return;

    const departureLineInfos = flatten(
      flatten(
        stopPlaceGroups.map((stopPlaceGroup) =>
          stopPlaceGroup?.quays.map((quay) =>
            quay.group?.map((groupItem) => groupItem.lineInfo),
          ),
        ),
      ),
    ).filter((departureLineInfo) => !!departureLineInfo) as DepartureLineInfo[];

    potentiallyMigrateFavoriteDepartures(departureLineInfos);
  }, [state.data, potentiallyMigrateFavoriteDepartures]);

  const dashboardFavoriteLineIds = dashboardFavoriteDepartures.map(
    (f) => f.lineId,
  );
  const loadRealTimeData = useCallback(
    () =>
      dispatch({
        type: 'LOAD_REALTIME_DATA',
        favoriteDepartureIds: dashboardFavoriteLineIds,
        lastRealtimeRefreshTime,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(dashboardFavoriteLineIds)],
  );

  useEffect(() => {
    if (!state.tick) {
      return;
    }
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
      loadInitialDepartures();
    } else if (timeSinceLastRealtimeRefresh >= updateFrequencyInSeconds) {
      loadRealTimeData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.tick]);
  useInterval(
    () => dispatch({type: 'TICK_TICK'}),
    [dispatch],
    tickRateInSeconds * 1000,
    !isFocused,
    // Trigger immediately on focus only if the view is already initialized
    !!state.tick,
  );

  return {
    state,
    loadInitialDepartures,
    searchDate,
  };
}
