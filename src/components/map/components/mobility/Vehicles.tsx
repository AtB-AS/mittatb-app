import React, {RefObject, useRef} from 'react';
import {FeatureCollection, GeoJSON} from 'geojson';
import {VehicleFragment} from '@atb/api/types/generated/fragments/vehicles';
import MapboxGL from '@rnmapbox/maps';
import {MapSelectionActionType} from '../../types';
import {
  flyToLocation,
  isClusterFeature,
  isFeaturePoint,
  toCoordinates,
} from '../../utils';
import {getStaticColor} from '@atb/theme/colors';
import {useTheme} from '@atb/theme';

type Props = {
  mapCameraRef: RefObject<MapboxGL.Camera>;
  vehicles: FeatureCollection<GeoJSON.Point, VehicleFragment>;
  onPress: (type: MapSelectionActionType) => void;
};

export const Vehicles = ({mapCameraRef, vehicles, onPress}: Props) => {
  const shapeSource = useRef<MapboxGL.ShapeSource>(null);
  const {themeName} = useTheme();
  const scooterColor = getStaticColor(themeName, 'transport_scooter');

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
          const zoomLevel = await shapeSource.current?.getClusterExpansionZoom(
            feature,
          );
          flyToLocation({
            coordinates: toCoordinates(feature.geometry.coordinates),
            mapCameraRef,
            zoomLevel,
            animationDuration: 400,
          });
        } else if (isFeaturePoint(feature)) {
          flyToLocation({
            coordinates: toCoordinates(feature.geometry.coordinates),
            mapCameraRef,
            // Default animationMode 'flyTo' will zoom slightly in and out,
            // causing points to cluster and de-cluster on camera move.
            animationMode: 'easeTo',
          });
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
          textColor: scooterColor.background,
          textSize: 11,
          iconImage: {uri: 'ScooterChip'},
          iconSize: 0.85,
          iconAllowOverlap: true,
        }}
      />
      <MapboxGL.SymbolLayer
        id="clusterIcon"
        filter={['has', 'point_count']}
        minZoomLevel={13.5}
        style={{
          iconImage: {uri: 'ScooterCluster'},
          iconSize: 0.85,
          iconAllowOverlap: true,
        }}
      />
      <MapboxGL.SymbolLayer
        id="clusterCountCircle"
        filter={['has', 'point_count']}
        minZoomLevel={13.5}
        aboveLayerID="clusterIcon"
        style={{
          iconImage: {uri: 'ClusterCount'},
          iconAllowOverlap: true,
          iconTranslate: [13, -13],
        }}
      />
      <MapboxGL.SymbolLayer
        id="clusterCount"
        filter={['has', 'point_count']}
        minZoomLevel={13.5}
        aboveLayerID="clusterCountCircle"
        style={{
          textField: ['get', 'point_count'],
          textColor: scooterColor.background,
          textSize: 11,
          textTranslate: [13, -13],
          textAllowOverlap: true,
        }}
      />
    </MapboxGL.ShapeSource>
  );
};
