import React, {RefObject, useRef} from 'react';
import {FeatureCollection, GeoJSON} from 'geojson';
import {VehicleFragment} from '@atb/api/types/generated/fragments/vehicles';
import MapboxGL from '@rnmapbox/maps';
import {MapSelectionActionType} from '@atb/components/map/types';
import {
  flyToLocation,
  isClusterFeature,
  isFeatureCollection,
  isFeaturePoint,
  toCoordinates,
  zoomToCluster,
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
      buffer={0}
      cluster
      maxZoomLevel={22}
      clusterMaxZoomLevel={21}
      onPress={async (e) => {
        const [feature, ..._] = e.features;
        if (isClusterFeature(feature)) {
          const children = await shapeSource.current?.getClusterChildren(
            feature,
          );
          if (isFeatureCollection(children)) {
            await zoomToCluster(children, mapCameraRef);
          }
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
        style={{
          textField: ['concat', ['get', 'currentFuelPercent'], '%'],
          textAnchor: 'top-left',
          textOffset: [0.4, 0.7],
          textColor: '#920695',
          textSize: 12,
          iconImage: {uri: 'PinScooter'},
          iconSize: 0.75,
        }}
      />
      <MapboxGL.SymbolLayer
        id="clusterIcon"
        filter={['has', 'point_count']}
        style={{
          iconImage: {uri: 'Scooter'},
          iconSize: 0.75,
        }}
      />
      <MapboxGL.CircleLayer
        id="cluster"
        filter={['has', 'point_count']}
        belowLayerID="clusterIcon"
        style={{
          circleColor: '#920695',
          circleStrokeColor: '#920695',
          circleOpacity: 0.7,
          circleStrokeOpacity: 0.2,
          circleStrokeWidth: ['min', ['+', 2, ['get', 'point_count']], 12],
          circleRadius: 12,
        }}
      />
    </MapboxGL.ShapeSource>
  );
};
