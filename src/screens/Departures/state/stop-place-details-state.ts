import {useEffect} from 'react';
import useReducerWithSideEffects, {
  NoUpdate,
  ReducerWithSideEffects,
  Update,
  UpdateWithSideEffect,
} from 'use-reducer-with-side-effects';
import {ErrorType, getAxiosErrorType} from '@atb/api/utils';
import {getStopsDetails} from '@atb/api/departures/stops-nearest';
import {StopsDetailsQuery} from '@atb/api/types/generated/StopsDetailsQuery';
import {TimeoutRequest, useTimeoutRequest} from '@atb/api/client';

export type StopsDetailsDataState = {
  data: StopsDetailsQuery | null;
  error?: {type: ErrorType};
  ids?: Array<string>;
  isLoading: boolean;
};

const initialState: StopsDetailsDataState = {
  data: null,
  error: undefined,
  ids: undefined,
  isLoading: false,
};

type StopsDetailsDataActions =
  | {
      type: 'LOAD_DETAILS';
      locations?: Array<string>;
      timeout: TimeoutRequest;
    }
  | {
      type: 'STOP_LOADER';
    }
  | {
      type: 'UPDATE_STOP_DETAILS';
      ids?: Array<string>;
      result: StopsDetailsQuery;
    }
  | {
      type: 'SET_ERROR';
      error: ErrorType;
    };

const reducer: ReducerWithSideEffects<
  StopsDetailsDataState,
  StopsDetailsDataActions
> = (state, action) => {
  switch (action.type) {
    case 'LOAD_DETAILS': {
      if (!action.locations) return NoUpdate();
      return UpdateWithSideEffect<
        StopsDetailsDataState,
        StopsDetailsDataActions
      >(
        {
          ...state,
          isLoading: true,
          error: undefined,
        },
        async (state, dispatch) => {
          if (!action.locations) return;
          if (action.locations.length === 0) {
            dispatch({
              type: 'UPDATE_STOP_DETAILS',
              ids: action.locations,
              result: {stopPlaces: []},
            });
            return;
          }
          var didTimeOut = false;
          try {
            action.timeout.start();
            const result = await getStopsDetails(
              {ids: action.locations},
              {
                signal: action.timeout.signal,
              },
            );
            action.timeout.clear();
            dispatch({
              type: 'UPDATE_STOP_DETAILS',
              ids: action.locations,
              result,
            });
          } catch (e) {
            dispatch({
              type: 'SET_ERROR',
              error: getAxiosErrorType(e, action.timeout.didTimeout),
            });
          } finally {
            dispatch({type: 'STOP_LOADER'});
          }
        },
      );
    }

    case 'STOP_LOADER': {
      return Update<StopsDetailsDataState>({
        ...state,
        isLoading: false,
      });
    }

    case 'UPDATE_STOP_DETAILS': {
      return Update<StopsDetailsDataState>({
        ...state,
        isLoading: false,
        ids: action.ids,
        data: action.result,
      });
    }

    case 'SET_ERROR': {
      return Update<StopsDetailsDataState>({
        ...state,
        error: {
          type: action.error,
        },
        data: state.data,
      });
    }

    default:
      return NoUpdate();
  }
};

/***
 * Use state for fetching details for a list of stopPlaces
 *
 * @param {Array<string>} [locationIds] - NSR ids to fetch details for
 */
export function useStopsDetailsData(locationIds?: Array<string>) {
  const [state, dispatch] = useReducerWithSideEffects(reducer, initialState);
  const timeout = useTimeoutRequest();
  const loadDetails = () =>
    dispatch({
      type: 'LOAD_DETAILS',
      locations: locationIds,
      timeout: timeout,
    });

  useEffect(() => {
    loadDetails();

    return () => timeout.abort();
  }, [JSON.stringify(locationIds)]);

  return {
    state,
    forceRefresh: loadDetails,
  };
}
