import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {MAPBOX_STOP_PLACES_STYLE_URL} from '@env';
import {Platform} from 'react-native';
import {useMapboxJsonStyle} from './use-mapbox-json-style';

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

export const useMapViewConfig = (shouldShowVehiclesAndStations: boolean) => {
  const {isMapV2Enabled} = useFeatureTogglesContext();
  const mapboxJsonStyle = useMapboxJsonStyle(shouldShowVehiclesAndStations);

  return {
    ...MapViewStaticConfig,
    ...{
      styleURL: isMapV2Enabled ? mapboxJsonStyle : MAPBOX_STOP_PLACES_STYLE_URL,
    },
  };
};
