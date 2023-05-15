import MapboxGL from '@rnmapbox/maps';
import React from 'react';
import {getStaticColor} from '@atb/theme/colors';
import {useTheme} from '@atb/theme';
import {StationsWithCount} from './Stations';

type Props = {
  stations: StationsWithCount;
};

export const CarStations = ({stations}: Props) => {
  const {themeName} = useTheme();
  const stationColor = getStaticColor(themeName, 'transport_car');

  return (
    <MapboxGL.ShapeSource id={'carStations'} shape={stations} tolerance={0}>
      <MapboxGL.SymbolLayer
        id="carStationPin"
        minZoomLevel={13}
        style={{
          textField: ['get', 'count'],
          textAnchor: 'center',
          textOffset: [0.75, 0],
          textColor: stationColor.background,
          textSize: 12,
          textAllowOverlap: true,
          iconImage: {uri: 'CarChip'},
          iconAllowOverlap: true,
          iconSize: 0.85,
        }}
      />
      <MapboxGL.CircleLayer
        id="carStationMini"
        maxZoomLevel={13}
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
