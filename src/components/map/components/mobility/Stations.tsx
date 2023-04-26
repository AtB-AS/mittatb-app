import React, {RefObject} from 'react';
import {FeatureCollection, GeoJSON} from 'geojson';
import MapboxGL from '@rnmapbox/maps';
import {MapSelectionActionType} from '../../types';
import {flyToLocation, isFeaturePoint, toCoordinates} from '../../utils';
import {StationBasicFragment} from '@atb/api/types/generated/fragments/stations';
import {useTheme} from '@atb/theme';
import {getStaticColor} from '@atb/theme/colors';
import {getAvailableVehicles} from '@atb/mobility/utils';

type Props = {
  mapCameraRef: RefObject<MapboxGL.Camera>;
  stations: FeatureCollection<GeoJSON.Point, StationBasicFragment>;
  onPress: (type: MapSelectionActionType) => void;
};

export const Stations = ({mapCameraRef, stations, onPress}: Props) => {
  const {themeName} = useTheme();
  const stationColor = getStaticColor(themeName, 'transport_bike');

  const stationsWithCount = {
    ...stations,
    features: stations.features.map((feature) => ({
      ...feature,
      properties: {
        ...feature.properties,
        count: getAvailableVehicles(feature.properties.vehicleTypesAvailable),
      },
    })),
  };

  return (
    <MapboxGL.ShapeSource
      id={'stations'}
      shape={stationsWithCount}
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
