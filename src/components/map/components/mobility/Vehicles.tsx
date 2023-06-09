import React, {RefObject, useRef} from 'react';
import {Feature, FeatureCollection, GeoJSON, Point} from 'geojson';
import {VehicleFragment} from '@atb/api/types/generated/fragments/vehicles';
import MapboxGL from '@rnmapbox/maps';
import {
  flyToLocation,
  isClusterFeature,
  mapPositionToCoordinates,
} from '../../utils';
import {Cluster} from '../../types';
import {useTransportationColor} from '@atb/utils/use-transportation-color';
import {Mode} from '@atb/api/types/generated/journey_planner_v3_types';

type Props = {
  mapCameraRef: RefObject<MapboxGL.Camera>;
  vehicles: FeatureCollection<GeoJSON.Point, VehicleFragment>;
  onClusterClick: (feature: Feature<Point, Cluster>) => void;
};

export const Vehicles = ({mapCameraRef, vehicles, onClusterClick}: Props) => {
  const clustersSource = useRef<MapboxGL.ShapeSource>(null);
  const vehiclesSource = useRef<MapboxGL.ShapeSource>(null);
  const scooterColor = useTransportationColor(Mode.Scooter);

  return (
    <>
      <MapboxGL.ShapeSource
        id={'vehicleClusters'}
        ref={clustersSource}
        shape={vehicles}
        tolerance={0}
        cluster
        maxZoomLevel={22}
        clusterMaxZoomLevel={21}
        onPress={async (e) => {
          const [feature, ,] = e.features;
          if (isClusterFeature(feature)) {
            const clusterExpansionZoom =
              (await clustersSource.current?.getClusterExpansionZoom(
                feature,
              )) ?? 0;
            const zoomLevel = Math.max(clusterExpansionZoom, 17.5);
            flyToLocation({
              coordinates: mapPositionToCoordinates(
                feature.geometry.coordinates,
              ),
              mapCameraRef,
              zoomLevel,
              animationDuration: 400,
            });
            onClusterClick(feature);
          }
        }}
      >
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
            textColor: scooterColor,
            textSize: 11,
            textTranslate: [13, -13],
            textAllowOverlap: true,
          }}
        />
      </MapboxGL.ShapeSource>
      <MapboxGL.ShapeSource
        id={'vehicles'}
        ref={vehiclesSource}
        shape={vehicles}
        tolerance={0}
        cluster
        maxZoomLevel={22}
        clusterMaxZoomLevel={21}
      >
        <MapboxGL.SymbolLayer
          id="icon"
          filter={['!', ['has', 'point_count']]}
          minZoomLevel={13.5}
          style={{
            textField: ['concat', ['get', 'currentFuelPercent'], '%'],
            textAnchor: 'center',
            textOffset: [0.7, -0.25],
            textColor: scooterColor,
            textSize: 11,
            iconImage: {uri: 'ScooterChip'},
            iconSize: 0.85,
            iconAllowOverlap: true,
          }}
        />
      </MapboxGL.ShapeSource>
    </>
  );
};
