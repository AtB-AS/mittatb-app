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
  const stationColor = getStaticColor(themeName, 'transport_other'); // TODO

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

      {/*<MapboxGL.SymbolLayer*/}
      {/*  id="carStationPin"*/}
      {/*  minZoomLevel={13.5}*/}
      {/*  style={{*/}
      {/*    textField: ['get', 'count'],*/}
      {/*    textAnchor: 'center',*/}
      {/*    textOffset: [0.75, 0],*/}
      {/*    textColor: stationColor.background,*/}
      {/*    textSize: 12,*/}
      {/*    iconImage: {uri: 'BikeChip'},*/}
      {/*    iconAllowOverlap: true,*/}
      {/*    iconSize: 0.85,*/}
      {/*  }}*/}
      {/*/>*/}
      {/*<MapboxGL.CircleLayer*/}
      {/*  id="carStationMini"*/}
      {/*  maxZoomLevel={13.5}*/}
      {/*  minZoomLevel={12}*/}
      {/*  style={{*/}
      {/*    circleColor: stationColor.background,*/}
      {/*    circleStrokeColor: stationColor.text,*/}
      {/*    circleOpacity: 0.7,*/}
      {/*    circleStrokeOpacity: 0.7,*/}
      {/*    circleRadius: 4,*/}
      {/*    circleStrokeWidth: 1,*/}
      {/*  }}*/}
      {/*/>*/}
    </MapboxGL.ShapeSource>
  );
};
