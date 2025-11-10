import MapboxGL from '@rnmapbox/maps';

import {hitboxCoveringIconOnly} from '@atb/modules/map';
import {
  MapSlotLayerId,
  StyleJsonVectorSource,
} from '../../hooks/use-mapbox-json-style';
import {useMemo} from 'react';
import {
  TileLayerName,
  useTileUrlTemplate,
} from '../../hooks/use-tile-url-template';
import {useThemeContext} from '@atb/theme';
import {OnPressEvent} from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';
import {GeofencingZoneCode} from '@atb-as/theme';
import {Expression} from '@rnmapbox/maps/src/utils/MapboxStyles';

const geofencingZonesVectorSourceId = 'geofencing-zones-source';
const sourceLayerId = 'geofencing_zones_features';
const minZoomLevel = 9;
const gfzCodes: GeofencingZoneCode[] = [
  'allowed',
  'slow',
  'noParking',
  'noEntry',
];

type GeofencingZonesProps = {
  systemId: string | null;
  vehicleTypeId: string | null;
  geofencingZoneOnPress: (e: OnPressEvent) => void;
};
export const GeofencingZones = ({
  systemId,
  vehicleTypeId,
  geofencingZoneOnPress,
}: GeofencingZonesProps) => {
  if (!systemId || !vehicleTypeId) {
    return <></>;
  }
  return (
    <MapboxGL.VectorSource
      id={geofencingZonesVectorSourceId}
      existing={true}
      hitbox={hitboxCoveringIconOnly} // to not be able to hit multiple zones with one click
      onPress={geofencingZoneOnPress}
    >
      {gfzCodes.map((gfzCode) => (
        <GeofencingZonesForVehicle
          key={gfzCode}
          vehicleTypeId={vehicleTypeId}
          gfzCode={gfzCode}
        />
      ))}
    </MapboxGL.VectorSource>
  );
};

const useGeofencingZoneProps = (vehicleTypeId: string) => {
  const {theme} = useThemeContext();
  // would be better to have these props on code_per_vehicle_type_id as in the database
  const code: Expression = [
    'coalesce',
    ['get', vehicleTypeId],
    ['get', '*'],
    'allowed',
  ];
  const geofencingZoneStyles = ['literal', theme.color.geofencingZone];
  const geofencingZoneStyle = ['get', code, geofencingZoneStyles];
  return {
    geofencingZoneStyle,
    code,
  };
};

const GeofencingZonesForVehicle = ({
  vehicleTypeId,
  gfzCode,
}: {
  vehicleTypeId: string;
  gfzCode: GeofencingZoneCode;
}) => {
  const {geofencingZoneStyle, code} = useGeofencingZoneProps(vehicleTypeId);

  const bgColor = ['get', 'background', ['get', 'color', geofencingZoneStyle]];
  const fillOpacity = ['get', 'fillOpacity', geofencingZoneStyle];

  return (
    <>
      <MapboxGL.FillLayer
        id={'geofencingZoneFill' + gfzCode}
        sourceID={geofencingZonesVectorSourceId}
        sourceLayerID={sourceLayerId}
        minZoomLevel={minZoomLevel}
        style={{
          fillAntialias: true,
          fillColor: bgColor,
          fillOpacity,
        }}
        aboveLayerID={MapSlotLayerId[`GeofencingZones_${gfzCode}`]}
        filter={['==', code, gfzCode]}
      />

      {/*
        Unfortunately since there is a bug in mapbox not supporting
        lineDasharray: ['get', 'lineDasharray'],
        a hard coded style must be used for that style prop.
      */}
      <GfzLineLayer
        gfzCode={gfzCode}
        isDashed={true}
        vehicleTypeId={vehicleTypeId}
      />
      <GfzLineLayer
        gfzCode={gfzCode}
        isDashed={false}
        vehicleTypeId={vehicleTypeId}
      />
    </>
  );
};

const GfzLineLayer = ({
  isDashed,
  gfzCode,
  vehicleTypeId,
}: {
  isDashed: boolean;
  gfzCode: GeofencingZoneCode;
  vehicleTypeId: string;
}) => {
  const {geofencingZoneStyle, code} = useGeofencingZoneProps(vehicleTypeId);
  const lineOpacity = ['get', 'strokeOpacity', geofencingZoneStyle];
  const lineStyle = ['get', 'lineStyle', geofencingZoneStyle];
  const lineColor = [
    'get',
    'background',
    ['get', 'color', geofencingZoneStyle],
  ]; // same as bg

  const lineLayerStyle = {
    lineWidth: ['interpolate', ['exponential', 1.5], ['zoom'], 12, 2, 18, 4],
    lineColor,
    lineOpacity,
    lineCap: 'round',
    lineJoin: 'round',
  };

  return (
    <MapboxGL.LineLayer
      id={`geofencingZone${isDashed ? 'Dashed' : ''}Line_${gfzCode}`}
      sourceID={geofencingZonesVectorSourceId}
      sourceLayerID={sourceLayerId}
      minZoomLevel={minZoomLevel}
      filter={[
        'all',
        [isDashed ? '==' : '!=', lineStyle, 'dashed'],
        ['==', code, gfzCode],
      ]}
      style={{
        ...lineLayerStyle,
        lineDasharray: isDashed ? [2, 2] : undefined,
      }}
      aboveLayerID={MapSlotLayerId[`GeofencingZones_${gfzCode}`]}
    />
  );
};

/**
 * In order to only store live data in memory, not in the locally stored cache,
 * volatile should be set to true. However, since rnmapbox doesn't yet support
 * this prop on MapboxGL.VectorSource (see https://github.com/rnmapbox/maps/discussions/3351),
 * the source must instead be sent directly as styleJson. MapboxGL.VectorSource can
 * then access this source with existing=true and the same source id.
 * @returns {id: string, source: StyleJsonVectorSource}
 */
export const useGeofencingZonesVectorSource: (systemId: string) => {
  id: string;
  source: StyleJsonVectorSource;
} = (systemId) => {
  // Could consider adding the sources only if shown.
  // The reason not to, is to simplify potential cache tile hotloading on the server.
  const tileLayerNames: TileLayerName[] = ['geofencing_zones_features'];
  const tileUrlTemplate = useTileUrlTemplate(tileLayerNames, {systemId});

  return useMemo(
    () => ({
      id: geofencingZonesVectorSourceId,
      source: {
        type: 'vector',
        tiles: [tileUrlTemplate || ''],
        minzoom: minZoomLevel,
        maxzoom: minZoomLevel,
        volatile: true, // hmmmm true?
      },
    }),
    [tileUrlTemplate],
  );
};
