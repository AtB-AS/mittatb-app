import React, {RefObject, useState} from 'react';
import {getCoordinatesFromFeatureOrCoordinates} from '@atb/components/map/utils';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {useGeolocationState} from '@atb/GeolocationContext';
import {FeatureOrCoordinates, MapProps} from '../types';
import {useTriggerCameraMoveEffect} from './use-trigger-camera-move-effect';
import {useDecideCameraFocusMode} from './use-decide-camera-focus-mode';
import {useUpdateBottomSheetWhenSelectedStopPlaceChanges} from './use-update-bottom-sheet-when-selected-stop-place-changes';
import {useFindSelectedStopPlace} from '@atb/components/map/hooks/use-find-selected-stop-place';

/**
 * This is a custom hook handling all effects triggered when the user clicks the
 * map, whether it is finding stop place, finding map lines, opening bottom
 * sheet, moving camera focus, and so on. As such everything this hook handles
 * are quite complex, but it has the benefit of encapsulating the complexity, so
 * it doesn't leak out to the Map-component.
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

  const selectedStopPlaceFeature = useFindSelectedStopPlace(
    mapProps.selectionMode,
    selectedFeatureOrCoords,
    mapViewRef,
  );
  const cameraFocusMode = useDecideCameraFocusMode(
    mapProps.selectionMode,
    fromCoords,
    selectedFeatureOrCoords,
    selectedStopPlaceFeature,
  );
  useTriggerCameraMoveEffect(cameraFocusMode, mapCameraRef);
  useUpdateBottomSheetWhenSelectedStopPlaceChanges(
    mapProps,
    selectedStopPlaceFeature,
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
