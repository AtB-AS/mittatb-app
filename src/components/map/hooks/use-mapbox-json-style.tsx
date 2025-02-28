import {useThemeContext} from '@atb/theme';
import {useMemo} from 'react';
import {mapboxLightStyle} from '../mapbox-styles/mapbox-light-style';
import {mapboxDarkStyle} from '../mapbox-styles/mapbox-dark-style';
import {useFirestoreConfigurationContext} from '@atb/configuration';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {useVehiclesAndStationsVectorSource} from '../components/mobility/VehiclesAndStations';

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
      }),
    [themeName, mapboxSpriteUrl, themedStyleWithExtendedSources],
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
