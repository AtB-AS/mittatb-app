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
        id="carClusterIcon"
        minZoomLevel={13.5}
        style={{
          iconImage: {uri: 'CarCluster'},
          iconSize: 0.85,
          iconAllowOverlap: true,
        }}
      />
      <MapboxGL.SymbolLayer
        id="carClusterCountCircle"
        minZoomLevel={13.5}
        aboveLayerID="carClusterIcon"
        style={{
          iconImage: {uri: 'ClusterCount'},
          iconAllowOverlap: true,
          iconTranslate: [13, -13],
        }}
      />
      <MapboxGL.SymbolLayer
        id="carClusterCount"
        minZoomLevel={13.5}
        aboveLayerID="carClusterCountCircle"
        style={{
          textField: ['get', 'count'],
          textColor: stationColor.background,
          textSize: 11,
          textTranslate: [13, -13],
          textAllowOverlap: true,
        }}
      />
    </MapboxGL.ShapeSource>
  );
};
