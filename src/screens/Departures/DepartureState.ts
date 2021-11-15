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
import {getRealtimeDeparture} from '@atb/api/departures';
import {
  DepartureGroupMetadata,
  DepartureGroupsQuery,
  getNextDepartureGroups,
} from '@atb/api/departures/departure-group';
import {ErrorType, getAxiosErrorType} from '@atb/api/utils';
// import {useFavorites} from '@atb/favorites';
// import {Location, UserFavoriteDepartures} from '@atb/favorites/types';
import {DeparturesRealtimeData, StopPlaceDetails} from '@atb/sdk';
import {differenceInMinutes} from 'date-fns';
import useInterval from '@atb/utils/use-interval';
import {updateStopsWithRealtime} from '../../departure-list/utils';
import {EstimatedCall, Quay} from '@entur/sdk';
import {
  getQuayDepartures,
  getStopPlaceDepartures,
} from '@atb/api/departures/stops-nearest';

const DEFAULT_NUMBER_OF_DEPARTURES_PER_LINE_TO_SHOW = 7;

// Used to re-trigger full refresh after N minutes.
// To repopulate the view when we get fewer departures.
const HARD_REFRESH_LIMIT_IN_MINUTES = 10;

type LoadType = 'initial' | 'more';

export type DepartureDataState = {
  data: EstimatedCall[] | null;
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
  limitPerLine: DEFAULT_NUMBER_OF_DEPARTURES_PER_LINE_TO_SHOW,
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
      stopPlace: StopPlaceDetails;
      quay?: Quay;
      startTime?: string;
      // favoriteDepartures?: UserFavoriteDepartures;
    }
  | {
      type: 'LOAD_MORE_DEPARTURES';
      stopPlace?: StopPlaceDetails;
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
      if (!action.stopPlace) return NoUpdate();

      // Update input data with new date as this
      // is a fresh fetch. We should fetch the latest information.
      const queryInput: DepartureGroupsQuery = {
        limitPerLine: DEFAULT_NUMBER_OF_DEPARTURES_PER_LINE_TO_SHOW,
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
            // Fresh fetch, reset paging and use new query input with new startTime
            const result = action.quay
              ? await getQuayDepartures({
                  id: action.quay.id,
                })
              : await getStopPlaceDepartures({
                  id: action.stopPlace.id,
                });

            // {
            //   stopPlace: action.stopPlace,
            //   // favorites: state.showOnlyFavorites
            //   //   ? action.favoriteDepartures
            //   //   : undefined,
            // },
            // queryInput,
            dispatch({
              type: 'UPDATE_DEPARTURES',
              reset: true,
              locationId: action.quay ? action.quay.id : action.stopPlace?.id,
              result,
            });
          } catch (e) {
            dispatch({
              type: 'SET_ERROR',
              reset: action.stopPlace?.id !== state.locationId,
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

    // case 'LOAD_REALTIME_DATA': {
    //   if (!state.data?.length) return NoUpdate();

    //   return SideEffect<DepartureDataState, DepartureDataActions>(
    //     async (state2, dispatch) => {
    //       // Use same query input with same startTime to ensure that
    //       // we get the same result.
    //       try {
    //         const realtimeData = await getRealtimeDeparture(
    //           state.data ?? [],
    //           state.queryInput,
    //         );
    //         dispatch({
    //           type: 'UPDATE_REALTIME',
    //           realtimeData,
    //         });
    //       } catch (e) {
    //         console.warn(e);
    //       }
    //     },
    //   );
    // }

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

    // case 'UPDATE_REALTIME': {
    //   LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    //   return Update<DepartureDataState>({
    //     ...state,
    //     data: updateStopsWithRealtime(state.data ?? [], action.realtimeData),

    //     // We set lastUpdated here to count as a "tick" to
    //     // know when to update components while still being performant.
    //     tick: new Date(),
    //   });
    // }

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
  stopPlace: StopPlaceDetails,
  quay?: Quay,
  startTime?: string,
  updateFrequencyInSeconds: number = 30,
  tickRateInSeconds: number = 10,
) {
  const [state, dispatch] = useReducerWithSideEffects(reducer, initialState);
  const isFocused = useIsFocused();
  // const {favoriteDepartures} = useFavorites();

  const refresh = useCallback(
    () =>
      dispatch({
        type: 'LOAD_INITIAL_DEPARTURES',
        stopPlace,
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

  const loadMore = useCallback(
    () =>
      dispatch({
        type: 'LOAD_MORE_DEPARTURES',
        stopPlace,
        // favoriteDepartures
      }),
    [
      stopPlace.id,
      // favoriteDepartures,
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

  useEffect(refresh, [stopPlace.id, startTime]);
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
    () => dispatch({type: 'LOAD_REALTIME_DATA'}),
    updateFrequencyInSeconds * 1000,
    [stopPlace.id],
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
    // setShowFavorites,
  };
}
