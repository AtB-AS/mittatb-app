import {useThemeContext} from '@atb/theme';
import {useMemo} from 'react';
import {mapboxLightStyle} from '../mapbox-styles/mapbox-light-style';
import {mapboxDarkStyle} from '../mapbox-styles/mapbox-dark-style';
import {useRemoteConfigContext} from '@atb/RemoteConfigContext';

export const useMapboxJsonStyle: () => string | undefined = () => {
  const {themeName} = useThemeContext();
  const {mapbox_sprite_url} = useRemoteConfigContext();

  const mapboxJsonStyle = useMemo(
    () =>
      JSON.stringify({
        ...(themeName === 'dark' ? mapboxDarkStyle : mapboxLightStyle),
        sprite: mapbox_sprite_url + themeName,
      }),
    [themeName, mapbox_sprite_url],
  );

  return mapboxJsonStyle;
};
