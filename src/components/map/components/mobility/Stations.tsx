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

type Props = {
  mapCameraRef: RefObject<MapboxGL.Camera>;
  stations: FeatureCollection<GeoJSON.Point, StationFragment>;
  onPress: (type: MapSelectionActionType) => void;
};

export const Stations = ({mapCameraRef, stations, onPress}: Props) => {
  return (
    <MapboxGL.ShapeSource
      id={'stations'}
      shape={stations}
      tolerance={0}
      onPress={async (e) => {
        const [feature, ..._] = e.features;
        if (isFeaturePoint(feature)) {
          flyToLocation(
            toCoordinates(feature.geometry.coordinates),
            mapCameraRef,
          );
          onPress({
            source: 'map-click',
            feature,
          });
        }
      }}
    >
      <MapboxGL.SymbolLayer
        id="stationIcon"
        minZoomLevel={13.5}
        style={{
          iconImage: {uri: 'Bicycle'},
          iconSize: 0.75,
          iconColor: '#fff',
        }}
      />
      <MapboxGL.CircleLayer
        id="station"
        belowLayerID="stationIcon"
        minZoomLevel={13.5}
        style={{
          circleColor: '#DE5D00',
          circleStrokeColor: '#DE5D00',
          circleOpacity: 0.7,
          circleStrokeOpacity: 0.2,
          circleStrokeWidth: 7,
          circleRadius: 12,
        }}
      />
      <MapboxGL.CircleLayer
        id="stationMini"
        maxZoomLevel={13.5}
        minZoomLevel={12}
        style={{
          circleColor: '#DE5D00',
          circleStrokeColor: '#fff',
          circleOpacity: 0.7,
          circleStrokeOpacity: 0.7,
          circleRadius: 4,
          circleStrokeWidth: 1,
        }}
      />
    </MapboxGL.ShapeSource>
  );
};
