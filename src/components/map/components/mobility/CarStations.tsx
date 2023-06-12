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
    <MapboxGL.ShapeSource id={'carStations'} shape={stations} tolerance={0}>
      <MapboxGL.SymbolLayer
        id="carStationPin"
        minZoomLevel={12}
        style={{
          textField: ['get', 'count'],
          textAnchor: 'center',
          textOffset: [0.75, 0],
          textColor: stationBackgroundColor,
          textSize: 12,
          textAllowOverlap: true,
          iconImage: 'CarChip',
          iconAllowOverlap: true,
          iconSize: 0.85,
        }}
      />
      <MapboxGL.CircleLayer
        id="carStationMini"
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
  );
};
