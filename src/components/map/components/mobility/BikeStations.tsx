import {Mode} from '@atb/api/types/generated/journey_planner_v3_types';
import {useTransportationColor} from '@atb/utils/use-transportation-color';
import MapboxGL, {ShapeSource} from '@rnmapbox/maps';
import {OnPressEvent} from '@rnmapbox/maps/lib/typescript/types/OnPressEvent';
import React, {RefObject, useRef} from 'react';
import {StationsWithCount} from './Stations';

type Props = {
  stations: StationsWithCount;
  onClusterClick: (
    e: OnPressEvent,
    clustersSource: RefObject<ShapeSource>,
  ) => void;
};

export const BikeStations = ({stations, onClusterClick}: Props) => {
  const stationBackgroundColor = useTransportationColor(Mode.Bicycle);
  const stationTextColor = useTransportationColor(
    Mode.Bicycle,
    undefined,
    'text',
  );
  const clustersSource = useRef<MapboxGL.ShapeSource>(null);
  const symbolStyling = {
    textAnchor: 'center',
    textOffset: [0.75, 0],
    textColor: stationBackgroundColor,
    textSize: 12,
    iconImage: 'BikeChip',
    iconAllowOverlap: true,
    iconSize: 0.85,
  };

  return (
    <>
      <MapboxGL.ShapeSource
        id="bikeStations"
        shape={stations}
        tolerance={0}
        cluster
      >
        <MapboxGL.SymbolLayer
          id="bikeStationPin"
          filter={['!', ['has', 'point_count']]}
          minZoomLevel={13}
          style={{
            ...symbolStyling,
            textField: ['get', 'count'],
          }}
        />
      </MapboxGL.ShapeSource>
      <MapboxGL.ShapeSource
        id="bikeStationCluster"
        shape={stations}
        ref={clustersSource}
        tolerance={0}
        cluster
        clusterProperties={{
          sum: ['+', ['get', 'count']],
        }}
        onPress={(e) => onClusterClick(e, clustersSource)}
      >
        <MapboxGL.SymbolLayer
          id="bikeStationClusterPin"
          filter={['has', 'point_count']}
          minZoomLevel={13}
          style={{
            ...symbolStyling,
            textField: ['get', 'sum'],
          }}
        />
      </MapboxGL.ShapeSource>
      <MapboxGL.ShapeSource id="bikeStationMini" shape={stations} tolerance={0}>
        <MapboxGL.CircleLayer
          id="bikeStationMiniPin"
          maxZoomLevel={13}
          minZoomLevel={12}
          style={{
            circleColor: stationBackgroundColor,
            circleStrokeColor: stationTextColor,
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
