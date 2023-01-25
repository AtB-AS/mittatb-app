import {useState} from 'react';
import {VehicleFragment} from '@atb/api/types/generated/fragments/vehicles';
import {FeatureCollection, GeoJSON} from 'geojson';
import {MapProps} from '@atb/components/map/types';
import {RegionPayload} from '@react-native-mapbox-gl/maps';
import {toFeatureCollection} from '@atb/components/map/utils';

export const useVehicles = (mapProps: MapProps) => {
  const [vehicles, setVehicles] = useState<
    FeatureCollection<GeoJSON.Point, VehicleFragment>
  >(toFeatureCollection([]));

  const onRegionChange = (
    feature: GeoJSON.Feature<GeoJSON.Point, RegionPayload>,
  ) => {
    if (mapProps.selectionMode !== 'ExploreStops') return;
    const [longitude, latitude] = feature.geometry.coordinates;
    mapProps.fetchVehicles({longitude, latitude}).then(setVehicles);
  };

  return {
    vehicles,
    onRegionChange,
  };
};
