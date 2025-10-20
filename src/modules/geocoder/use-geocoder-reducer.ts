import {SearchLocation} from '@atb/modules/favorites';
import {useReducer} from 'react';
import {AxiosErrorKind} from '@atb/api/utils';

export type GeocoderState = {
  locations: SearchLocation[] | null;
  isSearching: boolean;
  error?: AxiosErrorKind;
};

type GeocoderReducerAction =
  | {
      locations: SearchLocation[] | null;
      type: 'SET_LOCATIONS';
    }
  | {
      type: 'SET_IS_SEARCHING';
    }
  | {type: 'SET_ERROR'; error: AxiosErrorKind};

type GeocoderReducer = (
  prevState: GeocoderState,
  action: GeocoderReducerAction,
) => GeocoderState;

export const geocoderReducer: GeocoderReducer = (prevState, action) => {
  switch (action.type) {
    case 'SET_LOCATIONS':
      return {
        locations: action.locations,
        isSearching: false,
        error: undefined,
      };
    case 'SET_IS_SEARCHING':
      return {
        locations: prevState.locations,
        isSearching: true,
        error: undefined,
      };
    case 'SET_ERROR':
      return {
        locations: null,
        isSearching: false,
        error: action.error,
      };
  }
};

const initialState: GeocoderState = {
  locations: null,
  isSearching: false,
  error: undefined,
};

export function useGeocoderReducer() {
  return useReducer(geocoderReducer, initialState);
}
