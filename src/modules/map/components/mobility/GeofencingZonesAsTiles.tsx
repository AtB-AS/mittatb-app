import MapboxGL from '@rnmapbox/maps';

import {hitboxCoveringIconOnly} from '@atb/modules/map';
import {useMemo} from 'react';
import {
  TileLayerName,
  useTileUrlTemplate,
} from '../../hooks/use-tile-url-template';
import {OnPressEvent} from 'node_modules/@rnmapbox/maps/src/types/OnPressEvent';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {geofencingZoneCodes} from '../../utils';

export const geofencingZonesVectorSourceId = 'geofencing-zones-source';
export const sourceLayerId = 'geofencing_zones_features';
export const minZoomLevel = 9;
const maxZoomLevel = 12;

export const geofencingZonesLayers = geofencingZoneCodes
  .map((geofencingZoneCode) =>
    ['fill', 'line'].map((layerType) => ({
      id: `GeofencingZones_${geofencingZoneCode}_${layerType}`,
      type: layerType,
      source: geofencingZonesVectorSourceId,
      'source-layer': sourceLayerId,
      slot: 'middle',
    })),
  )
  .flatMap((layer) => layer);

type GeofencingZonesAsTilesProps = {
  systemId: string | null;
  vehicleTypeId: string | null;
  geofencingZoneOnPress: (e: OnPressEvent) => void;
};
export const GeofencingZonesAsTiles = ({
  systemId,
  vehicleTypeId,
  geofencingZoneOnPress,
}: GeofencingZonesAsTilesProps) => {
  const {isGeofencingZonesEnabled, isGeofencingZonesAsTilesEnabled} =
    useFeatureTogglesContext();

  const tileLayerNames: TileLayerName[] = ['geofencing_zones_features'];
  const tileUrlTemplate = useTileUrlTemplate(tileLayerNames, {
    systemId: systemId ?? '',
    vehicleTypeId: vehicleTypeId ?? '',
  });
  const tileUrlTemplates = useMemo(
    () => [tileUrlTemplate || ''],
    [tileUrlTemplate],
  );

  const enabled = isGeofencingZonesEnabled && isGeofencingZonesAsTilesEnabled;
  if (!enabled || !systemId || !vehicleTypeId) {
    return null;
  }

  return (
    <MapboxGL.VectorSource
      id={geofencingZonesVectorSourceId}
      tileUrlTemplates={tileUrlTemplates}
      minZoomLevel={minZoomLevel}
      maxZoomLevel={maxZoomLevel}
      hitbox={hitboxCoveringIconOnly} // to not be able to hit multiple zones with one click
      onPress={geofencingZoneOnPress}
    >
      {/* Fill and line layers are sent directly to styleJSON due to slot bug in rnmapbox, see useGeofencingZonesLayers */}
      <>
        {geofencingZonesLayers.map(({type, id}) =>
          type === 'fill' ? (
            <MapboxGL.FillLayer key={id} id={id} existing />
          ) : (
            <MapboxGL.LineLayer key={id} id={id} existing />
          ),
        )}
      </>
    </MapboxGL.VectorSource>
  );
};
