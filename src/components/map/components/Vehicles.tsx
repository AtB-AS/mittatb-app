import React, {RefObject, useRef} from 'react';
import {FeatureCollection, GeoJSON} from 'geojson';
import {VehicleFragment} from '@atb/api/types/generated/fragments/vehicles';
import MapboxGL from '@rnmapbox/maps';
import {MapSelectionActionType} from '@atb/components/map/types';
import {
  fitBounds,
  isClusterFeature,
  isFeatureCollection,
  isFeaturePoint,
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
      cluster
      onPress={async (e) => {
        const [feature, ..._] = e.features;
        if (isClusterFeature(feature)) {
          const children = await shapeSource.current?.getClusterChildren(
            feature,
          );
          if (isFeatureCollection(children)) {
            const {from, to} = await getClusterChildrenBounds(children);
            fitBounds(from, to, mapCameraRef);
          }
        } else if (isFeaturePoint(feature)) {
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

const getClusterChildrenBounds = async (
  featureCollection: FeatureCollection,
) => {
  const points = featureCollection.features
    .map((f) => (isFeaturePoint(f) ? f.geometry.coordinates : null))
    .filter((f) => f);

  const longitudes = points
    .map((p) => {
      const [lon, _] = p ?? [];
      return lon;
    })
    .sort();
  const [minLon] = longitudes.slice(0, 1);
  const [maxLon] = longitudes.slice(-1);

  const latitudes = points
    .map((p) => {
      const [_, lat] = p ?? [];
      return lat;
    })
    .sort();
  const [minLat] = latitudes.slice(0, 1);
  const [maxLat] = latitudes.slice(-1);

  return {
    from: {longitude: minLon, latitude: minLat},
    to: {longitude: maxLon, latitude: maxLat},
  };
};
