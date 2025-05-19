import {useEffect} from 'react';
import {CancelToken, isCancel} from '@atb/api';
import {Coordinates} from '@atb/sdk';
import {autocomplete} from '@atb/api';
import {useGeocoderReducer, GeocoderState} from './use-geocoder-reducer';
import {mapFeatureToLocation} from './utils';
import {getAxiosErrorType} from '@atb/api/utils';

export function useGeocoder(
  text: string | null,
  coords: Coordinates | null,
  onlyLocalTariffZoneAuthority?: boolean,
  onlyStopPlaces?: boolean,
): GeocoderState {
  const [state, dispatch] = useGeocoderReducer();

  useEffect(() => {
    const source = CancelToken.source();
    async function textLookup() {
      if (!text) {
        dispatch({type: 'SET_LOCATIONS', locations: null});
      } else {
        try {
          dispatch({type: 'SET_IS_SEARCHING'});
          const response = await autocomplete(
            text,
            coords,
            onlyLocalTariffZoneAuthority,
            onlyStopPlaces,
            {
              cancelToken: source.token,
            },
          );
          source.token.throwIfRequested();
          dispatch({
            type: 'SET_LOCATIONS',
            locations: response?.data?.map(mapFeatureToLocation),
          });
        } catch (err) {
          if (!isCancel(err)) {
            console.warn(err);
            dispatch({type: 'SET_ERROR', error: getAxiosErrorType(err)});
          } else {
            dispatch({type: 'SET_LOCATIONS', locations: null});
          }
        }
      }
    }

    textLookup();
    return () => source.cancel('Cancelling previous autocomplete');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords?.latitude, coords?.longitude, text, onlyStopPlaces]);

  return state;
}
