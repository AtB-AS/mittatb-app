import React, {RefObject, useRef} from 'react';
import {FeatureCollection, GeoJSON} from 'geojson';
import {VehicleBasicFragment} from '@atb/api/types/generated/fragments/vehicles';
import MapboxGL, {ShapeSource} from '@rnmapbox/maps';
import {useTransportColor} from '@atb/utils/use-transport-color';
import {Mode} from '@atb/api/types/generated/journey_planner_v3_types';
import {OnPressEvent} from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';
import {hitboxCoveringIconOnly} from '@atb/modules/map';

type Props = {
  bicycles: FeatureCollection<GeoJSON.Point, VehicleBasicFragment>;
  onClusterClick: (
    e: OnPressEvent,
    clustersSource: RefObject<ShapeSource | null>,
  ) => void;
};

export const Bicycles = ({bicycles, onClusterClick}: Props) => {
  const clustersSource = useRef<MapboxGL.ShapeSource>(null);
  const vehiclesSource = useRef<MapboxGL.ShapeSource>(null);
  const bicycleColor = useTransportColor(Mode.Bicycle);

  return (
    <>
      <MapboxGL.ShapeSource
        id="bicycleClusters"
        ref={clustersSource}
        shape={bicycles}
        tolerance={0}
        cluster
        hitbox={hitboxCoveringIconOnly}
        maxZoomLevel={22}
        clusterMaxZoomLevel={21}
        onPress={(e) => onClusterClick(e, clustersSource)}
      >
        <MapboxGL.SymbolLayer
          id="bicycleClusterIcon"
          filter={['has', 'point_count']}
          minZoomLevel={13.5}
          style={{
            iconImage: 'BikeCluster',
            iconSize: 0.85,
            iconAllowOverlap: true,
          }}
        />
        <MapboxGL.SymbolLayer
          id="bicycleClusterCountCircle"
          filter={['has', 'point_count']}
          minZoomLevel={13.5}
          aboveLayerID="bicycleClusterIcon"
          style={{
            iconImage: 'ClusterCount',
            iconAllowOverlap: true,
            iconTranslate: [13, -13],
          }}
        />
        <MapboxGL.SymbolLayer
          id="bicycleClusterCount"
          filter={['has', 'point_count']}
          minZoomLevel={13.5}
          aboveLayerID="bicycleClusterCountCircle"
          style={{
            textField: ['get', 'point_count'],
            textColor: bicycleColor.primary.background,
            textSize: 11,
            textTranslate: [13, -13],
            textAllowOverlap: true,
          }}
        />
      </MapboxGL.ShapeSource>
      <MapboxGL.ShapeSource
        id="bicycle"
        ref={vehiclesSource}
        shape={bicycles}
        tolerance={0}
        cluster
        hitbox={hitboxCoveringIconOnly}
        maxZoomLevel={22}
        clusterMaxZoomLevel={21}
      >
        <MapboxGL.SymbolLayer
          id="bicycleIcon"
          filter={['!', ['has', 'point_count']]}
          minZoomLevel={13.5}
          style={{
            iconImage: 'BikePin',
            iconSize: 0.85,
            iconAllowOverlap: true,
          }}
        />
      </MapboxGL.ShapeSource>
    </>
  );
};
