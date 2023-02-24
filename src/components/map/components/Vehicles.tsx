import React from 'react';
import {FeatureCollection, GeoJSON} from 'geojson';
import {VehicleFragment} from '@atb/api/types/generated/fragments/vehicles';
import MapboxGL from '@rnmapbox/maps';
import {MapSelectionActionType} from '@atb/components/map/types';
import {isClusterFeature, isFeaturePoint} from '@atb/components/map/utils';

type Props = {
  vehicles: FeatureCollection<GeoJSON.Point, VehicleFragment>;
  onPress: (type: MapSelectionActionType) => void;
};

export const Vehicles = ({vehicles, onPress}: Props) => {
  return (
    <MapboxGL.ShapeSource
      id={'vehicles'}
      shape={vehicles}
      cluster
      onPress={(e) => {
        const [feature, ..._] = e.features;
        if (isClusterFeature(feature)) {
          onPress({
            source: 'cluster-click',
            feature: feature,
          });
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
