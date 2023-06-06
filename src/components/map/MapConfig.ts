//import {CameraStop, MapViewProps} from '@rnmapbox/maps';
import {Platform} from 'react-native';
import {MAPBOX_STOP_PLACES_STYLE_URL} from '@env';
import {CameraStop} from '@rnmapbox/maps/lib/typescript/components/Camera';

export const MapViewConfig = {
  compassViewPosition: 1, // Upper right
  compassEnabled: true,
  scaleBarEnabled: false,
  compassViewMargins: {
    x: Platform.select({default: 10, android: 6}),
    y: 60,
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
