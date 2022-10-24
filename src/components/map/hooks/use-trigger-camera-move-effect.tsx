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

type BoundingBox = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
};

const DEFAULT_PADDING = 100;
const DEFAULT_PADDING_DISPLACEMENT = 0.0003;

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
  const {minHeight: tabBarMinHeight} = useBottomNavigationStyles();
  const paddingBottom = bottomSheetHeight - tabBarMinHeight;
  useEffect(() => {
    if (!cameraFocusMode) return;

    switch (cameraFocusMode.mode) {
      case 'map-lines': {
        if (!bottomSheetHeight) return;
        moveCameraToMapLines(
          cameraFocusMode.mapLines,
          paddingBottom,
          mapCameraRef,
        );
        break;
      }
      case 'stop-place': {
        if (!bottomSheetHeight) return;
        moveCameraToStopPlace(
          cameraFocusMode.stopPlaceFeature,
          paddingBottom,
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
  paddingBottom: number,
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
  fitBounds(northEast, southWest, mapCameraRef, [
    DEFAULT_PADDING,
    DEFAULT_PADDING,
    DEFAULT_PADDING + paddingBottom,
    DEFAULT_PADDING,
  ]);
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
  flyToLocation(selectedCoordinates, 750, mapCameraRef);
};

const moveCameraToStopPlace = (
  stopPlaceFeature: Feature<Point>,
  paddingBottom: number,
  mapCameraRef: RefObject<MapboxGL.Camera>,
) => {
  const stopPlaceCoordinates = mapPositionToCoordinates(
    stopPlaceFeature.geometry.coordinates,
  );
  const northEast: Coordinates = {
    longitude: stopPlaceCoordinates.longitude - DEFAULT_PADDING_DISPLACEMENT,
    latitude: stopPlaceCoordinates.latitude - DEFAULT_PADDING_DISPLACEMENT,
  };
  const southWest: Coordinates = {
    longitude: stopPlaceCoordinates.longitude + DEFAULT_PADDING_DISPLACEMENT,
    latitude: stopPlaceCoordinates.latitude + DEFAULT_PADDING_DISPLACEMENT,
  };
  fitBounds(northEast, southWest, mapCameraRef, [
    DEFAULT_PADDING,
    DEFAULT_PADDING,
    DEFAULT_PADDING + paddingBottom,
    DEFAULT_PADDING,
  ]);
};
