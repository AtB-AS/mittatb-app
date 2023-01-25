import React from 'react';
import {FeatureCollection, GeoJSON} from 'geojson';
import {VehicleFragment} from '@atb/api/types/generated/fragments/vehicles';
import MapboxGL from '@react-native-mapbox-gl/maps';

type Props = {
  vehicles: FeatureCollection<GeoJSON.Point, VehicleFragment>;
};

export const Vehicles = ({vehicles}: Props) => {
  return (
    <MapboxGL.ShapeSource id={'vehicles'} shape={vehicles} cluster>
      <MapboxGL.SymbolLayer
        id="icon"
        filter={['!', ['has', 'point_count']]}
        style={{
          textField: '20%',
          textAnchor: 'top-left',
          textOffset: [0.4, 0.7],
          textColor: '#920695',
          textSize: 12,
          iconImage: 'PinScooter',
          iconSize: 0.75,
        }}
      />
      <MapboxGL.SymbolLayer
        id="clusterIcon"
        filter={['has', 'point_count']}
        style={{
          iconImage: 'Scooter',
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
