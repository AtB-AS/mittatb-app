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

const geofencingZonesVectorSourceId = 'geofencing-zones-source';
const sourceLayerId = 'geofencing_zones_features';
const minZoomLevel = 9;

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

const useGeofencingZoneStyle = () => {
  const {theme} = useThemeContext();
  // todo: fix source
  // const code_per_vehicle_type_id = ['get', 'code_per_vehicle_type_id'];
  // const code: Expression = [
  //   'coalesce',
  //   ['get', vehicleTypeId, code_per_vehicle_type_id],
  //   ['get', '*', code_per_vehicle_type_id],
  //   'allowed',
  // ];
  const code = ['get', '*']; // 'allowed';
  const geofencingZoneStyles = ['literal', theme.color.geofencingZone];
  return ['get', code, geofencingZoneStyles];
};

const GeofencingZonesForVehicle = ({
  systemId,
  vehicleTypeId,
}: {
  systemId: string;
  vehicleTypeId: string;
}) => {
  const geofencingZoneStyle = useGeofencingZoneStyle();

  const bgColor = ['get', 'background', ['get', 'color', geofencingZoneStyle]];
  const fillOpacity = ['get', 'fillOpacity', geofencingZoneStyle];

  return (
    <MapboxGL.VectorSource
      id={geofencingZonesVectorSourceId}
      existing={true}
      hitbox={hitboxCoveringIconOnly} // to not be able to hit multiple zones with one click
      //onPress={}
    >
      <MapboxGL.FillLayer
        id="geofencingZoneFill"
        sourceID={geofencingZonesVectorSourceId}
        sourceLayerID={sourceLayerId}
        minZoomLevel={minZoomLevel}
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
      <GfzLineLayer isDashed={true} />
      <GfzLineLayer isDashed={false} />
    </MapboxGL.VectorSource>
  );
};

const GfzLineLayer = ({isDashed}: {isDashed: boolean}) => {
  const geofencingZoneStyle = useGeofencingZoneStyle();
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
      id={`geofencingZone${isDashed ? 'Dashed' : ''}Line`}
      sourceID={geofencingZonesVectorSourceId}
      sourceLayerID={sourceLayerId}
      minZoomLevel={minZoomLevel}
      filter={[isDashed ? '==' : '!=', lineStyle, 'dashed']}
      style={{
        ...lineLayerStyle,
        lineDasharray: isDashed ? [2, 2] : undefined,
      }}
      aboveLayerID={MapSlotLayerId.GeofencingZones}
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
export const useGeofencingZonesVectorSource: () => {
  id: string;
  source: StyleJsonVectorSource;
} = () => {
  // Could consider adding the sources only if shown.
  // The reason not to, is to simplify potential cache tile hotloading on the server.
  const tileLayerNames: TileLayerName[] = ['geofencing_zones_features'];
  const tileUrlTemplate = useTileUrlTemplate(tileLayerNames);

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
