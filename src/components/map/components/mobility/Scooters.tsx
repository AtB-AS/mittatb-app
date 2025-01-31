import React, {RefObject, useRef} from 'react';
import {FeatureCollection} from 'geojson';
import {VehicleBasicFragment} from '@atb/api/types/generated/fragments/vehicles';
import MapboxGL, {ShapeSource} from '@rnmapbox/maps';
import {OnPressEvent} from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';
import {
  hitboxCoveringIconOnly,
  SCOOTERS_CLUSTER_RADIUS,
  SCOOTERS_MAX_CLUSTER_LEVEL,
  SCOOTERS_MAX_ZOOM_LEVEL,
  useMapSymbolStyles,
} from '@atb/components/map';
import {getFilterWhichAlsoHidesSelectedFeature} from '../national-stop-registry-features/nsr-utils';
import {NsrProps} from '../national-stop-registry-features/NationalStopRegistryFeatures';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {useFeatureCollectionWithExtraProps} from './Stations';

type Props = {
  selectedFeaturePropertyId: NsrProps['selectedFeaturePropertyId'];
  scooters: FeatureCollection<GeoJSON.Point, VehicleBasicFragment>;
  onMapItemClick: (e: OnPressEvent) => void;
  onClusterClick: (
    e: OnPressEvent,
    clustersSource: RefObject<ShapeSource>,
  ) => void;
};

export const Scooters = ({
  selectedFeaturePropertyId,
  scooters,
  onMapItemClick,
  onClusterClick,
}: Props) => {
  const clustersSource = useRef<MapboxGL.ShapeSource>(null);
  const vehiclesSource = useRef<MapboxGL.ShapeSource>(null);

  const clusteredFilter = getFilterWhichAlsoHidesSelectedFeature(
    ['all', ['has', 'point_count']],
    selectedFeaturePropertyId,
  );
  const unclusteredFilter = getFilterWhichAlsoHidesSelectedFeature(
    ['all', ['!', ['has', 'point_count']]],
    selectedFeaturePropertyId,
  );

  const {textStyle, iconStyle} = useMapSymbolStyles(
    selectedFeaturePropertyId,
    'vehicle',
  );

  // make sure all scooters have vehicle_type_form_factor, which is used by SelectedFeatureIcon
  const scootersWithVehicleTypeFormFactor = useFeatureCollectionWithExtraProps(
    scooters,
    () => ({vehicle_type_form_factor: FormFactor.Scooter}),
  );

  return (
    <>
      <MapboxGL.ShapeSource
        id="scooterClusters"
        ref={clustersSource}
        shape={scootersWithVehicleTypeFormFactor}
        tolerance={0}
        cluster
        hitbox={hitboxCoveringIconOnly}
        maxZoomLevel={SCOOTERS_MAX_ZOOM_LEVEL}
        clusterMaxZoomLevel={SCOOTERS_MAX_CLUSTER_LEVEL}
        clusterRadius={SCOOTERS_CLUSTER_RADIUS}
        clusterProperties={getClusterPropertiesWithVehicleTypeFormFactorProp(
          FormFactor.Scooter,
        )}
        onPress={(e) => onClusterClick(e, clustersSource)}
      >
        <MapboxGL.SymbolLayer
          id="scooterClusterIcon"
          filter={clusteredFilter}
          minZoomLevel={13.5}
          style={{
            ...iconStyle,
            ...textStyle,
          }}
        />
      </MapboxGL.ShapeSource>
      <MapboxGL.ShapeSource
        id="scooter"
        ref={vehiclesSource}
        shape={scootersWithVehicleTypeFormFactor}
        tolerance={0}
        cluster
        hitbox={hitboxCoveringIconOnly}
        maxZoomLevel={SCOOTERS_MAX_ZOOM_LEVEL}
        clusterRadius={SCOOTERS_CLUSTER_RADIUS}
        clusterMaxZoomLevel={SCOOTERS_MAX_CLUSTER_LEVEL}
        onPress={onMapItemClick}
      >
        <MapboxGL.SymbolLayer
          id="scooterIcon"
          filter={unclusteredFilter}
          minZoomLevel={13.5}
          style={{
            ...iconStyle,
            ...textStyle,
          }}
        />
      </MapboxGL.ShapeSource>
    </>
  );
};

// mapbox's clusterProperties requires an accumulator
// this just adds vehicle_type_form_factor to all
export const getClusterPropertiesWithVehicleTypeFormFactorProp = (
  vehicle_type_form_factor: FormFactor,
) => ({
  vehicle_type_form_factor: [
    ['coalesce', ['accumulated'], vehicle_type_form_factor],
    vehicle_type_form_factor,
  ],
});
