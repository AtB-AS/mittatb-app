import {useEffect} from 'react';
import {CancelToken, isCancel} from '../api/client';
import {Coordinates} from '../sdk';
import {reverse} from '../api';
import {mapFeatureToLocation} from './utils';
import useGeocoderReducer, {GeocoderState} from './use-geocoder-reducer';

export default function useReverseGeocoder(
  coords: Coordinates | null,
): GeocoderState {
  const [state, dispatch] = useGeocoderReducer();

  useEffect(() => {
    const source = CancelToken.source();
    async function reverseCoordLookup() {
      if (coords) {
        try {
          dispatch({type: 'SET_IS_SEARCHING'});
          const response = await reverse(coords, {
            cancelToken: source.token,
          });
          source.token.throwIfRequested();

          dispatch({
            type: 'SET_LOCATIONS',
            locations: response?.data?.map(mapFeatureToLocation),
          });
        } catch (err) {
          if (!isCancel(err)) {
            console.warn(err);
            dispatch({type: 'SET_HAS_ERROR'});
          } else {
            dispatch({type: 'SET_LOCATIONS', locations: null});
          }
        }
      } else {
        dispatch({type: 'SET_LOCATIONS', locations: null});
      }
    }

    reverseCoordLookup();
    return () => source.cancel('Cancelling previous reverse');
  }, [coords?.latitude, coords?.longitude]);

  return state;
}
