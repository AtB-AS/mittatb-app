import React, {RefObject} from 'react';
import {FeatureCollection, GeoJSON} from 'geojson';
import MapboxGL from '@rnmapbox/maps';
import {MapSelectionActionType} from '@atb/components/map/types';
import {
  flyToLocation,
  isFeaturePoint,
  toCoordinates,
} from '@atb/components/map/utils';
import {StationFragment} from '@atb/api/types/generated/fragments/stations';
import {useTheme} from '@atb/theme';
import {getStaticColor} from '@atb/theme/colors';

type Props = {
  mapCameraRef: RefObject<MapboxGL.Camera>;
  stations: FeatureCollection<GeoJSON.Point, StationFragment>;
  onPress: (type: MapSelectionActionType) => void;
};

export const Stations = ({mapCameraRef, stations, onPress}: Props) => {
  const {themeName} = useTheme();
  const stationColor = getStaticColor(themeName, 'transport_bike');

  return (
    <MapboxGL.ShapeSource
      id={'stations'}
      shape={stations}
      tolerance={0}
      onPress={async (e) => {
        const [feature, ..._] = e.features;
        if (isFeaturePoint(feature)) {
          flyToLocation({
            coordinates: toCoordinates(feature.geometry.coordinates),
            mapCameraRef,
          });
          onPress({
            source: 'map-click',
            feature,
          });
        }
      }}
    >
      <MapboxGL.SymbolLayer
        id="stationPin"
        minZoomLevel={13.5}
        style={{
          textField: ['get', 'numBikesAvailable'],
          textAnchor: 'center',
          textOffset: [0.75, 0],
          textColor: stationColor.text,
          textSize: 12,
          iconImage: {uri: 'BikeStation'},
          iconAllowOverlap: true,
        }}
      />
      <MapboxGL.CircleLayer
        id="stationMini"
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
