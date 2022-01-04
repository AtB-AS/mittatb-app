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
import {
  DepartureGroupMetadata,
  DepartureGroupsQuery,
} from '@atb/api/departures/departure-group';
import {ErrorType, getAxiosErrorType} from '@atb/api/utils';
// import {useFavorites} from '@atb/favorites';
// import {Location, UserFavoriteDepartures} from '@atb/favorites/types';
import {DeparturesRealtimeData} from '@atb/sdk';
import {
  addDays,
  differenceInMinutes,
  differenceInSeconds,
  parseISO,
} from 'date-fns';
import useInterval from '@atb/utils/use-interval';
import {updateDeparturesWithRealtimeV2} from '../../departure-list/utils';
import {
  getQuayDepartures,
  getStopPlaceDepartures,
} from '@atb/api/departures/stops-nearest';
import * as DepartureTypes from '@atb/api/types/departures';
import {flatMap} from 'lodash';

const DEFAULT_NUMBER_OF_DEPARTURES_PER_QUAY_TO_SHOW = 5;

// Used to re-trigger full refresh after N minutes.
// To repopulate the view when we get fewer departures.
const HARD_REFRESH_LIMIT_IN_MINUTES = 10;
const MIN_TIME_RANGE = 3 * 60 * 60; // Three hours

type LoadType = 'initial' | 'more';

export type DepartureDataState = {
  data: DepartureTypes.EstimatedCall[] | null;
  // showOnlyFavorites: boolean;
  tick?: Date;
  error?: {type: ErrorType; loadType: LoadType};
  locationId?: string;
  isLoading: boolean;
  isFetchingMore: boolean;
  queryInput: DepartureGroupsQuery;
  cursorInfo: DepartureGroupMetadata['metadata'] | undefined;
  lastRefreshTime: Date;
};

const initialQueryInput: DepartureGroupsQuery = {
  limitPerLine: DEFAULT_NUMBER_OF_DEPARTURES_PER_QUAY_TO_SHOW,
  startTime: new Date().toISOString(),
};
const initialState: DepartureDataState = {
  data: null,
  // showOnlyFavorites: false,
  error: undefined,
  locationId: undefined,
  isLoading: false,
  isFetchingMore: false,
  cursorInfo: undefined,
  queryInput: initialQueryInput,
  lastRefreshTime: new Date(),

  // Store date as update tick to know when to rerender
  // and re-sort objects.
  tick: undefined,
};

