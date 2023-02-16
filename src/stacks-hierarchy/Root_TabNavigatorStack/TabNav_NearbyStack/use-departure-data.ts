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
  getDepartureGroups,
  getStopPlaceGroupRealtime,
} from '@atb/api/departures';
import {
  DepartureFavoritesQuery,
  DepartureGroupMetadata,
  DepartureGroupsPayloadLocation,
  getNextDepartureGroups,
} from '@atb/api/departures/departure-group';
import {ErrorType, getAxiosErrorType} from '@atb/api/utils';
import {useFavorites} from '@atb/favorites';
import {Location, UserFavoriteDepartures} from '@atb/favorites/types';
import {DeparturesRealtimeData} from '@atb/sdk';
import {differenceInMinutes} from 'date-fns';
import useInterval from '@atb/utils/use-interval';
import {updateStopsWithRealtime} from '@atb/departure-list/utils';
import {SearchTime} from './types';
import {animateNextChange} from '@atb/utils/animation';
import {StopPlace} from '@atb/api/types/trips';

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
  locationId?: string;
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
  locationId: undefined,
  isLoading: false,
  isFetchingMore: false,
  cursorInfo: undefined,
  // Store date as update tick to know when to rerender
  // and re-sort objects.
  tick: undefined,
};

type DepartureDataActions =
  | {
      type: 'SET_SEARCH_TIME';
      searchTime: SearchTime;
      locationOrStopPlace?: Location | StopPlace;
      favoriteDepartures?: UserFavoriteDepartures;
    }
  | {
      type: 'LOAD_INITIAL_DEPARTURES';
      locationOrStopPlace?: Location | StopPlace;
      favoriteDepartures?: UserFavoriteDepartures;
    }
  | {
      type: 'LOAD_MORE_DEPARTURES';
      locationOrStopPlace?: Location | StopPlace;
      favoriteDepartures?: UserFavoriteDepartures;
    }
  | {
      type: 'SET_SHOW_FAVORITES';
      showOnlyFavorites: boolean;
      locationOrStopPlace?: Location | StopPlace;
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
      locationId?: string;
      reset?: boolean;
      result: DepartureGroupMetadata;
      fromLocation?: Location | StopPlace;
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
      if (!action.locationOrStopPlace) return NoUpdate();
      const locationOrStopPlace = action.locationOrStopPlace;

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
        async (state, dispatch) => {
          try {
            // Fresh fetch, reset paging and use new query input with new startTime
            const result = await getDepartureGroups(
              {
                location: getPayloadLocation(locationOrStopPlace),
                favorites: state.showOnlyFavorites
                  ? action.favoriteDepartures
                  : undefined,
              },
              queryInput,
            );
            dispatch({
              type: 'UPDATE_DEPARTURES',
              reset: true,
              locationId: locationOrStopPlace.id,
              fromLocation: locationOrStopPlace,
              result,
            });
          } catch (e) {
            dispatch({
              type: 'SET_ERROR',
              reset: locationOrStopPlace.id !== state.locationId,
              loadType: 'initial',
              error: getAxiosErrorType(e),
            });
          } finally {
            dispatch({type: 'STOP_LOADER'});
          }
        },
      );
    }

    case 'LOAD_MORE_DEPARTURES': {
      if (!action.locationOrStopPlace || !state.cursorInfo?.hasNextPage)
        return NoUpdate();
      const locationOrStopPlace = action.locationOrStopPlace;
      if (state.isFetchingMore) return NoUpdate();

      return UpdateWithSideEffect<DepartureDataState, DepartureDataActions>(
        {...state, error: undefined, isFetchingMore: true},
        async (state, dispatch) => {
          try {
            // Use previously stored queryInput with stored startTime
            // to ensure that we get the same departures.
            const result = await getNextDepartureGroups(
              {
                location: getPayloadLocation(locationOrStopPlace),
                favorites: state.showOnlyFavorites
                  ? action.favoriteDepartures
                  : undefined,
              },
              state.cursorInfo!,
            );

            if (result) {
              dispatch({
                type: 'UPDATE_DEPARTURES',
                locationId: locationOrStopPlace?.id,
                result,
              });
            }
          } catch (e) {
            dispatch({
              type: 'SET_ERROR',
              loadType: 'more',
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
        async (state2, dispatch) => {
          // Use same query input with same startTime to ensure that
          // we get the same result.
          try {
            const realtimeData = await getStopPlaceGroupRealtime(
              state.data ?? [],
              {
                limitPerLine: state.queryInput.limitPerLine,
                startTime: state.queryInput.startTime,
              },
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

    case 'SET_SHOW_FAVORITES': {
      return UpdateWithSideEffect<DepartureDataState, DepartureDataActions>(
        {
          ...state,
          showOnlyFavorites: action.showOnlyFavorites,
        },
        async (_, dispatch) => {
          dispatch({
            type: 'LOAD_INITIAL_DEPARTURES',
            locationOrStopPlace: action.locationOrStopPlace,
            favoriteDepartures: action.favoriteDepartures,
          });
        },
      );
    }

    case 'SET_SEARCH_TIME': {
      return UpdateWithSideEffect<DepartureDataState, DepartureDataActions>(
        {
          ...state,
          searchTime: action.searchTime,
        },
        async (_, dispatch) => {
          dispatch({
            type: 'LOAD_INITIAL_DEPARTURES',
            locationOrStopPlace: action.locationOrStopPlace,
            favoriteDepartures: action.favoriteDepartures,
          });
        },
      );
    }

    case 'UPDATE_DEPARTURES': {
      animateNextChange();
      return Update<DepartureDataState>({
        ...state,
        isLoading: false,
        locationId: action.locationId,
        data: action.reset
          ? action.result.data
          : (state.data ?? []).concat(action.result.data),
        cursorInfo: action.result.metadata,
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
 * @param {Location} [location] - Location on which to fetch departures from. Can be venue or address
 * @param {number} [updateFrequencyInSeconds=30] - frequency to fetch new data from realtime endpoint. Should not be too frequent as it can fetch a lot of data.
 * @param {number} [tickRateInSeconds=10] - "tick frequency" is how often we retrigger time calculations and sorting. More frequent means more CPU load/battery drain. Less frequent can mean outdated data.
 */
export function useDepartureData(
  locationOrStopPlace?: Location | StopPlace,
  updateFrequencyInSeconds: number = 30,
  tickRateInSeconds: number = 10,
) {
  const [state, dispatch] = useReducerWithSideEffects(reducer, {
    ...initialState,
    searchTime: {option: 'now', date: new Date().toISOString()},
    queryInput: {
      limitPerLine: DEFAULT_NUMBER_OF_DEPARTURES_PER_LINE_TO_SHOW,
      startTime: new Date().toISOString(),
    },
    lastRefreshTime: new Date(),
  });
  const isFocused = useIsFocused();
  const {favoriteDepartures} = useFavorites();

  const setSearchTime = useCallback(
    (searchTime: SearchTime) =>
      dispatch({
        type: 'SET_SEARCH_TIME',
        searchTime,
        locationOrStopPlace,
        favoriteDepartures,
      }),
    [locationOrStopPlace?.id, favoriteDepartures],
  );

  const loadInitialDepartures = useCallback(
    () =>
      dispatch({
        type: 'LOAD_INITIAL_DEPARTURES',
        locationOrStopPlace,
        favoriteDepartures,
      }),
    [locationOrStopPlace?.id, favoriteDepartures],
  );

  const loadMore = useCallback(
    () =>
      dispatch({
        type: 'LOAD_MORE_DEPARTURES',
        locationOrStopPlace,
        favoriteDepartures,
      }),
    [locationOrStopPlace?.id, favoriteDepartures],
  );

  const setShowFavorites = useCallback(
    (showOnlyFavorites: boolean) =>
      dispatch({
        type: 'SET_SHOW_FAVORITES',
        showOnlyFavorites,
        locationOrStopPlace,
        favoriteDepartures,
      }),
    [locationOrStopPlace?.id, favoriteDepartures],
  );

  useEffect(loadInitialDepartures, [locationOrStopPlace?.id]);
  useEffect(() => {
    if (!state.tick) {
      return;
    }
    const diff = differenceInMinutes(state.tick, state.lastRefreshTime);

    if (diff >= HARD_REFRESH_LIMIT_IN_MINUTES) {
      loadInitialDepartures();
    }
  }, [state.tick, state.lastRefreshTime]);
  useInterval(
    () => dispatch({type: 'LOAD_REALTIME_DATA'}),
    updateFrequencyInSeconds * 1000,
    [locationOrStopPlace?.id],
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
    loadMore,
    setSearchTime,
    setShowFavorites,
    loadInitialDepartures,
  };
}

function getPayloadLocation(
  locationOrStopPlace: Location | StopPlace,
): DepartureGroupsPayloadLocation {
  // locationOrStopPlace is Location
  if ('resultType' in locationOrStopPlace) {
    return locationOrStopPlace.resultType === 'search'
      ? locationOrStopPlace
      : {
          layer: 'address',
          coordinates: locationOrStopPlace.coordinates,
        };
  } else {
    // locationOrStopPlace is StopPlace
    return {
      id: locationOrStopPlace.id,
      layer: 'venue',
    };
  }
}
