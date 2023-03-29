import React, {RefObject, useRef} from 'react';
import {FeatureCollection, GeoJSON} from 'geojson';
import {VehicleFragment} from '@atb/api/types/generated/fragments/vehicles';
import MapboxGL from '@rnmapbox/maps';
import {MapSelectionActionType} from '@atb/components/map/types';
import {
  flyToLocation,
  isClusterFeature,
  isFeaturePoint,
  toCoordinates,
} from '@atb/components/map/utils';

type Props = {
  mapCameraRef: RefObject<MapboxGL.Camera>;
  vehicles: FeatureCollection<GeoJSON.Point, VehicleFragment>;
  onPress: (type: MapSelectionActionType) => void;
};

export const Vehicles = ({mapCameraRef, vehicles, onPress}: Props) => {
  const shapeSource = useRef<MapboxGL.ShapeSource>(null);

  return (
    <MapboxGL.ShapeSource
      id={'vehicles'}
      ref={shapeSource}
      shape={vehicles}
      tolerance={0}
      cluster
      maxZoomLevel={22}
      clusterMaxZoomLevel={21}
      onPress={async (e) => {
        const [feature, ..._] = e.features;
        if (isClusterFeature(feature)) {
          const zoom = await shapeSource.current?.getClusterExpansionZoom(
            feature,
          );
          flyToLocation(
            toCoordinates(feature.geometry.coordinates),
            mapCameraRef,
            zoom,
          );
        } else if (isFeaturePoint(feature)) {
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
        id="icon"
        filter={['!', ['has', 'point_count']]}
        minZoomLevel={13.5}
        style={{
          textField: ['concat', ['get', 'currentFuelPercent'], '%'],
          textAnchor: 'center',
          textOffset: [0.7, -0.25],
          textColor: '#fff',
          textSize: 11,
          iconImage: {uri: 'PinScooter'},
          iconSize: 0.85,
          iconAllowOverlap: true,
        }}
      />
      <MapboxGL.SymbolLayer
        id="clusterIcon"
        filter={['has', 'point_count']}
        minZoomLevel={13.5}
        style={{
          iconImage: {uri: 'Scooter'},
          iconSize: 0.85,
          iconAllowOverlap: true,
        }}
      />
      <MapboxGL.CircleLayer
        id="cluster"
        filter={['has', 'point_count']}
        minZoomLevel={13.5}
        belowLayerID="clusterIcon"
        style={{
          circleColor: '#4A753A',
          circleStrokeColor: '#4A753A',
          circleOpacity: 1,
          circleStrokeOpacity: 0.3,
          circleStrokeWidth: 8,
          circleRadius: 12,
        }}
      />
    </MapboxGL.ShapeSource>
  );
};
