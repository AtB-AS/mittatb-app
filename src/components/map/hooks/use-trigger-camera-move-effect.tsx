import {Feature, Point} from 'geojson';
import {MapLine} from '@atb/travel-details-map-screen/utils';
import {RefObject, useEffect} from 'react';
import MapboxGL from '@rnmapbox/maps';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {useBottomNavigationStyles} from '@atb/utils/navigation';
import {Coordinates} from '@atb/utils/coordinates';
import {fitBounds, flyToLocation, mapPositionToCoordinates} from '../utils';
import {CameraFocusModeType} from '../types';
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
 * camera focus mode is 'entity' or 'map-lines' it will wait until the
 * bottom sheet is shown.
 */
export const useTriggerCameraMoveEffect = (
  cameraFocusMode: CameraFocusModeType | undefined,
  mapCameraRef: RefObject<MapboxGL.Camera>,
) => {
  const {height: bottomSheetHeight} = useBottomSheet();
  const padding = useCalculatePaddings();

  useEffect(() => {
    if (cameraFocusMode?.mode === 'coordinates') {
      moveCameraToCoordinates(cameraFocusMode.coordinates, mapCameraRef);
    } else if (cameraFocusMode?.mode === 'my-position') {
      fitCameraWithinLocation(cameraFocusMode.coordinates, mapCameraRef);
    }
  }, [cameraFocusMode, mapCameraRef]);

  /*
   * Moving camera to stop place and map lines are also dependent on that the
   * bottom sheet is visible first, to be able to calculate the correct bottom
   * padding.
   */
  useEffect(() => {
    if (!bottomSheetHeight) return;

    if (cameraFocusMode?.mode === 'map-lines') {
      moveCameraToMapLines(cameraFocusMode.mapLines, padding, mapCameraRef);
    } else if (cameraFocusMode?.mode === 'entity') {
      moveCameraToStopPlace(
        cameraFocusMode.stopPlaceFeature,
        padding,
        mapCameraRef,
      );
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

const moveCameraToCoordinates = (
  coordinates: Coordinates,
  mapCameraRef: RefObject<MapboxGL.Camera>,
) => {
  flyToLocation({coordinates, mapCameraRef});
};

const moveCameraToStopPlace = (
  stopPlaceFeature: Feature<Point>,
  padding: MapboxGL.Padding,
  mapCameraRef: RefObject<MapboxGL.Camera>,
) => {
  const stopPlaceCoordinates = mapPositionToCoordinates(
    stopPlaceFeature.geometry.coordinates,
  );
  fitCameraWithinLocation(stopPlaceCoordinates, mapCameraRef, padding, 0.001);
};

/**
 * Move the map camera to a bounded area based on the coordinates and a displacement
 * to the northwest and southwest! forming a box where the coordinate is the centre.
 * @param centerCoordinate
 * @param mapCameraRef
 * @param padding
 * @param displacement A distance for displacement in a coordinates system
 */
export const fitCameraWithinLocation = (
  centerCoordinate: Coordinates,
  mapCameraRef: RefObject<MapboxGL.Camera>,
  padding: MapboxGL.Padding = 0,
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
