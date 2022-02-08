import {useIsFocused} from '@react-navigation/native';
import {useCallback, useEffect} from 'react';
import {LayoutAnimation} from 'react-native';
import useReducerWithSideEffects, {
  NoUpdate,
  ReducerWithSideEffects,
  SideEffect,
  Update,
  UpdateWithSideEffect,
} from 'use-reducer-with-side-effects';
import {getRealtimeDepartureV2} from '@atb/api/departures';
import {DepartureGroupsQuery} from '@atb/api/departures/departure-group';
import {ErrorType, getAxiosErrorType} from '@atb/api/utils';
import {DeparturesRealtimeData} from '@atb/sdk';
import {
  addDays,
  differenceInMinutes,
  differenceInSeconds,
  parseISO,
} from 'date-fns';
import useInterval from '@atb/utils/use-interval';
import {updateDeparturesWithRealtimeV2} from '../../../departure-list/utils';
import {getQuayDepartures} from '@atb/api/departures/stops-nearest';
import * as DepartureTypes from '@atb/api/types/departures';

const DEFAULT_NUMBER_OF_DEPARTURES_PER_QUAY_TO_SHOW = 1000;

// Used to re-trigger full refresh after N minutes.
// To repopulate the view when we get fewer departures.
const HARD_REFRESH_LIMIT_IN_MINUTES = 10;
const MIN_TIME_RANGE = 3 * 60 * 60; // Three hours

export type DepartureDataState = {
  data: DepartureTypes.EstimatedCall[] | null;
  tick?: Date;
  error?: {type: ErrorType};
  locationId?: string;
  isLoading: boolean;
  queryInput: DepartureGroupsQuery;
  lastRefreshTime: Date;
};

const initialQueryInput = {
  limitPerLine: DEFAULT_NUMBER_OF_DEPARTURES_PER_QUAY_TO_SHOW,
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
    }
  | {
      type: 'LOAD_REALTIME_DATA';
      quay: DepartureTypes.Quay;
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
      const queryInput: DepartureGroupsQuery = {
        limitPerLine: DEFAULT_NUMBER_OF_DEPARTURES_PER_QUAY_TO_SHOW,
        startTime: action.startTime ?? new Date().toISOString(),
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
            const result = await fetchEstimatedCalls(queryInput, action.quay);

            dispatch({
              type: 'UPDATE_DEPARTURES',
              reset: true,
              locationId: action.quay.id,
              result: result,
            });
          } catch (e) {
            dispatch({
              type: 'SET_ERROR',
              reset: false,
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
            const quayIds = [action.quay.id];

            const realtimeData = await getRealtimeDepartureV2(
              quayIds,
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

export function useQuayData(
  quay: DepartureTypes.Quay,
  startTime?: string,
  updateFrequencyInSeconds: number = 10,
  tickRateInSeconds: number = 10,
) {
  const [state, dispatch] = useReducerWithSideEffects(reducer, initialState);
  const isFocused = useIsFocused();

  const refresh = useCallback(
    () =>
      dispatch({
        type: 'LOAD_INITIAL_DEPARTURES',
        quay,
        startTime,
      }),
    [quay?.id, startTime],
  );

  useEffect(refresh, [startTime]);
  useEffect(() => {
    if (!state.tick) {
      return;
    }
    const diff = differenceInMinutes(state.tick, state.lastRefreshTime);

    if (diff >= HARD_REFRESH_LIMIT_IN_MINUTES) {
      refresh();
    }
  }, [state.tick, state.lastRefreshTime]);
  useInterval(
    () => dispatch({type: 'LOAD_REALTIME_DATA', quay: quay}),
    updateFrequencyInSeconds * 1000,
    [quay.id],
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

async function fetchEstimatedCalls(
  queryInput: DepartureGroupsQuery,
  quay: DepartureTypes.Quay,
): Promise<DepartureTypes.EstimatedCall[]> {
  const timeRange = getSecondsUntilMidnightOrMinimum(
    queryInput.startTime,
    MIN_TIME_RANGE,
  );

  const result = await getQuayDepartures({
    id: quay.id,
    startTime: queryInput.startTime,
    numberOfDepartures: queryInput.limitPerLine,
    timeRange: timeRange,
  });
  return result.quay?.estimatedCalls as DepartureTypes.EstimatedCall[];
}
