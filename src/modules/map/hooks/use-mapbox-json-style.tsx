import {useThemeContext} from '@atb/theme';
import {useMemo} from 'react';
import {getMapboxLightStyle} from '../mapbox-styles/get-mapbox-light-style';
import {getMapboxDarkStyle} from '../mapbox-styles/get-mapbox-dark-style';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {useVehiclesAndStationsVectorSource} from '../components/mobility/VehiclesAndStations';
import {MAPBOX_API_TOKEN} from '@env';
import {colorTheme} from '../mapbox-styles/mapbox-color-theme';
import {useRemoteConfigContext} from '@atb/modules/remote-config';

// since layerIndex doesn't work in mapbox, but aboveLayerId does, add some slot layer ids to use
export enum MapSlotLayerId {
  GeofencingZones = 'geofencingZones',
  GeofencingZonesIcons = 'geofencingZonesIcons',
  Vehicles = 'vehicles',
  Stations = 'stations',
  NSRItems = 'nsrItems',
  SelectedFeature = 'selectedFeature',
}

// the order of this list, determines which layers render on top. Last is on top.
const slotLayerIds: MapSlotLayerId[] = [
  MapSlotLayerId.GeofencingZones,
  MapSlotLayerId.GeofencingZonesIcons,
  MapSlotLayerId.Vehicles,
  MapSlotLayerId.Stations,
  MapSlotLayerId.NSRItems,
  MapSlotLayerId.SelectedFeature,
];
const slotLayers = slotLayerIds.map((slotLayerId) => ({
  id: slotLayerId,
  type: 'slot',
  slot: slotLayerId === MapSlotLayerId.GeofencingZones ? 'middle' : 'top',
}));

export const useMapboxJsonStyle: (
  includeVehiclesAndStationsVectorSource: boolean,
) => string | undefined = (includeVehiclesAndStationsVectorSource) => {
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

  const themedStyleWithExtendedSourcesAndSlotLayers = useMemo(() => {
    const themedStyle =
      themeName === 'dark'
        ? getMapboxDarkStyle(mapbox_user_name, mapbox_nsr_tileset_id)
        : getMapboxLightStyle(mapbox_user_name, mapbox_nsr_tileset_id);

    const themedLayers = themedStyle.layers.map((layer) => ({
      ...layer,
      slot: 'middle', // above mapbox ground style, but below 3d buildings/items, https://docs.mapbox.com/mapbox-gl-js/guides/migrate/#layer-slots
      paint: {
        ...layer.paint,
        // add emissive strength to everything in order to be unaffected by lightPreset
        'background-emissive-strength': 1,
        'fill-emissive-strength': 1,
        'line-emissive-strength': 1,
        'icon-emissive-strength': 1,
        'circle-emissive-strength': 1,
        'fill-extrusion-emissive-strength': 1,
        'model-emissive-strength': 1,
        'text-emissive-strength': 1,
      },
    }));

    const extendedSources: StyleJsonVectorSourcesObj = {
      ...themedStyle.sources,
      ...(includeVehiclesAndStationsVectorSource
        ? {
            [vehiclesAndStationsVectorSourceId]:
              vehiclesAndStationsVectorSource,
          }
        : undefined),
    };

    const themedLayersWithSlots = [...themedLayers, ...slotLayers];

    return {
      ...themedStyle,
      sources: extendedSources,
      layers: themedLayersWithSlots,
    };
  }, [
    themeName,
    mapbox_user_name,
    mapbox_nsr_tileset_id,
    includeVehiclesAndStationsVectorSource,
    vehiclesAndStationsVectorSourceId,
    vehiclesAndStationsVectorSource,
  ]);

  const mapboxJsonStyle = useMemo(
    () =>
      JSON.stringify({
        ...themedStyleWithExtendedSourcesAndSlotLayers,
        sprite: mapboxSpriteUrl + themeName,
        projection: {name: 'mercator'}, // Using 'globe' instead looks pretty cool, but there is an initial frame flicker with zoom 0. Might be possible to fix somehow.
        imports: [
          {
            id: 'basemap',
            // url must be absolute for this to work
            url: `https://api.mapbox.com/styles/v1/mapbox/standard?access_token=${MAPBOX_API_TOKEN}`,
            config: {
              lightPreset: themeName === 'dark' ? 'night' : 'day',
              showPlaceLabels: true,
              showPointOfInterestLabels: false,
              showTransitLabels: false,
              showPedestrianRoads: true,
              showRoadLabels: false,
            },
            'color-theme': colorTheme,
          },
        ],
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
