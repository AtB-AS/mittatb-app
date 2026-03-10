import {useThemeContext} from '@atb/theme';
import {useMemo} from 'react';
import {getMapboxLightStyle} from '../mapbox-styles/get-mapbox-light-style';
import {getMapboxDarkStyle} from '../mapbox-styles/get-mapbox-dark-style';
import {useVehiclesAndStationsVectorSource} from '../components/mobility/VehiclesAndStations';
import {MAPBOX_API_TOKEN} from '@env';
import {colorTheme} from '../mapbox-styles/mapbox-color-theme';
import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {useAppVersionedConfigurableLink} from '@atb/utils/use-app-versioned-configurable-link';
import {useGeofencingZonesLayers} from './use-geofencing-zones-layers';

// since layerIndex doesn't work in mapbox, but aboveLayerId does, add some slot layer ids to use
export enum MapSlotLayerId {
  GeofencingZones = 'geofencingZones', // can be removed once support for GeofencingZones not as tiles is removed
  Vehicles = 'vehicles',
  Stations = 'stations',
  NSRItems = 'nsrItems',
  SelectedFeature = 'selectedFeature',
}

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
  type: 'slot',
}));

export const useMapboxJsonStyle: (
  includeVehiclesAndStationsVectorSource: boolean,
  shouldShowGeofencingZonesLayers: boolean,
) => string | undefined = (
  includeVehiclesAndStationsVectorSource,
  shouldShowGeofencingZonesLayers,
) => {
  const {themeName} = useThemeContext();
  const {mapbox_user_name, mapbox_nsr_tileset_id} = useRemoteConfigContext();
  const {isMap3dEnabled} = useFeatureTogglesContext();

  const mapboxSpriteUrl = useAppVersionedConfigurableLink('mapboxSpriteUrls');
  const geofencingZonesLayers = useGeofencingZonesLayers(
    shouldShowGeofencingZonesLayers,
  );

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

    const themedLayersWithSlots = [
      ...themedLayers,
      ...geofencingZonesLayers,
      ...slotLayers,
    ];

    const extendedSources: StyleJsonVectorSourcesObj = {
      ...themedStyle.sources,
      ...(includeVehiclesAndStationsVectorSource
        ? {
            [vehiclesAndStationsVectorSourceId]:
              vehiclesAndStationsVectorSource,
          }
        : undefined),
    };

    return {
      ...themedStyle,
      sources: extendedSources,
      layers: themedLayersWithSlots,
    };
  }, [
    geofencingZonesLayers,
    includeVehiclesAndStationsVectorSource,
    mapbox_nsr_tileset_id,
    mapbox_user_name,
    themeName,
    vehiclesAndStationsVectorSource,
    vehiclesAndStationsVectorSourceId,
  ]);

  const mapboxJsonStyle = useMemo(
    () =>
      JSON.stringify({
        ...themedStyleWithExtendedSourcesAndSlotLayers,
        sprite: (mapboxSpriteUrl ?? '') + themeName,
        projection: {name: 'mercator'}, // Using 'globe' instead looks pretty cool, but there is an initial frame flicker with zoom 0. Might be possible to fix somehow.
        imports: isMap3dEnabled
          ? [
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
            ]
          : [],
      }),
    [
      themedStyleWithExtendedSourcesAndSlotLayers,
      mapboxSpriteUrl,
      themeName,
      isMap3dEnabled,
    ],
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
