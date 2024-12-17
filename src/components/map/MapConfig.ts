import {Platform} from 'react-native';
import {MAPBOX_STOP_PLACES_STYLE_URL} from '@env';
import {CameraStop} from '@rnmapbox/maps';
import {Dimensions} from 'react-native';

export const MapViewConfig = {
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
  styleURL: MAPBOX_STOP_PLACES_STYLE_URL,
};

export const MapCameraConfig: CameraStop = {
  animationMode: 'moveTo',
};

export const SCOOTERS_MAX_CLUSTER_LEVEL = 21;
export const SCOOTERS_MAX_ZOOM_LEVEL = 22;
export const SCOOTERS_CLUSTER_RADIUS = 40;

const {height: screenHeight} = Dimensions.get('screen');
const basePadding = screenHeight * 0.1;

export const SLIGHTLY_RAISED_MAP_PADDING = {
  paddingTop: basePadding,
  paddingBottom: 2 * basePadding,
  paddingLeft: basePadding,
  paddingRight: basePadding,
};
