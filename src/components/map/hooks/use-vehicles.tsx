import {useEffect, useState} from 'react';
import {getVehicles} from '@atb/api/vehicles';
import {VehicleFragment} from '@atb/api/types/generated/fragments/vehicles';
import {Coordinates} from '@atb/utils/coordinates';
import {
  Feature,
  FeatureCollection,
  GeoJSON,
  GeoJsonProperties,
  Geometry,
} from 'geojson';

const toGeoJSONFeature = (vehicleFragments: VehicleFragment[]) =>
  vehicleFragments.map<GeoJSON.Feature<GeoJSON.Point, VehicleFragment>>(
    (v) => ({
      id: v.id,
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [v.lon, v.lat],
      },
      properties: v,
    }),
  );

const toFeatureCollection = <
  G extends Geometry | null = Geometry,
  P = GeoJsonProperties,
>(
  features: Array<Feature<G, P>>,
): FeatureCollection<G, P> => ({
  type: 'FeatureCollection',
  features,
});

export const useVehicles = (
  {latitude: lat, longitude: lon}: Coordinates,
  zoom: number,
) => {
  const [vehicles, setVehicles] = useState<VehicleFragment[]>([]);
  useEffect(() => {
    if (zoom > 13) {
      console.log(
        `useVehicles: Deps changed. Loading vehicles: ${JSON.stringify({
          lat,
          lon,
          zoom,
        })}`,
      );
      getVehicles({lat, lon, range: 500}).then(setVehicles);
    }
  }, [lat, lon, zoom]);

  return {
    vehicles,
    vehiclesFeatureCollection: toFeatureCollection(toGeoJSONFeature(vehicles)),
  };
};
