import {Coordinates} from '@atb/screens/TripDetails/Map/types';
import React, {RefObject, useState} from 'react';
import {getCoordinatesFromFeatureOrCoordinates} from '@atb/components/map/utils';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {useGeolocationState} from '@atb/GeolocationContext';
import {FeatureOrCoordinates, MapProps} from '../types';
import {useTriggerCameraMoveEffect} from './use-trigger-camera-move-effect';
import {useDecideCameraFocusMode} from './use-decide-camera-focus-mode';
import {useUpdateBottomSheetWhenSelectedCoordsChanges} from './use-update-bottom-sheet-when-selected-coords-changes';

/**
 * This is a custom hook handling all effects triggered when the user clicks the
 * map, whether it is finding map lines, opening bottom sheet, moving camera
 * focus, and so on. As such this hook is quite complex, but it has the benefit
 * of encapsulating the complexity so it doesn't affect the Map-component.
 *
 * To simplify this a bit the logic is drawn out into smaller custom hooks that
 * can be inspected when necessary.
 */
export const useMapSelectionChangeEffect = (
  mapProps: MapProps,
  mapViewRef: RefObject<MapboxGL.MapView>,
  mapCameraRef: RefObject<MapboxGL.Camera>,
) => {
  const [selectedFeatureOrCoords, setSelectedFeatureOrCoords] =
    useState<FeatureOrCoordinates>();
  const {location: currentLocation} = useGeolocationState();
  const [fromCoords, setFromCoords] = useState(currentLocation?.coordinates);

  const cameraFocusMode = useDecideCameraFocusMode(
    mapProps.selectionMode,
    fromCoords,
    selectedFeatureOrCoords,
    mapViewRef,
  );
  useTriggerCameraMoveEffect(cameraFocusMode, mapCameraRef);
  useUpdateBottomSheetWhenSelectedCoordsChanges(
    mapProps,
    selectedFeatureOrCoords,
    mapViewRef,
    () => setSelectedFeatureOrCoords(undefined),
  );

  return {
    mapLines:
      cameraFocusMode?.mode === 'map-lines'
        ? cameraFocusMode.mapLines
        : undefined,
    onMapClick: (fc: FeatureOrCoordinates) => {
      setSelectedFeatureOrCoords(fc);
      setFromCoords(currentLocation?.coordinates);
    },
    selectedCoordinates: selectedFeatureOrCoords
      ? getCoordinatesFromFeatureOrCoordinates(selectedFeatureOrCoords)
      : undefined,
  };
};
