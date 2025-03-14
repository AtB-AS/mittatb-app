import {CameraStop} from '@rnmapbox/maps';
import {Dimensions} from 'react-native';

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
