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

export const BikeStations = ({
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
        id="bikeStations"
        shape={stations}
        cluster
        hitbox={hitboxCoveringIconOnly}
      >
        <MapboxGL.SymbolLayer
          id="bikeStationPin"
          filter={unclusteredFilter}
          minZoomLevel={13}
          style={{
            ...textStyle,
            ...iconStyle,
          }}
        />
      </MapboxGL.ShapeSource>
      <MapboxGL.ShapeSource
        id="bikeStationCluster"
        shape={stations}
        ref={clustersSource}
        cluster
        hitbox={hitboxCoveringIconOnly}
        clusterProperties={{
          ...getClusterPropertiesWithVehicleTypeFormFactorProp(
            FormFactor.Bicycle,
          ),
          count: ['+', ['get', 'count']],
        }}
        onPress={(e) => onClusterClick(e, clustersSource)}
      >
        <MapboxGL.SymbolLayer
          id="bikeStationClusterPin"
          filter={clusteredFilter}
          minZoomLevel={13}
          style={{
            ...textStyle,
            ...iconStyle,
          }}
        />
      </MapboxGL.ShapeSource>
    </>
  );
};
