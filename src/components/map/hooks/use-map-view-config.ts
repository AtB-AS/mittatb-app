import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {MAPBOX_STOP_PLACES_STYLE_URL} from '@env';
import {Platform} from 'react-native';
import {useMapboxJsonStyle} from './use-mapbox-json-style';
import {useThemeContext} from '@atb/theme';

const MapViewStaticConfig = {
  compassEnabled: true,
  scaleBarEnabled: false,
  // `mapbox` (v10) Adds compass offset `compassViewMargins` is still supported but generates issues:
  // Mapbox error fireEvent failed: <rnmapbox_maps.RCTMGLEvent: 0x6000028a0fe0>
  compassPosition: {
    top: 60,
    right: Platform.select({default: 10, android: 6}),
  },
  attributionPosition: Platform.select({
    default: {bottom: 8, left: 95},
    android: {bottom: 5, left: 120},
  }),
};

export const useMapViewConfig = (
  shouldShowVehiclesAndStations: boolean,
  useDarkModeForV1: boolean = false,
) => {
  const {themeName} = useThemeContext();
  const {isMapV2Enabled} = useFeatureTogglesContext();
  const mapboxJsonStyle = useMapboxJsonStyle(shouldShowVehiclesAndStations);
  const configMapV1 = {
    styleURL:
      useDarkModeForV1 && themeName === 'dark'
        ? 'mapbox://styles/mapbox/dark-v10'
        : MAPBOX_STOP_PLACES_STYLE_URL,
  };
  const configMapV2 = {styleJSON: mapboxJsonStyle};

  return {
    ...MapViewStaticConfig,
    ...(isMapV2Enabled ? configMapV2 : configMapV1),
  };
};
