import MapboxGL from '@rnmapbox/maps';

import {FeatureCollection} from 'geojson';

import {
  PreProcessedGeofencingZones,
  usePreProcessedGeofencingZones,
} from '@atb/modules/map';

import {hitboxCoveringIconOnly} from '@atb/modules/map';
import {MapSlotLayerId} from '../../hooks/use-mapbox-json-style';

type GeofencingZonesProps = {
  systemId: string | null;
  vehicleTypeId: string | null;
};
export const GeofencingZones = ({
  systemId,
  vehicleTypeId,
}: GeofencingZonesProps) => {
  if (!systemId || !vehicleTypeId) {
    return <></>;
  }
  return (
    <GeofencingZonesForVehicle
      systemId={systemId}
      vehicleTypeId={vehicleTypeId}
    />
  );
};

const GeofencingZonesForVehicle = ({
  systemId,
  vehicleTypeId,
}: {
  systemId: string;
  vehicleTypeId: string;
}) => {
  const preProcessedGeofencingZones = usePreProcessedGeofencingZones(
    systemId,
    vehicleTypeId,
  );

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
  const lineOpacity = ['get', 'strokeOpacity', getGeofencingZoneCustomProps];
  const lineStyle = ['get', 'lineStyle', getGeofencingZoneCustomProps];

  const lineLayerStyle = {
    lineWidth: ['interpolate', ['exponential', 1.5], ['zoom'], 12, 2, 18, 4],
    lineColor: bgColor,
    lineOpacity,
    lineCap: 'round',
    lineJoin: 'round',
  };

  return (
    <MapboxGL.ShapeSource
      id={'geofencingZonesShapeSource_' + geofencingZone?.renderKey}
      shape={geofencingZone.geojson as FeatureCollection} // FeatureCollection from mobility-types_v2 and FeatureCollection from geojson used by MapboxGL don't match perfectly
      hitbox={hitboxCoveringIconOnly} // to not be able to hit multiple zones with one click
    >
      <MapboxGL.FillLayer
        id="geofencingZoneFill"
        style={{
          fillAntialias: true,
          fillColor: bgColor,
          fillOpacity,
        }}
        aboveLayerID={MapSlotLayerId.GeofencingZones}
      />

      {/*
        Unfortunately since there is a bug in mapbox not supporting
        lineDasharray: ['get', 'lineDasharray'],
        a hard coded style must be used for that style prop.
      */}
      <MapboxGL.LineLayer
        id="geofencingZoneLine"
        filter={['!=', lineStyle, 'dashed']}
        style={lineLayerStyle}
        aboveLayerID={MapSlotLayerId.GeofencingZones}
      />
      <MapboxGL.LineLayer
        id="geofencingZoneDashedLine"
        filter={['==', lineStyle, 'dashed']}
        style={{...lineLayerStyle, lineDasharray: [2, 2]}}
        aboveLayerID={MapSlotLayerId.GeofencingZones}
      />
    </MapboxGL.ShapeSource>
  );
};
