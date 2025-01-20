import MapboxGL, {ShapeSource} from '@rnmapbox/maps';
import {OnPressEvent} from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';
import React, {RefObject, useRef} from 'react';
import {StationsWithCount} from './Stations';
import {hitboxCoveringIconOnly, useMapSymbolStyles} from '@atb/components/map';
import {NsrProps} from '../national-stop-registry-features/NationalStopRegistryFeatures';
import {getFilterWhichAlsoHidesSelectedFeature} from '../national-stop-registry-features/nsr-utils';
import {getClusterPropertiesWithVehicleTypeFormFactorProp} from './Scooters';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';

type Props = {
  selectedFeaturePropertyId: NsrProps['selectedFeaturePropertyId'];
  stations: StationsWithCount;
  onClusterClick: (
    e: OnPressEvent,
    clustersSource: RefObject<ShapeSource>,
  ) => void;
};

export const CarStations = ({
  selectedFeaturePropertyId,
  stations,
  onClusterClick,
}: Props) => {
  const clustersSource = useRef<MapboxGL.ShapeSource>(null);

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
    'station',
  );

  return (
    <>
      <MapboxGL.ShapeSource
        id="carStation"
        shape={stations}
        cluster
        hitbox={hitboxCoveringIconOnly}
      >
        <MapboxGL.SymbolLayer
          id="carStationPin"
          filter={unclusteredFilter}
          minZoomLevel={12}
          style={{
            ...textStyle,
            ...iconStyle,
          }}
        />
      </MapboxGL.ShapeSource>
      <MapboxGL.ShapeSource
        id="carStationCluster"
        ref={clustersSource}
        shape={stations}
        cluster
        hitbox={hitboxCoveringIconOnly}
        clusterProperties={{
          ...getClusterPropertiesWithVehicleTypeFormFactorProp(FormFactor.Car),
          count: ['+', ['get', 'count']],
        }}
        onPress={(e) => onClusterClick(e, clustersSource)}
      >
        <MapboxGL.SymbolLayer
          id="carStationClusterPin"
          minZoomLevel={12}
          filter={clusteredFilter}
          style={{
            ...textStyle,
            ...iconStyle,
          }}
        />
      </MapboxGL.ShapeSource>
    </>
  );
};
