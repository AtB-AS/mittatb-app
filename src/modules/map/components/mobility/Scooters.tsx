import React, {RefObject, useRef} from 'react';
import {FeatureCollection, GeoJSON} from 'geojson';
import {VehicleBasicFragment} from '@atb/api/types/generated/fragments/vehicles';
import MapboxGL, {ShapeSource} from '@rnmapbox/maps';
import {useTransportColor} from '@atb/utils/use-transport-color';
import {Mode} from '@atb/api/types/generated/journey_planner_v3_types';
import {OnPressEvent} from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';
import {
  hitboxCoveringIconOnly,
  SCOOTERS_CLUSTER_RADIUS,
  SCOOTERS_MAX_CLUSTER_LEVEL,
  SCOOTERS_MAX_ZOOM_LEVEL,
} from '@atb/modules/map';

type Props = {
  scooters: FeatureCollection<GeoJSON.Point, VehicleBasicFragment>;
  onClusterClick: (
    e: OnPressEvent,
    clustersSource: RefObject<ShapeSource | null>,
  ) => void;
};

export const Scooters = ({scooters, onClusterClick}: Props) => {
  const clustersSource = useRef<MapboxGL.ShapeSource>(null);
  const vehiclesSource = useRef<MapboxGL.ShapeSource>(null);
  const scooterColor = useTransportColor(Mode.Scooter).primary.background;

  return (
    <>
      <MapboxGL.ShapeSource
        id="scooterClusters"
        ref={clustersSource}
        shape={scooters}
        tolerance={0}
        cluster
        hitbox={hitboxCoveringIconOnly}
        maxZoomLevel={SCOOTERS_MAX_ZOOM_LEVEL}
        clusterMaxZoomLevel={SCOOTERS_MAX_CLUSTER_LEVEL}
        clusterRadius={SCOOTERS_CLUSTER_RADIUS}
        onPress={(e) => onClusterClick(e, clustersSource)}
      >
        <MapboxGL.SymbolLayer
          id="scooterClusterIcon"
          filter={['has', 'point_count']}
          minZoomLevel={13.5}
          style={{
            iconImage: 'ScooterCluster',
            iconSize: 0.85,
            iconAllowOverlap: true,
          }}
        />
        <MapboxGL.SymbolLayer
          id="scooterClusterCountCircle"
          filter={['has', 'point_count']}
          minZoomLevel={13.5}
          aboveLayerID="scooterClusterIcon"
          style={{
            iconImage: 'ClusterCount',
            iconAllowOverlap: true,
            iconTranslate: [13, -13],
          }}
        />
        <MapboxGL.SymbolLayer
          id="scooterClusterCount"
          filter={['has', 'point_count']}
          minZoomLevel={13.5}
          aboveLayerID="scooterClusterCountCircle"
          style={{
            textField: ['get', 'point_count'],
            textColor: scooterColor,
            textSize: 11,
            textTranslate: [13, -13],
            textAllowOverlap: true,
          }}
        />
      </MapboxGL.ShapeSource>
      <MapboxGL.ShapeSource
        id="scooter"
        ref={vehiclesSource}
        shape={scooters}
        tolerance={0}
        cluster
        hitbox={hitboxCoveringIconOnly}
        maxZoomLevel={SCOOTERS_MAX_ZOOM_LEVEL}
        clusterRadius={SCOOTERS_CLUSTER_RADIUS}
        clusterMaxZoomLevel={SCOOTERS_MAX_CLUSTER_LEVEL}
      >
        <MapboxGL.SymbolLayer
          id="scooterIcon"
          filter={['!', ['has', 'point_count']]}
          minZoomLevel={13.5}
          style={{
            textField: ['concat', ['get', 'currentFuelPercent'], '%'],
            textAnchor: 'center',
            textOffset: [0.7, -0.25],
            textColor: scooterColor,
            textSize: 11,
            iconImage: 'ScooterChip',
            iconSize: 0.85,
            iconAllowOverlap: true,
          }}
        />
      </MapboxGL.ShapeSource>
    </>
  );
};
