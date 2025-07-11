import {useEffect} from 'react';
import {Coordinates} from '@atb/utils/coordinates';
import {reverse} from '@atb/api';
import {mapFeatureToLocation} from './utils';
import {useGeocoderReducer, GeocoderState} from './use-geocoder-reducer';
import {getAxiosErrorType} from '@atb/api/utils';
import {SearchLocation} from '@atb/modules/favorites';
import {useTimeoutRequest} from '@atb/api/client';

type ReverseGeocoderState = GeocoderState & {
  closestLocation?: SearchLocation;
  forceRefresh(): void;
};

export function useReverseGeocoder(
  coords: Coordinates | null,
  layers?: string[],
): ReverseGeocoderState {
  const [state, dispatch] = useGeocoderReducer();
  const timeoutRequest = useTimeoutRequest();
  const loadLocations = () => {
    async function reverseCoordLookup() {
      if (coords) {
        try {
          dispatch({type: 'SET_IS_SEARCHING'});
          timeoutRequest.start();
          const response = await reverse(coords, layers, {
            signal: timeoutRequest.signal,
          });
          timeoutRequest.clear();
          dispatch({
            type: 'SET_LOCATIONS',
            locations: response?.data?.map(mapFeatureToLocation),
          });
        } catch (err) {
          dispatch({
            type: 'SET_ERROR',
            error: getAxiosErrorType(err, timeoutRequest.didTimeout),
          });
        }
      } else {
        dispatch({type: 'SET_LOCATIONS', locations: null});
      }
    }

    reverseCoordLookup();
  };
  useEffect(() => {
    loadLocations();

    return () => timeoutRequest.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords?.latitude, coords?.longitude]);

  return {
    ...state,
    locations: state.locations,
    closestLocation: state.locations?.[0],
    forceRefresh: loadLocations,
  };
}
