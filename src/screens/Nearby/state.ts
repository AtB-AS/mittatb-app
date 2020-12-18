import {useIsFocused} from '@react-navigation/native';
import {useCallback, useEffect} from 'react';
import useReducerWithSideEffects, {
  NoUpdate,
  ReducerWithSideEffects,
  SideEffect,
  Update,
  UpdateWithSideEffect,
} from 'use-reducer-with-side-effects';
import {getDepartureGroups, getRealtimeDeparture} from '../../api/departures';
import {
  DepartureGroupMetadata,
  DepartureGroupsQuery,
  getNextDepartureGroups,
} from '../../api/departures/departure-group';
import {ErrorType, getAxiosErrorType} from '../../api/utils';
import {Location} from '../../favorites/types';
import {DeparturesRealtimeData} from '../../sdk';
import {differenceInMinutesStrings} from '../../utils/date';
import useInterval from '../../utils/use-interval';
import {updateStopsWithRealtime} from './utils';

const DEFAULT_NUMBER_OF_DEPARTURES_PER_LINE_TO_SHOW = 7;

// Used to re-trigger full refresh after N minutes.
// To repopulate the view when we get fewer departures.
const HARD_REFRESH_LIMIT_IN_MINUTES = 10;

type LoadType = 'initial' | 'more';

export type DepartureDataState = {
  data: DepartureGroupMetadata['data'] | null;
  tick?: Date;
  error?: {type: ErrorType; loadType: LoadType};
  locationId?: string;
  isLoading: boolean;
  isFetchingMore: boolean;
  queryInput: DepartureGroupsQuery;
  cursorInfo: DepartureGroupMetadata['metadata'] | undefined;
};

const initialQueryInput: DepartureGroupsQuery = {
  limitPerLine: DEFAULT_NUMBER_OF_DEPARTURES_PER_LINE_TO_SHOW,
  startTime: new Date(),
};
const initialState: DepartureDataState = {
  data: null,
  error: undefined,
  locationId: undefined,
  isLoading: false,
  isFetchingMore: false,
  cursorInfo: undefined,
  queryInput: initialQueryInput,

  // Store date as update tick to know when to rerender
  // and re-sort objects.
  tick: undefined,
};

type DepartureDataActions =
  | {
      type: 'LOAD_INITIAL_DEPARTURES';
      location: Location | undefined;
    }
  | {
      type: 'LOAD_MORE_DEPARTURES';
      location: Location | undefined;
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
      if (!action.location) return NoUpdate();

      // Update input data with new date as this
      // is a fresh fetch. We should fetch tha latest information.
      const queryInput: DepartureGroupsQuery = {
        limitPerLine: DEFAULT_NUMBER_OF_DEPARTURES_PER_LINE_TO_SHOW,
        startTime: new Date(),
      };

      return UpdateWithSideEffect<DepartureDataState, DepartureDataActions>(
        {
          ...state,
          isLoading: true,
          error: undefined,
          isFetchingMore: true,
          queryInput,
        },
        async (state2, dispatch) => {
          try {
            // Fresh fetch, reset paging and use new query input with new startTime
            const result = await getDepartureGroups(
              {location: action.location!},
              queryInput,
            );
            dispatch({
              type: 'UPDATE_DEPARTURES',
              reset: true,
              locationId: action.location?.id,
              result,
            });
          } catch (e) {
            dispatch({
              type: 'SET_ERROR',
              reset: action.location?.id !== state.locationId,
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
      if (!action.location || !state.cursorInfo?.hasNextPage) return NoUpdate();
      if (state.isFetchingMore) return NoUpdate();

      return UpdateWithSideEffect<DepartureDataState, DepartureDataActions>(
        {...state, error: undefined, isFetchingMore: true},
        async (state, dispatch) => {
          try {
            // Use previously stored queryInput with stored startTime
            // to ensure that we get the same departures.
            const result = await getNextDepartureGroups(
              {location: action.location!},
              state.cursorInfo!,
            );

            if (result) {
              dispatch({
                type: 'UPDATE_DEPARTURES',
                locationId: action.location?.id,
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
            const realtimeData = await getRealtimeDeparture(
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
  location?: Location,
  updateFrequencyInSeconds: number = 30,
  tickRateInSeconds: number = 10,
) {
  const [state, dispatch] = useReducerWithSideEffects(reducer, initialState);
  const isFocused = useIsFocused();

  const refresh = useCallback(
    () => dispatch({type: 'LOAD_INITIAL_DEPARTURES', location}),
    [location?.id],
  );

  const loadMore = useCallback(
    () => dispatch({type: 'LOAD_MORE_DEPARTURES', location}),
    [location?.id],
  );

  useEffect(refresh, [location?.id]);
  useEffect(() => {
    if (!state.tick) {
      return;
    }
    const diff = differenceInMinutesStrings(
      state.tick,
      state.queryInput.startTime,
    );

    if (diff >= HARD_REFRESH_LIMIT_IN_MINUTES) {
      refresh();
    }
  }, [state.tick, state.queryInput.startTime]);
  useInterval(
    () => dispatch({type: 'LOAD_REALTIME_DATA'}),
    updateFrequencyInSeconds * 1000,
    [location?.id],
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
    loadMore,
  };
}
