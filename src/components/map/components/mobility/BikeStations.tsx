import MapboxGL from '@rnmapbox/maps';
import React from 'react';
import {getStaticColor} from '@atb/theme/colors';
import {useTheme} from '@atb/theme';
import {StationsWithCount} from './Stations';

type Props = {
  stations: StationsWithCount;
};

export const BikeStations = ({stations}: Props) => {
  const {themeName} = useTheme();
  const stationColor = getStaticColor(themeName, 'transport_bike');

  return (
    <MapboxGL.ShapeSource id={'bikeStations'} shape={stations} tolerance={0}>
      <MapboxGL.SymbolLayer
        id="bikeStationPin"
        minZoomLevel={13.5}
        style={{
          textField: ['get', 'count'],
          textAnchor: 'center',
          textOffset: [0.75, 0],
          textColor: stationColor.background,
          textSize: 12,
          iconImage: {uri: 'BikeChip'},
          iconAllowOverlap: true,
          iconSize: 0.85,
        }}
      />
      <MapboxGL.CircleLayer
        id="bikeStationMini"
        maxZoomLevel={13.5}
        minZoomLevel={12}
        style={{
          circleColor: stationColor.background,
          circleStrokeColor: stationColor.text,
          circleOpacity: 0.7,
          circleStrokeOpacity: 0.7,
          circleRadius: 4,
          circleStrokeWidth: 1,
        }}
      />
    </MapboxGL.ShapeSource>
  );
};
