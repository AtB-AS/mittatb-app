import {RefObject, useCallback, useMemo, useState} from 'react';
import {getCoordinatesFromMapSelectionAction} from '../utils';
import MapboxGL from '@rnmapbox/maps';
import {useGeolocationContext} from '@atb/GeolocationContext';
import {MapProps, MapSelectionActionType} from '../types';
import {useTriggerCameraMoveEffect} from './use-trigger-camera-move-effect';
import {useDecideCameraFocusMode} from './use-decide-camera-focus-mode';
import {useUpdateBottomSheetWhenSelectedEntityChanges} from './use-update-bottom-sheet-when-selected-entity-changes';
import {Coordinates} from '@atb/utils/coordinates';
import {useMapContext} from '@atb/MapContext';

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
  startingCoordinates: Coordinates,
) => {
  const [mapSelectionAction, setMapSelectionAction] = useState<
    MapSelectionActionType | undefined
  >({source: 'my-position', coords: startingCoordinates});
  const {location: currentLocation} = useGeolocationContext();
  const [fromCoords, setFromCoords] = useState(currentLocation?.coordinates);
  const {setBottomSheetCurrentlyAutoSelected} = useMapContext();

  const cameraFocusMode = useDecideCameraFocusMode(
    mapProps.selectionMode,
    fromCoords,
    mapSelectionAction,
    mapViewRef,
  );
  const distance =
    cameraFocusMode?.mode === 'map-lines'
      ? cameraFocusMode.distance
      : undefined;

  const closeCallback = useCallback(() => setMapSelectionAction(undefined), []);

  useTriggerCameraMoveEffect(cameraFocusMode, mapCameraRef);
  const {selectedFeature, onReportParkingViolation} =
    useUpdateBottomSheetWhenSelectedEntityChanges(
      mapProps,
      distance,
      mapSelectionAction,
      mapViewRef,
      closeCallback,
    );

  const onMapClick = useCallback(
    (sc: MapSelectionActionType) => {
      setBottomSheetCurrentlyAutoSelected(undefined);
      setMapSelectionAction(sc);
      setFromCoords(currentLocation?.coordinates);
    },
    [currentLocation?.coordinates, setBottomSheetCurrentlyAutoSelected],
  );

  const selectedCoordinates = useMemo(
    () =>
      mapSelectionAction
        ? getCoordinatesFromMapSelectionAction(mapSelectionAction)
        : undefined,
    [mapSelectionAction],
  );

  return {
    mapLines:
      cameraFocusMode?.mode === 'map-lines'
        ? cameraFocusMode.mapLines
        : undefined,
    onMapClick,
    selectedCoordinates,
    selectedFeature,
    onReportParkingViolation,
  };
};
