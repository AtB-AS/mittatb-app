import {useThemeContext} from '@atb/theme';
import {useMemo} from 'react';
import {mapboxLightStyle} from '../mapbox-styles/mapbox-light-style';
import {mapboxDarkStyle} from '../mapbox-styles/mapbox-dark-style';
import {useFirestoreConfigurationContext} from '@atb/configuration';
import {getTextForLanguage, useTranslation} from '@atb/translations';

export const useMapboxJsonStyle: () => string | undefined = () => {
  const {themeName} = useThemeContext();
  const {language} = useTranslation();

  const {configurableLinks} = useFirestoreConfigurationContext();
  const mapboxSpriteUrl =
    getTextForLanguage(configurableLinks?.mapboxSpriteUrl, language) ?? '';

  const mapboxJsonStyle = useMemo(
    () =>
      JSON.stringify({
        ...(themeName === 'dark' ? mapboxDarkStyle : mapboxLightStyle),
        sprite: mapboxSpriteUrl + themeName,
      }),
    [themeName, mapboxSpriteUrl],
  );

  return mapboxJsonStyle;
};
