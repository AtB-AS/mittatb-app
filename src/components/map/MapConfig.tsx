import {Platform} from 'react-native';
import {MAPBOX_STOP_PLACES_STYLE_URL} from 'react-native-dotenv';

export const MapViewConfig = {
  compassViewPosition: 3,
  compassEnabled: true,
  compassViewMargins: {
    x: Platform.select({default: 10, android: 6}),
    y: 90,
  },
  attributionPosition: Platform.select({
    default: {bottom: 8, left: 95},
    android: {bottom: 5, left: 125},
  }),
  styleURL: MAPBOX_STOP_PLACES_STYLE_URL,
};
