import {Platform} from 'react-native';
import {MAPBOX_STOP_PLACES_STYLE_URL} from '@env';
import {CameraStop} from '@rnmapbox/maps/lib/typescript/components/Camera';

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
