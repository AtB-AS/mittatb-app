import {useThemeContext} from '@atb/theme';
import {useMemo} from 'react';
import {getMapboxLightStyle} from '../mapbox-styles/get-mapbox-light-style';
import {getMapboxDarkStyle} from '../mapbox-styles/get-mapbox-dark-style';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {useVehiclesAndStationsVectorSource} from '../components/mobility/VehiclesAndStations';
import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {useGeofencingZonesVectorSource} from '../components/mobility/GeofencingZones';

// since layerIndex doesn't work in mapbox, but aboveLayerId does, add some slot layer ids to use
export enum MapSlotLayerId {
  GeofencingZones_allowed = 'geofencingZones_allowed',
  GeofencingZones_slow = 'geofencingZones_slow',
  GeofencingZones_noParking = 'geofencingZones_noParking',
  GeofencingZones_noEntry = 'geofencingZones_noEntry',
  Vehicles = 'vehicles',
  Stations = 'stations',
  NSRItems = 'nsrItems',
  SelectedFeature = 'selectedFeature',
}

const slotSourceKey = 'slotSource';
// This source only exists for slots layers, no data is fetched.
const slotSource: StyleJsonVectorSourcesObj = {
  [slotSourceKey]: {type: 'vector'}, // type is required, but otherwise doesn't matter here.
};

// the order of this list, determines which layers render on top. Last is on top.
const slotLayerIds: MapSlotLayerId[] = [
  MapSlotLayerId.GeofencingZones_allowed,
  MapSlotLayerId.GeofencingZones_slow,
  MapSlotLayerId.GeofencingZones_noParking,
  MapSlotLayerId.GeofencingZones_noEntry,
  MapSlotLayerId.Vehicles,
  MapSlotLayerId.Stations,
  MapSlotLayerId.NSRItems,
  MapSlotLayerId.SelectedFeature,
];
const slotLayers = slotLayerIds.map((slotLayerId) => ({
  id: slotLayerId,
  type: 'symbol', // type is required, but otherwise doesn't matter here.
  source: slotSourceKey,
}));

export const useMapboxJsonStyle: (
  includeVehiclesAndStationsVectorSource: boolean,
  includeGeofencingZonesVectorSource: boolean,
) => string | undefined = (
  includeVehiclesAndStationsVectorSource,
  includeGeofencingZonesVectorSource,
) => {
  const {themeName} = useThemeContext();
  const {language} = useTranslation();
  const {mapbox_user_name, mapbox_nsr_tileset_id} = useRemoteConfigContext();

  const {configurableLinks} = useFirestoreConfigurationContext();
  const mapboxSpriteUrl =
    getTextForLanguage(configurableLinks?.mapboxSpriteUrl, language) ?? '';

  const {
    id: vehiclesAndStationsVectorSourceId,
    source: vehiclesAndStationsVectorSource,
  } = useVehiclesAndStationsVectorSource();

  const {
    id: geofencingZonesVectorSourceId,
    source: geofencingZonesVectorSource,
  } = useGeofencingZonesVectorSource();

  const themedStyleWithExtendedSourcesAndSlotLayers = useMemo(() => {
    const themedStyle =
      themeName === 'dark'
        ? getMapboxDarkStyle(mapbox_user_name, mapbox_nsr_tileset_id)
        : getMapboxLightStyle(mapbox_user_name, mapbox_nsr_tileset_id);

    const extendedSources: StyleJsonVectorSourcesObj = {
      ...themedStyle.sources,
      ...slotSource,
      ...(includeVehiclesAndStationsVectorSource
        ? {
            [vehiclesAndStationsVectorSourceId]:
              vehiclesAndStationsVectorSource,
          }
        : undefined),
      ...(includeGeofencingZonesVectorSource
        ? {
            [geofencingZonesVectorSourceId]: geofencingZonesVectorSource,
          }
        : undefined),
    };

    const layersWithSlots = [...themedStyle.layers, ...slotLayers];

    return {
      ...themedStyle,
      sources: extendedSources,
      layers: layersWithSlots,
    };
  }, [
    themeName,
    mapbox_user_name,
    mapbox_nsr_tileset_id,
    includeVehiclesAndStationsVectorSource,
    vehiclesAndStationsVectorSourceId,
    vehiclesAndStationsVectorSource,
    includeGeofencingZonesVectorSource,
    geofencingZonesVectorSourceId,
    geofencingZonesVectorSource,
  ]);

  const mapboxJsonStyle = useMemo(
    () =>
      JSON.stringify({
        ...themedStyleWithExtendedSourcesAndSlotLayers,
        sprite: mapboxSpriteUrl + themeName,
      }),
    [themeName, mapboxSpriteUrl, themedStyleWithExtendedSourcesAndSlotLayers],
  );

  return mapboxJsonStyle;
};

/**
 * Unfortunately the styleJson prop in MapboxGL.MapView is only typed
 as string | undefined, so a part of it is manually implemented here.
 * Based on https://docs.mapbox.com/style-spec/reference/sources/#vector
 */
enum StyleJsonVectorSourceScheme {
  XYZ = 'xyz',
  TMS = 'tms',
}
export type StyleJsonVectorSource = {
  type: string;
  attribution?: string;
  bounds?: number[];
  maxzoom?: number;
  minzoom?: number;
  promoteId?: string | Record<string, string>;
  scheme?: StyleJsonVectorSourceScheme;
  tiles?: string[];
  url?: string;
  volatile?: boolean;
};
type StyleJsonVectorSourcesObj = Record<string, StyleJsonVectorSource>;
