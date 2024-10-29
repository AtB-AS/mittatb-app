import {isScooter, ScooterSheet} from '@atb/mobility';
import React from 'react';
import {Feature, FeatureCollection, Point} from 'geojson';
import {MapPluginType} from '@atb/components/map_v2/plugins/types.ts';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {useVehicleQuery} from '@atb/mobility/queries/use-vehicle-query.tsx';
import {
  hitboxCoveringIconOnly,
  PreProcessedGeofencingZones,
  usePreProcessedGeofencingZones,
} from '@atb/components/map';
import MapboxGL from '@rnmapbox/maps';
import {VehicleExtendedFragment} from '@atb/api/types/generated/fragments/vehicles.ts';

export const useGeofencingZonesPlugin: MapPluginType = ({sharedState}) => {
  const {data: vehicle} = useVehicleQuery(sharedState.selectedEntityId ?? '');

  return {
    handlePress: (_features: Feature<Point>[]) => {
      return true;
    },
    renderedFeatures: vehicle ? (
      <GeofencingZonesForVehicle vehicle={vehicle} />
    ) : undefined,
  };
};

type GeofencingZonesForVehicleProps = {
  vehicle: VehicleExtendedFragment;
};
const GeofencingZonesForVehicle = ({
  vehicle,
}: GeofencingZonesForVehicleProps) => {
  const preProcessedGeofencingZones = usePreProcessedGeofencingZones(vehicle);

  return (
    <>
      {preProcessedGeofencingZones.map((geofencingZone) => (
        <GeofencingZone
          geofencingZone={geofencingZone}
          key={geofencingZone?.renderKey}
        />
      ))}
    </>
  );
};

type GeofencingZoneProps = {
  geofencingZone: PreProcessedGeofencingZones;
};
const GeofencingZone = ({geofencingZone}: GeofencingZoneProps) => {
  const getGeofencingZoneCustomProps = ['get', 'geofencingZoneCustomProps'];
  const bgColor = [
    'get',
    'background',
    ['get', 'color', getGeofencingZoneCustomProps],
  ];
  const fillOpacity = ['get', 'fillOpacity', getGeofencingZoneCustomProps];
  const lineOpacity = [
    'get',
    'background',

    ['get', 'strokeOpacity', getGeofencingZoneCustomProps],
  ];
  return (
    <MapboxGL.ShapeSource
      id={'geofencingZonesShapeSource_' + geofencingZone?.renderKey}
      shape={geofencingZone.geojson as FeatureCollection} // FeatureCollection from mobility-types_v2 and FeatureCollection from geojson used by MapboxGL don't match perfectly
      hitbox={hitboxCoveringIconOnly} // to not be able to hit multiple zones with one click
    >
      <MapboxGL.FillLayer
        id="parkingFill"
        style={{
          fillAntialias: true,
          fillColor: bgColor,
          fillOpacity,
        }}
        aboveLayerID="water-point-label"
      />
      <MapboxGL.LineLayer
        id="tariffZonesLine"
        style={{
          lineWidth: 3,
          lineColor: bgColor,
          lineOpacity,
        }}
        aboveLayerID="water-point-label"
      />
    </MapboxGL.ShapeSource>
  );
};
