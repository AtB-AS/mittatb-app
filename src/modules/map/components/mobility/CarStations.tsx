import {Mode} from '@atb/api/types/generated/journey_planner_v3_types';
import {useTransportColor} from '@atb/utils/use-transport-color';
import MapboxGL, {ShapeSource} from '@rnmapbox/maps';
import {OnPressEvent} from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';
import React, {RefObject, useRef} from 'react';
import {StationsWithCount} from './Stations';
import {hitboxCoveringIconOnly} from '@atb/modules/map';

type Props = {
  stations: StationsWithCount;
  onClusterClick: (
    e: OnPressEvent,
    clustersSource: RefObject<ShapeSource | null>,
  ) => void;
};

export const CarStations = ({stations, onClusterClick}: Props) => {
  const carColor = useTransportColor(Mode.Car);
  const clustersSource = useRef<MapboxGL.ShapeSource>(null);

  const symbolStyling = {
    textAnchor: 'center',
    textOffset: [0.75, 0],
    textColor: carColor.primary.background,
    textSize: 12,
    textAllowOverlap: true,
    iconImage: 'CarChip',
    iconAllowOverlap: true,
    iconSize: 0.85,
  };

  return (
    <>
      <MapboxGL.ShapeSource
        id="carStation"
        shape={stations}
        tolerance={0}
        cluster
        hitbox={hitboxCoveringIconOnly}
      >
        <MapboxGL.SymbolLayer
          id="carStationPin"
          filter={['!', ['has', 'point_count']]}
          minZoomLevel={12}
          style={{
            ...symbolStyling,
            textField: ['get', 'count'],
          }}
        />
      </MapboxGL.ShapeSource>
      <MapboxGL.ShapeSource
        id="carStationCluster"
        ref={clustersSource}
        shape={stations}
        tolerance={0}
        cluster
        hitbox={hitboxCoveringIconOnly}
        clusterProperties={{
          sum: ['+', ['get', 'count']],
        }}
        onPress={(e) => onClusterClick(e, clustersSource)}
      >
        <MapboxGL.SymbolLayer
          id="carStationClusterPin"
          minZoomLevel={12}
          filter={['has', 'point_count']}
          style={{
            ...symbolStyling,
            textField: ['get', 'sum'],
          }}
        />
      </MapboxGL.ShapeSource>
      <MapboxGL.ShapeSource id="carStationMini" shape={stations} tolerance={0}>
        <MapboxGL.CircleLayer
          id="carStationMiniPin"
          maxZoomLevel={12}
          minZoomLevel={11}
          style={{
            circleColor: carColor.primary.background,
            circleStrokeColor: carColor.primary.foreground.primary,
            circleOpacity: 0.7,
            circleStrokeOpacity: 0.7,
            circleRadius: 4,
            circleStrokeWidth: 1,
          }}
        />
      </MapboxGL.ShapeSource>
    </>
  );
};
