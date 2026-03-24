import MapboxGL from '@rnmapbox/maps';

import {useMemo} from 'react';
import {
  TileLayerName,
  useTileUrlTemplate,
} from '../../hooks/use-tile-url-template';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {getIconZoomTransitionStyle} from '../../utils';
import {Expression} from 'node_modules/@rnmapbox/maps/lib/typescript/src/utils/MapboxStyles';
import {useThemeContext} from '@atb/theme/ThemeContext';
import {MapSlotLayerId} from '../../hooks/use-mapbox-json-style';
import {OnPressEvent} from 'node_modules/@rnmapbox/maps/src/types/OnPressEvent';

export const geofencingZoneIconsVectorSourceId = 'geofencing-zone-icons-source';

export const iconSourceLayerId = 'geofencing_zones_icons';

export const minZoomLevel = 9;
export const maxZoomLevel = 16;

export const geofencingZoneIconLayerId = 'geofencing-zone-icon-layer';

type GeofencingZoneIconsAsTilesProps = {
  systemId: string | null;
  vehicleTypeId: string | null;
  iconOnPress: (e: OnPressEvent) => void;
};

export const GeofencingZoneIconsAsTiles = ({
  systemId,
  vehicleTypeId,
  iconOnPress,
}: GeofencingZoneIconsAsTilesProps) => {
  const {themeName} = useThemeContext();
  const {isGeofencingZonesEnabled, isGeofencingZonesAsTilesEnabled} =
    useFeatureTogglesContext();

  const tileLayerNames: TileLayerName[] = ['geofencing_zones_icons'];

  const tileUrlTemplate = useTileUrlTemplate(tileLayerNames, {
    systemId: systemId ?? '',
    vehicleTypeId: vehicleTypeId ?? '',
  });

  const tileUrlTemplates = useMemo(
    () => [tileUrlTemplate || ''],
    [tileUrlTemplate],
  );

  const enabled =
    isGeofencingZonesEnabled &&
    isGeofencingZonesAsTilesEnabled &&
    systemId &&
    vehicleTypeId;

  if (!enabled) {
    return null;
  }

  const filter: Expression = ['!=', ['downcase', ['get', 'code']], 'allowed'];

  return (
    <MapboxGL.VectorSource
      id={geofencingZoneIconsVectorSourceId}
      tileUrlTemplates={tileUrlTemplates}
      minZoomLevel={minZoomLevel}
      maxZoomLevel={maxZoomLevel}
      onPress={iconOnPress}
    >
      <MapboxGL.SymbolLayer
        id={geofencingZoneIconLayerId}
        sourceLayerID={iconSourceLayerId}
        style={geofencingZoneIconLayerStyle(themeName)}
        filter={filter}
        aboveLayerID={MapSlotLayerId.GeofencingZones}
      />
    </MapboxGL.VectorSource>
  );
};

const reachFullScaleAtZoomLevel = 15.5;
const iconFullSize = 0.85;
const scaleTransitionZoomRange = 1.5;
const opacityTransitionExtraZoomRange = scaleTransitionZoomRange / 8;

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
    reachFullScaleAtZoomLevel,
    iconFullSize,
    scaleTransitionZoomRange,
    opacityTransitionExtraZoomRange,
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
