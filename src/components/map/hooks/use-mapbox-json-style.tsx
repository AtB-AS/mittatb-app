import {useThemeContext} from '@atb/theme';
import {useMemo} from 'react';
import {mapboxLightStyle} from '../mapbox-styles/mapbox-light-style';
import {mapboxDarkStyle} from '../mapbox-styles/mapbox-dark-style';

export const useMapboxJsonStyle: () => string | undefined = () => {
  const {themeName} = useThemeContext();

  const mapboxJsonStyle = useMemo(
    () =>
      JSON.stringify({
        ...(themeName === 'dark' ? mapboxDarkStyle : mapboxLightStyle),
        sprite: 'http://localhost:3000/sprite/v1/' + themeName, // todo: replace with remote config url
      }),
    [themeName],
  );

  return mapboxJsonStyle;
};
