import {useMapboxStyle} from '@atb/mobility/queries/use-mapbox-style';
import {useTheme} from '@atb/theme';
import {MAPBOX_LIGHT_V2_STYLE_URL, MAPBOX_DARK_V2_STYLE_URL} from '@env';
import {useMemo} from 'react';

export const useMapboxJsonStyle: () => {
  mapboxJsonStyle: string | undefined;
  mapboxStyleIsLoading: boolean;
} = () => {
  const {themeName} = useTheme();
  const {data: mapboxLightStyleJson, isLoading: mapboxLightStyleJsonIsLoading} =
    useMapboxStyle(MAPBOX_LIGHT_V2_STYLE_URL);
  const {data: mapboxDarkStyleJson, isLoading: mapboxDarkStyleJsonIsLoading} =
    useMapboxStyle(MAPBOX_DARK_V2_STYLE_URL);

  const mapboxStyleIsLoading =
    mapboxDarkStyleJsonIsLoading || mapboxLightStyleJsonIsLoading;

  const mapboxJsonStyle = useMemo(
    () =>
      JSON.stringify({
        ...(themeName === 'dark' ? mapboxDarkStyleJson : mapboxLightStyleJson),
        sprite: 'http://localhost:3000/sprite/v1/' + themeName, // todo: replace with remote config url
      }),
    [mapboxLightStyleJson, mapboxDarkStyleJson, themeName],
  );

  return {mapboxJsonStyle, mapboxStyleIsLoading};
};
