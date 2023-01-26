import {useEffect, useState} from 'react';
import {FeatureCollection, GeoJSON} from 'geojson';
import {VehicleFragment} from '@atb/api/types/generated/fragments/vehicles';
import {toFeatureCollection, toGeoJSONFeature} from '@atb/components/map/utils';
import {Coordinates} from '@atb/utils/coordinates';
import {getVehicles} from '@atb/api/vehicles';
import {useIsVehiclesEnabled} from '@atb/vehicles/use-vehicles-enabled';

export const useVehicles = () => {
  const [area, setArea] = useState({
    lat: 0,
    lon: 0,
    range: 0,
  });
  const [vehicles, setVehicles] = useState<
    FeatureCollection<GeoJSON.Point, VehicleFragment>
  >(toFeatureCollection([]));
  const isVehiclesEnabled = useIsVehiclesEnabled();

  useEffect(() => {
    const abortCtrl = new AbortController();
    if (isVehiclesEnabled) {
      getVehicles(area, {signal: abortCtrl.signal})
        .then(toGeoJSONFeature)
        .then(toFeatureCollection)
        .then(setVehicles);
    }
    return () => abortCtrl.abort();
  }, [area, isVehiclesEnabled]);

  const fetchVehicles = async (
    {latitude, longitude}: Coordinates,
    radius = 500,
  ) => {
    setArea({
      lat: latitude,
      lon: longitude,
      range: radius,
    });
  };

  return {vehicles, fetchVehicles};
};
