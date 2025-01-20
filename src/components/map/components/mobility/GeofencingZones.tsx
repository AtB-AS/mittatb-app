import MapboxGL from '@rnmapbox/maps';

import {FeatureCollection} from 'geojson';

import {
  PreProcessedGeofencingZones,
  usePreProcessedGeofencingZones,
} from '@atb/components/map';
import {useVehicleQuery} from '@atb/mobility/queries/use-vehicle-query';

import {hitboxCoveringIconOnly} from '@atb/components/map';
import {VehicleExtendedFragment} from '@atb/api/types/generated/fragments/vehicles';

type GeofencingZonesProps = {
  selectedVehicleId: string;
};
export const GeofencingZones = ({selectedVehicleId}: GeofencingZonesProps) => {
  const {
    data: vehicle,
    isLoading,
    isError,
  } = useVehicleQuery(selectedVehicleId);

  if (!vehicle || !selectedVehicleId || isLoading || isError) {
    return <></>;
  }
  return <GeofencingZonesForVehicle vehicle={vehicle} />;
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
        aboveLayerID="country-label"
      />
      <MapboxGL.LineLayer
        id="tariffZonesLine"
        style={{
          lineWidth: 3,
          lineColor: bgColor,
          lineOpacity,
        }}
        aboveLayerID="country-label"
      />
    </MapboxGL.ShapeSource>
  );
};
