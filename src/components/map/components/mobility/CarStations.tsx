import {Mode} from '@atb/api/types/generated/journey_planner_v3_types';
import {useTransportationColor} from '@atb/utils/use-transportation-color';
import MapboxGL, {ShapeSource} from '@rnmapbox/maps';
import {OnPressEvent} from '@rnmapbox/maps/lib/typescript/types/OnPressEvent';
import React, {RefObject, useRef} from 'react';
import {StationsWithCount} from './Stations';

type Props = {
  stations: StationsWithCount;
  selectedId: string | number | undefined;
  onClusterClick: (
    e: OnPressEvent,
    clustersSource: RefObject<ShapeSource>,
  ) => void;
};

export const CarStations = ({stations, selectedId, onClusterClick}: Props) => {
  const stationBackgroundColor = useTransportationColor(Mode.Car);
  const stationTextColor = useTransportationColor(Mode.Car, undefined, 'text');
  const clustersSource = useRef<MapboxGL.ShapeSource>(null);

  const symbolStyling = {
    textAnchor: 'center',
    textOffset: [0.75, 0],
    textSize: 12,
    textAllowOverlap: true,
    iconSize: 0.85,
  };

  // Filter expressions don't like undefined as value
  const selectedStationId = selectedId ?? 'nothing';

  return (
    <>
      <MapboxGL.ShapeSource
        id="carStation"
        shape={stations}
        tolerance={0}
        cluster
      >
        <MapboxGL.SymbolLayer
          id="carStationPin"
          filter={[
            'all',
            ['!', ['has', 'point_count']],
            ['!=', ['get', 'id'], selectedStationId],
          ]}
          minZoomLevel={12}
          style={{
            ...symbolStyling,
            textField: ['get', 'count'],
            textColor: stationBackgroundColor,
            iconImage: 'CarChip',
          }}
        />
        <MapboxGL.SymbolLayer
          id="carStationPinSelected"
          filter={[
            'all',
            ['!', ['has', 'point_count']],
            ['==', ['get', 'id'], selectedStationId],
          ]}
          minZoomLevel={12}
          style={{
            ...symbolStyling,
            textField: ['get', 'count'],
            textColor: stationTextColor,
            iconImage: 'CarChipSelected',
          }}
        />
      </MapboxGL.ShapeSource>
      <MapboxGL.ShapeSource
        id="carStationCluster"
        ref={clustersSource}
        shape={stations}
        tolerance={0}
        cluster
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
