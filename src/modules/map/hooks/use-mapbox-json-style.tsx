import {useThemeContext} from '@atb/theme';
import {useMemo} from 'react';
import {mapboxLightStyle} from '../mapbox-styles/mapbox-light-style';
import {mapboxDarkStyle} from '../mapbox-styles/mapbox-dark-style';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {useVehiclesAndStationsVectorSource} from '../components/mobility/VehiclesAndStations';

// since zIndex doesn't work in mapbox, but aboveLayerId does, add some slot layer ids to use
export enum MapSlotLayerId {
  GeofencingZones = 'geofencingZones',
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
  MapSlotLayerId.GeofencingZones,
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
) => string | undefined = (includeVehiclesAndStationsVectorSource) => {
  const {themeName} = useThemeContext();
  const {language} = useTranslation();

  const {configurableLinks} = useFirestoreConfigurationContext();
  const mapboxSpriteUrl =
    getTextForLanguage(configurableLinks?.mapboxSpriteUrl, language) ?? '';

  const {
    id: vehiclesAndStationsVectorSourceId,
    source: vehiclesAndStationsVectorSource,
  } = useVehiclesAndStationsVectorSource();

  const themedStyleWithExtendedSourcesAndSlotLayers = useMemo(() => {
    const themedStyle =
      themeName === 'dark' ? mapboxDarkStyle : mapboxLightStyle;

    const extendedSources: StyleJsonVectorSourcesObj = {
      ...themedStyle.sources,
      ...slotSource,
      ...(includeVehiclesAndStationsVectorSource
        ? {
            [vehiclesAndStationsVectorSourceId]:
              vehiclesAndStationsVectorSource,
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
    includeVehiclesAndStationsVectorSource,
    themeName,
    vehiclesAndStationsVectorSourceId,
    vehiclesAndStationsVectorSource,
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
