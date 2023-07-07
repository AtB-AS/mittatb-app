import MapboxGL from '@rnmapbox/maps';
import React from 'react';
import {StationsWithCount} from './Stations';
import {useTransportationColor} from '@atb/utils/use-transportation-color';
import {Mode} from '@atb/api/types/generated/journey_planner_v3_types';

type Props = {
  stations: StationsWithCount;
};

export const BikeStations = ({stations}: Props) => {
  const stationBackgroundColor = useTransportationColor(Mode.Bicycle);
  const stationTextColor = useTransportationColor(
    Mode.Bicycle,
    undefined,
    'text',
  );
  return (
    <MapboxGL.ShapeSource id={'bikeStations'} shape={stations} tolerance={0}>
      <MapboxGL.SymbolLayer
        id="bikeStationPin"
        minZoomLevel={13}
        style={{
          textField: ['get', 'count'],
          textAnchor: 'center',
          textOffset: [0.75, 0],
          textColor: stationBackgroundColor,
          textSize: 12,
          iconImage: 'BikeChip',
          iconAllowOverlap: true,
          iconSize: 0.85,
        }}
      />
      <MapboxGL.CircleLayer
        id="bikeStationMini"
        maxZoomLevel={13}
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
