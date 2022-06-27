import {useCallback, useEffect} from 'react';
import useReducerWithSideEffects, {
  NoUpdate,
  ReducerWithSideEffects,
  Update,
  UpdateWithSideEffect,
} from 'use-reducer-with-side-effects';
import {DepartureGroupMetadata} from '@atb/api/departures/departure-group';
import {ErrorType, getAxiosErrorType} from '@atb/api/utils';
import {Location} from '@atb/favorites/types';
import {getNearestStops} from '@atb/api/departures/stops-nearest';
import {NearestStopPlacesQuery} from '@atb/api/types/generated/NearestStopPlacesQuery';

type LoadType = 'initial' | 'more';

export type DepartureDataState = {
  data: NearestStopPlacesQuery | null;
  error?: {type: ErrorType; loadType: LoadType};
  locationId?: string;
  isLoading: boolean;
  cursorInfo: DepartureGroupMetadata['metadata'] | undefined;
};

const initialState: DepartureDataState = {
  data: null,
  error: undefined,
  locationId: undefined,
  isLoading: false,
  cursorInfo: undefined,
};

type DepartureDataActions =
  | {
      type: 'LOAD_NEAREST_STOP_PLACES';
      location?: Location;
    }
  | {
      type: 'STOP_LOADER';
    }
  | {
      type: 'UPDATE_STOP_PLACES';
      locationId?: string;
      reset?: boolean;
      result: NearestStopPlacesQuery;
    }
  | {
      type: 'SET_ERROR';
      loadType: LoadType;
      error: ErrorType;
      reset?: boolean;
    };

const reducer: ReducerWithSideEffects<
  DepartureDataState,
  DepartureDataActions
> = (state, action) => {
  switch (action.type) {
    case 'LOAD_NEAREST_STOP_PLACES': {
      if (!action.location) return NoUpdate();
      return UpdateWithSideEffect<DepartureDataState, DepartureDataActions>(
        {
          ...state,
          isLoading: true,
          error: undefined,
        },
        async (state, dispatch) => {
          if (!action.location) return;
          try {
            const result = await getNearestStops({
              latitude: action.location.coordinates.latitude,
              longitude: action.location.coordinates.longitude,
              count: 10,
              distance: 3000,
            });
            dispatch({
              type: 'UPDATE_STOP_PLACES',
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

    case 'STOP_LOADER': {
      return Update<DepartureDataState>({
        ...state,
        isLoading: false,
      });
    }

    case 'UPDATE_STOP_PLACES': {
      return Update<DepartureDataState>({
        ...state,
        isLoading: false,
        locationId: action.locationId,
        data: action.result,
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
 * Use state for fetching StopPlaces in proximity to a location
 *
 * @param {Location} [location] - Location to fetch nearby stopPlaces to
 */
export function useNearestStopsData(location?: Location) {
  const [state, dispatch] = useReducerWithSideEffects(reducer, initialState);

  const loadData = useCallback(
    () =>
      dispatch({
        type: 'LOAD_NEAREST_STOP_PLACES',
        location,
      }),
    [location?.id],
  );

  useEffect(loadData, [location?.id]);

  return {
    state,
  };
}
