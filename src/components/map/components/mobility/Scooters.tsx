import React, {RefObject, useRef} from 'react';
import {FeatureCollection, GeoJSON} from 'geojson';
import {VehicleBasicFragment} from '@atb/api/types/generated/fragments/vehicles';
import MapboxGL, {ShapeSource} from '@rnmapbox/maps';
import {useTransportationColor} from '@atb/utils/use-transportation-color';
import {Mode} from '@atb/api/types/generated/journey_planner_v3_types';
import {OnPressEvent} from '@rnmapbox/maps/lib/typescript/types/OnPressEvent';

type Props = {
  scooters: FeatureCollection<GeoJSON.Point, VehicleBasicFragment>;
  selectedId: string | number | undefined;
  onClusterClick: (
    e: OnPressEvent,
    clustersSource: RefObject<ShapeSource>,
  ) => void;
};

export const Scooters = ({scooters, selectedId, onClusterClick}: Props) => {
  const clustersSource = useRef<MapboxGL.ShapeSource>(null);
  const vehiclesSource = useRef<MapboxGL.ShapeSource>(null);
  const scooterColor = useTransportationColor(Mode.Scooter);
  const textColor = useTransportationColor(Mode.Scooter, undefined, 'text');

  // Filter expressions don't like undefined as value
  const selectedScooter = selectedId ?? 'nothing';
  const symbolStyling = {
    textField: ['concat', ['get', 'currentFuelPercent'], '%'],
    textAnchor: 'center',
    textOffset: [0.7, -0.25],
    textSize: 11,
    iconSize: 0.85,
    iconAllowOverlap: true,
  };

  return (
    <>
      <MapboxGL.ShapeSource
        id="scooterClusters"
        ref={clustersSource}
        shape={scooters}
        tolerance={0}
        cluster
        maxZoomLevel={22}
        clusterMaxZoomLevel={21}
        clusterRadius={40}
        onPress={(e) => onClusterClick(e, clustersSource)}
      >
        <MapboxGL.SymbolLayer
          id="scooterClusterIcon"
          filter={['has', 'point_count']}
          minZoomLevel={13.5}
          style={{
            iconImage: 'ScooterCluster',
            iconSize: 0.85,
            iconAllowOverlap: true,
          }}
        />
        <MapboxGL.SymbolLayer
          id="scooterClusterCountCircle"
          filter={['has', 'point_count']}
          minZoomLevel={13.5}
          aboveLayerID="scooterClusterIcon"
          style={{
            iconImage: 'ClusterCount',
            iconAllowOverlap: true,
            iconTranslate: [13, -13],
          }}
        />
        <MapboxGL.SymbolLayer
          id="scooterClusterCount"
          filter={['has', 'point_count']}
          minZoomLevel={13.5}
          aboveLayerID="scooterClusterCountCircle"
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
        id="scooter"
        ref={vehiclesSource}
        shape={scooters}
        tolerance={0}
        cluster
        maxZoomLevel={22}
        clusterRadius={40}
        clusterMaxZoomLevel={21}
      >
        <MapboxGL.SymbolLayer
          id="scooterIcon"
          filter={[
            'all',
            ['!', ['has', 'point_count']],
            ['!=', ['get', 'id'], selectedScooter],
          ]}
          minZoomLevel={13.5}
          style={{
            ...symbolStyling,
            textColor: scooterColor,
            iconImage: 'ScooterChip',
          }}
        />
        <MapboxGL.SymbolLayer
          id="scooterIconSelected"
          filter={[
            'all',
            ['!', ['has', 'point_count']],
            ['==', ['get', 'id'], selectedScooter],
          ]}
          minZoomLevel={13.5}
          style={{
            ...symbolStyling,
            textColor: textColor,
            iconImage: 'ScooterChipSelected',
          }}
        />
      </MapboxGL.ShapeSource>
    </>
  );
};