type DepartureDataActions =
  | {
      type: 'LOAD_INITIAL_DEPARTURES';
      stopPlacePosition: DepartureTypes.StopPlacePosition;
      quay?: DepartureTypes.Quay;
      startTime?: string;
      // favoriteDepartures?: UserFavoriteDepartures;
    }
  | {
      type: 'LOAD_MORE_DEPARTURES';
      stopPlacePosition?: DepartureTypes.StopPlacePosition;
      // favoriteDepartures?: UserFavoriteDepartures;
    }
  // | {
  //     type: 'SET_SHOW_FAVORITES';
  //     showOnlyFavorites: boolean;
  //     location?: Location;
  //     favoriteDepartures?: UserFavoriteDepartures;
  //   }
  | {
      type: 'LOAD_REALTIME_DATA';
      stopPlacePosition?: DepartureTypes.StopPlacePosition;
      quay?: DepartureTypes.Quay;
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
      const stopPlace = action.stopPlacePosition.node?.place;
      if (!stopPlace) return NoUpdate();

      // Update input data with new date as this
      // is a fresh fetch. We should fetch the latest information.
      const queryInput: DepartureGroupsQuery = {
        limitPerLine: action.quay
          ? 1000
          : DEFAULT_NUMBER_OF_DEPARTURES_PER_QUAY_TO_SHOW,
        startTime: action.startTime ?? new Date().toISOString(),
      };

      return UpdateWithSideEffect<DepartureDataState, DepartureDataActions>(
        {
          ...state,
          isLoading: true,
          error: undefined,
          isFetchingMore: true,
          queryInput,
        },
        async (state, dispatch) => {
          try {
            if (!stopPlace) return;
            const result = await fetchEstimatedCalls(
              queryInput,
              action.stopPlacePosition,
              action.quay,
            );

            dispatch({
              type: 'UPDATE_DEPARTURES',
              reset: true,
              locationId: action.quay ? action.quay.id : stopPlace.id,
              result: result,
            });
          } catch (e) {
            dispatch({
              type: 'SET_ERROR',
              reset: stopPlace.id !== state.locationId,
              loadType: 'initial',
              error: getAxiosErrorType(e),
            });
          } finally {
            dispatch({type: 'STOP_LOADER'});
          }
        },
      );
    }

    // case 'LOAD_MORE_DEPARTURES': {
    //   if (!action.stopPlace || !state.cursorInfo?.hasNextPage)
    //     return NoUpdate();
    //   if (state.isFetchingMore) return NoUpdate();

    //   return UpdateWithSideEffect<DepartureDataState, DepartureDataActions>(
    //     {...state, error: undefined, isFetchingMore: true},
    //     async (state, dispatch) => {
    //       try {
    //         // Use previously stored queryInput with stored startTime
    //         // to ensure that we get the same departures.
    //         const result = await getNextDepartureGroups(
    //           {
    //             stopPlace: action.stopPlace,
    //             // favorites: state.showOnlyFavorites
    //             //   ? action.favoriteDepartures
    //             //   : undefined,
    //           },
    //           state.cursorInfo!,
    //         );

    //         if (result) {
    //           dispatch({
    //             type: 'UPDATE_DEPARTURES',
    //             locationId: action.stopPlace?.id,
    //             result,
    //           });
    //         }
    //       } catch (e) {
    //         dispatch({
    //           type: 'SET_ERROR',
    //           loadType: 'more',
    //           error: getAxiosErrorType(e),
    //         });
    //       } finally {
    //         dispatch({type: 'STOP_LOADER'});
    //       }
    //     },
    //   );
    // }

    case 'LOAD_REALTIME_DATA': {
      if (!state.data?.length) return NoUpdate();
      const stopPlace = action.stopPlacePosition?.node?.place;

      return SideEffect<DepartureDataState, DepartureDataActions>(
        async (state2, dispatch) => {
          // Use same query input with same startTime to ensure that
          // we get the same result.
          try {
            const quayIds = action.quay
              ? [action.quay.id]
              : stopPlace?.quays?.map((q) => q.id);

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

    // case 'SET_SHOW_FAVORITES': {
    //   return UpdateWithSideEffect<DepartureDataState, DepartureDataActions>(
    //     {
    //       ...state,
    //       showOnlyFavorites: action.showOnlyFavorites,
    //     },
    //     async (_, dispatch) => {
    //       dispatch({
    //         type: 'LOAD_INITIAL_DEPARTURES',
    //         stopPlace: action.stopPlace,
    //         favoriteDepartures: action.favoriteDepartures,
    //         startTime: state.queryInput?.startTime,
    //       });
    //     },
    //   );
    // }

    case 'UPDATE_DEPARTURES': {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      return Update<DepartureDataState>({
        ...state,
        isLoading: false,
        locationId: action.locationId,
        // data: action.reset
        //   ? action.result.data
        //   : (state.data ?? []).concat(action.result.data),
        data: action.result,
        // cursorInfo: action.result.metadata,
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
          loadType: action.loadType,
        },
        data: action.reset ? null : state.data,
      });
    }

    default:
      return NoUpdate();
  }
};

export function useDepartureData(
  stopPlacePosition: DepartureTypes.StopPlacePosition,
  quay?: DepartureTypes.Quay,
  startTime?: string,
  updateFrequencyInSeconds: number = 10,
  tickRateInSeconds: number = 10,
) {
  const [state, dispatch] = useReducerWithSideEffects(reducer, initialState);
  const isFocused = useIsFocused();
  // const {favoriteDepartures} = useFavorites();
  const stopPlace = stopPlacePosition.node?.place;

  const refresh = useCallback(
    () =>
      dispatch({
        type: 'LOAD_INITIAL_DEPARTURES',
        stopPlacePosition,
        quay,
        startTime,
        // favoriteDepartures,
      }),
    [
      stopPlace?.id,
      quay?.id,
      // favoriteDepartures,
      startTime,
    ],
  );

  // const setShowFavorites = useCallback(
  //   (showOnlyFavorites: boolean) =>
  //     dispatch({
  //       type: 'SET_SHOW_FAVORITES',
  //       showOnlyFavorites,
  //       stopPlace,
  //       favoriteDepartures,
  //     }),
  //   [stopPlace.id, favoriteDepartures],
  // );

  useEffect(refresh, [stopPlace?.id, startTime]);
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
    () => dispatch({type: 'LOAD_REALTIME_DATA', stopPlacePosition, quay: quay}),
    updateFrequencyInSeconds * 1000,
    [stopPlace?.id],
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
    // setShowFavorites,
  };
}

async function fetchEstimatedCalls(
  queryInput: DepartureGroupsQuery,
  stopPlace: DepartureTypes.StopPlacePosition,
  quay?: DepartureTypes.Quay,
): Promise<DepartureTypes.EstimatedCall[]> {
  if (!stopPlace.node?.place) return [];
  let estimatedCalls: DepartureTypes.EstimatedCall[] = [];

  if (quay) {
    // Get seconds until midnight, but a minimum of 3 hours
    const timeUntilMidnight = differenceInSeconds(
      addDays(parseISO(queryInput.startTime), 1).setHours(0, 0, 0),
      parseISO(queryInput.startTime),
    );
    const timeRange = Math.round(Math.max(timeUntilMidnight, MIN_TIME_RANGE));

    const result = await getQuayDepartures({
      id: quay.id,
      startTime: queryInput.startTime,
      numberOfDepartures: queryInput.limitPerLine,
      timeRange: timeRange,
    });
    estimatedCalls = result.quay
      ?.estimatedCalls as DepartureTypes.EstimatedCall[];
  } else {
    const result = await getStopPlaceDepartures({
      id: stopPlace.node.place.id,
      startTime: queryInput.startTime,
      numberOfDepartures: queryInput.limitPerLine,
    });

    estimatedCalls = flatMap(
      result.stopPlace?.quays,
      (quay) => quay.estimatedCalls,
    ) as DepartureTypes.EstimatedCall[];
  }
  return estimatedCalls;
}
