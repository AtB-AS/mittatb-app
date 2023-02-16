import {useEffect, useState} from 'react';
import {FeatureCollection, GeoJSON} from 'geojson';
import {VehicleFragment} from '@atb/api/types/generated/fragments/vehicles';
import {toFeatureCollection, toGeoJSONFeature} from '@atb/components/map/utils';
import {getVehicles} from '@atb/api/vehicles';
import {useIsVehiclesEnabled} from '@atb/vehicles/use-vehicles-enabled';
import {FetchVehicleOpts} from '@atb/components/map/types';

const MIN_ZOOM_LEVEL = 13.5;

export const useVehicles = () => {
  const [area, setArea] = useState({
    lat: 0,
    lon: 0,
    zoom: 15,
    range: 0,
  });
  const [vehicles, setVehicles] = useState<
    FeatureCollection<GeoJSON.Point, VehicleFragment>
  >(toFeatureCollection([]));
  const isVehiclesEnabled = useIsVehiclesEnabled();

  useEffect(() => {
    const abortCtrl = new AbortController();
    if (isVehiclesEnabled) {
      if (area.zoom > MIN_ZOOM_LEVEL) {
        getVehicles(area, {signal: abortCtrl.signal})
          .then(toGeoJSONFeature)
          .then(toFeatureCollection)
          .then(setVehicles);
      } else {
        setVehicles(toFeatureCollection([]));
      }
    }
    return () => abortCtrl.abort();
  }, [area, isVehiclesEnabled]);

  const fetchVehicles = async ({
    coordinates: {latitude, longitude},
    zoom,
    radius,
  }: FetchVehicleOpts) => {
    setArea({
      lat: latitude,
      lon: longitude,
      zoom,
      range: radius ?? 500,
    });
  };

  return {vehicles, fetchVehicles};
};
