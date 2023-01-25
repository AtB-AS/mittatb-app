import {useEffect, useState} from 'react';
import {FeatureCollection, GeoJSON} from 'geojson';
import {VehicleFragment} from '@atb/api/types/generated/fragments/vehicles';
import {toFeatureCollection, toGeoJSONFeature} from '@atb/components/map/utils';
import {Coordinates} from '@atb/utils/coordinates';
import {getVehicles} from '@atb/api/vehicles';
import {useIsVehiclesEnabled} from '@atb/vehicles/use-vehicles-enabled';

export const useVehicles = () => {
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [range, setRange] = useState(500);
  const [vehicles, setVehicles] = useState<
    FeatureCollection<GeoJSON.Point, VehicleFragment>
  >(toFeatureCollection([]));
  const isVehiclesEnabled = useIsVehiclesEnabled();

  useEffect(() => {
    if (isVehiclesEnabled) {
      getVehicles({lat, lon, range})
        .then(toGeoJSONFeature)
        .then(toFeatureCollection)
        .then(setVehicles);
    }
  }, [lon, lat, range, isVehiclesEnabled]);

  const fetchVehicles = async (
    {latitude, longitude}: Coordinates,
    radius = 500,
  ) => {
    setLat(latitude);
    setLon(longitude);
    setRange(radius);
  };

  return {vehicles, fetchVehicles};
};
