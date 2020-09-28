import {MapViewProps, CameraProps} from '@react-native-mapbox-gl/maps';
import {Platform} from 'react-native';
import {MAPBOX_STOP_PLACES_STYLE_URL} from 'react-native-dotenv';

export const MapViewConfig: MapViewProps = {
  compassViewPosition: 3,
  compassEnabled: true,
  compassViewMargins: {
    x: Platform.select({default: 10, android: 6}),
    y: 90,
  },
  attributionPosition: Platform.select({
    default: {bottom: 8, left: 95},
    android: {bottom: 5, left: 95},
  }),
  styleURL: MAPBOX_STOP_PLACES_STYLE_URL,
};
export const MapCameraConfig: CameraProps = {
  animationMode: "moveTo"
}