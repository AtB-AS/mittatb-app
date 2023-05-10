import MapboxGL, {OnPressEvent} from '@rnmapbox/maps';
import React, {RefObject} from 'react';
import {getStaticColor} from '@atb/theme/colors';
import {useTheme} from '@atb/theme';
import {StationsWithCount} from './Stations';

type Props = {
  mapCameraRef: RefObject<MapboxGL.Camera>;
  stations: StationsWithCount;
  onPress: (type: OnPressEvent) => void;
};

export const CarStations = ({stations, onPress}: Props) => {
  const {themeName} = useTheme();
  const stationColor = getStaticColor(themeName, 'transport_car');

  return (
    <MapboxGL.ShapeSource
      id={'carStations'}
      shape={stations}
      tolerance={0}
      onPress={onPress}
    >
      <MapboxGL.SymbolLayer
        id="carStationPin"
        minZoomLevel={13.5}
        style={{
          textField: ['get', 'count'],
          textAnchor: 'center',
          textOffset: [0.75, 0],
          textColor: stationColor.background,
          textSize: 12,
          iconImage: {uri: 'CarChip'},
          iconAllowOverlap: true,
          iconSize: 0.85,
        }}
      />
    </MapboxGL.ShapeSource>
  );
};
