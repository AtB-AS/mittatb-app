import MapboxGL from '@rnmapbox/maps';

import {hitboxCoveringIconOnly} from '@atb/modules/map';
import {useMemo} from 'react';
import {
  TileLayerName,
  useTileUrlTemplate,
} from '../../hooks/use-tile-url-template';
import {OnPressEvent} from 'node_modules/@rnmapbox/maps/src/types/OnPressEvent';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {geofencingZoneCodes, getIconZoomTransitionStyle} from '../../utils';
import {Expression} from 'node_modules/@rnmapbox/maps/src/utils/MapboxStyles';
import {MapSlotLayerId} from '../../hooks/use-mapbox-json-style';
import {useThemeContext} from '@atb/theme';

export const geofencingZonesVectorSourceId = 'geofencing-zones-source';
export const sourceLayerId = 'geofencing_zones_features';
export const minZoomLevel = 9;
const maxZoomLevel = 12;

const geofencingZonesFeaturesLayerId = 'geofencing_zones_features';

const iconSourceLayerId = 'geofencing_zones_icons';

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

  const tileLayerNames: TileLayerName[] = [
    'geofencing_zones_features',
    'geofencing_zones_icons',
  ];
  const tileUrlTemplate = useTileUrlTemplate(tileLayerNames, {
    systemId: systemId ?? '',
    vehicleTypeId: vehicleTypeId ?? '',
  });
  const tileUrlTemplates = useMemo(
    () => [tileUrlTemplate || ''],
    [tileUrlTemplate],
  );

  const {themeName} = useThemeContext();

  const enabled = isGeofencingZonesEnabled && isGeofencingZonesAsTilesEnabled;
  if (!enabled || !systemId || !vehicleTypeId) {
    return null;
  }

  const iconFilter: Expression = [
    '!=',
    ['downcase', ['get', 'code']],
    'allowed',
  ];

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
            <MapboxGL.FillLayer
              key={id}
              id={id}
              existing
              sourceLayerID={geofencingZonesFeaturesLayerId}
            />
          ) : (
            <MapboxGL.LineLayer
              key={id}
              id={id}
              existing
              sourceLayerID={geofencingZonesFeaturesLayerId}
            />
          ),
        )}
      </>

      <MapboxGL.SymbolLayer
        id="geofencing-zone-icon-layer"
        sourceLayerID={iconSourceLayerId}
        style={geofencingZoneIconLayerStyle(themeName)}
        filter={iconFilter}
        aboveLayerID={MapSlotLayerId.GeofencingZones}
      />
    </MapboxGL.VectorSource>
  );
};

const iconReachFullScaleAtZoomLevel = 15.5;
const iconFullSize = 0.85;
const iconScaleTransitionZoomRange = 1.5;
const iconOpacityTransitionExtraZoomRange = iconScaleTransitionZoomRange / 8;

export const geofencingZoneIconLayerStyle = (themeName: string) => {
  const code: Expression = ['get', 'code'];

  const lowerCaseCode: Expression = ['downcase', code];

  const iconImage: Expression = [
    'concat',
    'geofencingzone_',
    lowerCaseCode,
    '_',
    themeName,
  ];

  const {iconOpacity, iconSize} = getIconZoomTransitionStyle(
    iconReachFullScaleAtZoomLevel,
    iconFullSize,
    iconScaleTransitionZoomRange,
    iconOpacityTransitionExtraZoomRange,
  );

  return {
    iconAllowOverlap: true,
    iconIgnorePlacement: true,
    iconImage,
    iconOpacity,
    iconSize,
    iconEmissiveStrength: 1,
  };
};
