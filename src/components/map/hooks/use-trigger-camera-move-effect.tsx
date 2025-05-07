import {Feature, Point} from 'geojson';
import {MapLine} from '@atb/screen-components/travel-details-map-screen';
import {RefObject, useEffect} from 'react';
import MapboxGL from '@rnmapbox/maps';
import {useBottomSheetContext} from '@atb/components/bottom-sheet';
import {useBottomNavigationStyles} from '@atb/utils/navigation';
import {Coordinates} from '@atb/utils/coordinates';
import {
  fitBounds,
  flyToLocation,
  getMapPadding,
  mapPositionToCoordinates,
} from '../utils';
import {CameraFocusModeType, MapPadding} from '../types';
import {Dimensions, Platform, StatusBar} from 'react-native';

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
  mapCameraRef: RefObject<MapboxGL.Camera | null>,
  tabBarHeight?: number,
) => {
  const {height: bottomSheetHeight} = useBottomSheetContext();
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
      moveCameraToEntity(
        cameraFocusMode.entityFeature,
        cameraFocusMode.zoomTo ? padding : undefined,
        mapCameraRef,
        tabBarHeight,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bottomSheetHeight, cameraFocusMode, mapCameraRef]);
};

const moveCameraToMapLines = (
  mapLines: MapLine[],
  padding: MapPadding,
  mapCameraRef: RefObject<MapboxGL.Camera | null>,
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
  mapCameraRef: RefObject<MapboxGL.Camera | null>,
) => {
  flyToLocation({coordinates, mapCameraRef});
};

const moveCameraToEntity = (
  entityFeature: Feature<Point>,
  padding: MapPadding | undefined,
  mapCameraRef: RefObject<MapboxGL.Camera | null>,
  tabBarHeight?: number,
) => {
  const coordinates = mapPositionToCoordinates(
    entityFeature.geometry.coordinates,
  );
  if (!padding) {
    flyToLocation({
      coordinates,
      padding: getMapPadding(tabBarHeight),
      mapCameraRef,
      animationMode: 'easeTo',
    });
  } else {
    fitCameraWithinLocation(coordinates, mapCameraRef, padding, 0.001);
  }
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
  mapCameraRef: RefObject<MapboxGL.Camera | null>,
  padding: MapPadding = 0,
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

const useCalculatePaddings = (): MapPadding => {
  const {height: bottomSheetHeight} = useBottomSheetContext();
  const {minHeight: tabBarMinHeight} = useBottomNavigationStyles();
  const {height: screenHeight} = Dimensions.get('screen');
  const basePadding = screenHeight * 0.1;

  const bottomPaddingAdjustment = bottomSheetHeight - tabBarMinHeight;
  const topPadding =
    Platform.OS === 'android'
      ? basePadding + (StatusBar.currentHeight ?? 0)
      : basePadding;

  return [
    topPadding,
    basePadding,
    basePadding + bottomPaddingAdjustment,
    basePadding,
  ];
};
