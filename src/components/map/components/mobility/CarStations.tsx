import MapboxGL from '@rnmapbox/maps';
import React from 'react';
import {StationsWithCount} from './Stations';
import {useTransportationColor} from '@atb/utils/use-transportation-color';
import {Mode} from '@atb/api/types/generated/journey_planner_v3_types';

type Props = {
  stations: StationsWithCount;
};

export const CarStations = ({stations}: Props) => {
  const stationBackgroundColor = useTransportationColor(Mode.Car);
  const stationTextColor = useTransportationColor(Mode.Car, undefined, 'text');
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
          filter={['!', ['has', 'point_count']]}
          minZoomLevel={12}
          style={{
            textField: ['get', 'count'],
            textAnchor: 'center',
            textOffset: [0.75, 0],
            textColor: stationBackgroundColor,
            textSize: 12,
            textAllowOverlap: false,
            iconImage: 'CarChip',
            iconAllowOverlap: true,
            iconSize: 0.85,
          }}
        />
      </MapboxGL.ShapeSource>
      <MapboxGL.ShapeSource
        id="carStationCluster"
        shape={stations}
        tolerance={0}
        cluster
      >
        <MapboxGL.SymbolLayer
          id="carStationClusterPin"
          minZoomLevel={12}
          filter={['has', 'point_count']}
          style={{
            textField: ['concat', ['get', 'point_count'], '+'],
            textAnchor: 'center',
            textOffset: [0.75, 0],
            textColor: stationBackgroundColor,
            textSize: 12,
            textAllowOverlap: false,
            iconImage: 'CarChip',
            iconAllowOverlap: true,
            iconSize: 0.85,
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
