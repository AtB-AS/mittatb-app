import {Location} from '../favorites/types';
import {useReducer} from 'react';

export type GeocoderState = {
  locations: Location[] | null;
  isSearching: boolean;
  hasError: boolean;
};

type GeocoderReducerAction =
  | {
      locations: Location[] | null;
      type: 'SET_LOCATIONS';
    }
  | {
      type: 'SET_IS_SEARCHING';
    }
  | {type: 'SET_HAS_ERROR'};

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
        hasError: false,
      };
    case 'SET_IS_SEARCHING':
      return {
        locations: prevState.locations,
        isSearching: true,
        hasError: false,
      };
    case 'SET_HAS_ERROR':
      return {
        locations: null,
        isSearching: false,
        hasError: true,
      };
  }
};

const initialState: GeocoderState = {
  locations: null,
  isSearching: false,
  hasError: false,
};

export default function useGeocoderReducer() {
  return useReducer<GeocoderReducer>(geocoderReducer, initialState);
}
