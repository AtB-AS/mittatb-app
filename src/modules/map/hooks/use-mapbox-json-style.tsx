import {useThemeContext} from '@atb/theme';
import {useMemo} from 'react';
import {mapboxLightStyle} from '../mapbox-styles/mapbox-light-style';
import {mapboxDarkStyle} from '../mapbox-styles/mapbox-dark-style';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {useVehiclesAndStationsVectorSource} from '../components/mobility/VehiclesAndStations';
import {MAPBOX_API_TOKEN} from '@env';

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

  const themedStyleWithExtendedSources = useMemo(() => {
    const themedStyle =
      themeName === 'dark' ? mapboxDarkStyle : mapboxLightStyle;
    const themedLayers = themedStyle.layers.map((layer) => ({
      ...layer,
      slot: 'middle', // above mapbox ground style, but below 3d buildings/items
      paint: {
        ...layer.paint,
        // add emissive strength in order to be unaffected by lightPreset
        'background-emissive-strength': 1,
        'fill-emissive-strength': 1,
        'line-emissive-strength': 1,
      },
    }));

    const extendedSources: Record<string, StyleJsonVectorSource> = {
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
      layers: themedLayers,
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
        ...themedStyleWithExtendedSources,
        sprite: mapboxSpriteUrl + themeName,
        projection: {name: 'globe'},
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
          },
        ],
      }),
    [themedStyleWithExtendedSources, mapboxSpriteUrl, themeName],
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
