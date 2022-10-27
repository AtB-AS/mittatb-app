import {Feature, Point} from 'geojson';
import {MapLine} from '@atb/screens/TripDetails/Map/utils';
import {RefObject, useEffect} from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {useBottomNavigationStyles} from '@atb/utils/navigation';
import {Coordinates} from '@atb/screens/TripDetails/Map/types';
import {
  fitBounds,
  flyToLocation,
  getCoordinatesFromFeatureOrCoordinates,
  mapPositionToCoordinates,
} from '@atb/components/map/utils';
import {
  CameraFocusModeType,
  FeatureOrCoordinates,
} from '@atb/components/map/types';
import {Dimensions, PixelRatio, Platform, StatusBar} from 'react-native';

type BoundingBox = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
};

// Move coordinates 0.003 represents around 0.3664 km in radius and a diagonal distance between northwest and southeast of 0.7328 km approximately
const DEFAULT_PADDING_DISPLACEMENT = 0.003;

/**
 * Trigger camera move based on the camera focus mode. When the camera focus
 * mode is 'coordinates' the camera movement happens instantly, but when the
 * camera focus mode is 'stop-place' or 'map-lines' it will wait until the
 * bottom sheet is shown.
 */
export const useTriggerCameraMoveEffect = (
  cameraFocusMode: CameraFocusModeType | undefined,
  mapCameraRef: RefObject<MapboxGL.Camera>,
) => {
  const {height: bottomSheetHeight} = useBottomSheet();
  const padding = useCalculatePaddings();

  useEffect(() => {
    if (!cameraFocusMode) return;

    switch (cameraFocusMode.mode) {
      case 'map-lines': {
        if (!bottomSheetHeight) return;
        moveCameraToMapLines(cameraFocusMode.mapLines, padding, mapCameraRef);
        break;
      }
      case 'stop-place': {
        if (!bottomSheetHeight) return;
        moveCameraToStopPlace(
          cameraFocusMode.stopPlaceFeature,
          100,
          mapCameraRef,
        );
        break;
      }
      case 'coordinates': {
        moveCameraToFeatureOrCoordinates(
          cameraFocusMode.coordinates,
          mapCameraRef,
        );
        break;
      }
    }
  }, [bottomSheetHeight, cameraFocusMode, mapCameraRef]);
};

const moveCameraToMapLines = (
  mapLines: MapLine[],
  padding: MapboxGL.Padding,
  mapCameraRef: RefObject<MapboxGL.Camera>,
) => {
  const bbox = getMapLinesBoundingBox(mapLines);
  const northEast: Coordinates = {
    longitude: bbox.xMin,
    latitude: bbox.yMin,
  };
  const southWest: Coordinates = {
    longitude: bbox.xMax,
    latitude: bbox.yMax,
  };
  fitBounds(northEast, southWest, mapCameraRef, padding);
};

const getMapLinesBoundingBox = (data: MapLine[]): BoundingBox => {
  const bounds: BoundingBox = {xMin: 180, xMax: 0, yMin: 90, yMax: 0};
  let coords, latitude, longitude;

  for (let i = 0; i < data.length; i++) {
    coords = data[i].geometry.coordinates;

    for (let j = 0; j < coords.length; j++) {
      longitude = coords[j][0];
      latitude = coords[j][1];
      bounds.xMin = bounds.xMin < longitude ? bounds.xMin : longitude;
      bounds.xMax = bounds.xMax > longitude ? bounds.xMax : longitude;
      bounds.yMin = bounds.yMin < latitude ? bounds.yMin : latitude;
      bounds.yMax = bounds.yMax > latitude ? bounds.yMax : latitude;
    }
  }

  return bounds;
};

const moveCameraToFeatureOrCoordinates = (
  featureOrCoordinates: FeatureOrCoordinates,
  mapCameraRef: RefObject<MapboxGL.Camera>,
) => {
  const selectedCoordinates =
    getCoordinatesFromFeatureOrCoordinates(featureOrCoordinates);
  flyToLocation(selectedCoordinates, mapCameraRef);
};

const moveCameraToStopPlace = (
  stopPlaceFeature: Feature<Point>,
  padding: MapboxGL.Padding,
  mapCameraRef: RefObject<MapboxGL.Camera>,
) => {
  const stopPlaceCoordinates = mapPositionToCoordinates(
    stopPlaceFeature.geometry.coordinates,
  );
  moveCameraToCoordinate(mapCameraRef, stopPlaceCoordinates, padding);
};

/**
 * Move the map camera to a bounded area based on the coordinates and a displacement
 * to the northwest and southwest! forming a box where the coordinate is the centre.
 * @param mapCameraRef
 * @param centerCoordinate
 * @param paddingBottom
 * @param displacement A distance for displacement in a coordinates system
 */
export const moveCameraToCoordinate = (
  mapCameraRef: RefObject<MapboxGL.Camera>,
  centerCoordinate: Coordinates,
  padding: MapboxGL.Padding,
  displacement: number = DEFAULT_PADDING_DISPLACEMENT,
) => {
  const northEast: Coordinates = {
    longitude: centerCoordinate.longitude - displacement,
    latitude: centerCoordinate.latitude - displacement,
  };
  const southWest: Coordinates = {
    longitude: centerCoordinate.longitude + displacement,
    latitude: centerCoordinate.latitude + displacement,
  };
  fitBounds(northEast, southWest, mapCameraRef, padding);
};

const useCalculatePaddings = (): MapboxGL.Padding => {
  const {height: bottomSheetHeight} = useBottomSheet();
  const {minHeight: tabBarMinHeight} = useBottomNavigationStyles();
  const {height: screenHeight} = Dimensions.get('screen');
  const padding = screenHeight * 0.1;

  if (Platform.OS === 'android') {
    const headerHeight = StatusBar.currentHeight ?? 0;

    // This is the base level for the padding, where the values are divided by the device font scale to match the map unit.
    const scaledBottomSheetPadding = bottomSheetHeight - tabBarMinHeight;
    return [
      padding + headerHeight, // Subtract the header height on Android since it is not see through
      padding,
      padding + scaledBottomSheetPadding,
      padding,
    ].map((p) => p / PixelRatio.getFontScale()) as MapboxGL.Padding;
  }

  return [
    padding,
    padding,
    padding + (bottomSheetHeight - tabBarMinHeight),
    padding,
  ];
};
