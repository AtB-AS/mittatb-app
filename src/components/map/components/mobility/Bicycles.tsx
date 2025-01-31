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
import {NsrProps} from '../national-stop-registry-features/NationalStopRegistryFeatures';
import {getFilterWhichAlsoHidesSelectedFeature} from '../national-stop-registry-features/nsr-utils';
import {getClusterPropertiesWithVehicleTypeFormFactorProp} from './Scooters';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {useFeatureCollectionWithExtraProps} from './Stations';

type Props = {
  selectedFeaturePropertyId: NsrProps['selectedFeaturePropertyId'];
  bicycles: FeatureCollection<GeoJSON.Point, VehicleBasicFragment>;
  onMapItemClick: (e: OnPressEvent) => void;
  onClusterClick: (
    e: OnPressEvent,
    clustersSource: RefObject<ShapeSource>,
  ) => void;
};

export const Bicycles = ({
  selectedFeaturePropertyId,
  bicycles,
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

  const bicyclesWithVehicleTypeFormFactor = useFeatureCollectionWithExtraProps(
    bicycles,
    () => ({vehicle_type_form_factor: FormFactor.Bicycle}),
  );

  return (
    <>
      <MapboxGL.ShapeSource
        id="bicycleClusters"
        ref={clustersSource}
        shape={bicyclesWithVehicleTypeFormFactor}
        tolerance={0}
        cluster
        hitbox={hitboxCoveringIconOnly}
        maxZoomLevel={SCOOTERS_MAX_ZOOM_LEVEL}
        clusterMaxZoomLevel={SCOOTERS_MAX_CLUSTER_LEVEL}
        clusterRadius={SCOOTERS_CLUSTER_RADIUS}
        clusterProperties={getClusterPropertiesWithVehicleTypeFormFactorProp(
          FormFactor.Bicycle,
        )}
        onPress={(e) => onClusterClick(e, clustersSource)}
      >
        <MapboxGL.SymbolLayer
          id="bicycleClusterIcon"
          filter={clusteredFilter}
          minZoomLevel={13.5}
          style={{
            ...iconStyle,
            ...textStyle,
          }}
        />
      </MapboxGL.ShapeSource>
      <MapboxGL.ShapeSource
        id="bicycle"
        ref={vehiclesSource}
        shape={bicyclesWithVehicleTypeFormFactor}
        tolerance={0}
        cluster
        hitbox={hitboxCoveringIconOnly}
        maxZoomLevel={SCOOTERS_MAX_ZOOM_LEVEL}
        clusterRadius={SCOOTERS_CLUSTER_RADIUS}
        clusterMaxZoomLevel={SCOOTERS_MAX_CLUSTER_LEVEL}
        onPress={onMapItemClick}
      >
        <MapboxGL.SymbolLayer
          id="bicycleIcon"
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
