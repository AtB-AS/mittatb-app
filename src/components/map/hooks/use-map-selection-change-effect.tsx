import {RefObject, useEffect, useState} from 'react';
import {getCoordinatesFromMapSelectionAction} from '@atb/components/map/utils';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {useGeolocationState} from '@atb/GeolocationContext';
import {MapProps, MapSelectionActionType} from '../types';
import {useTriggerCameraMoveEffect} from './use-trigger-camera-move-effect';
import {useDecideCameraFocusMode} from './use-decide-camera-focus-mode';
import {useUpdateBottomSheetWhenSelectedStopPlaceChanges} from './use-update-bottom-sheet-when-selected-stop-place-changes';
import {Coordinates} from '@atb/screens/TripDetails/Map/types';

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
  const {location: currentLocation} = useGeolocationState();
  const [fromCoords, setFromCoords] = useState(currentLocation?.coordinates);
  const [distance, setDistance] = useState<number | undefined>();

  const cameraFocusMode = useDecideCameraFocusMode(
    mapProps.selectionMode,
    fromCoords,
    mapSelectionAction,
    mapViewRef,
  );
  useEffect(() => {
    setDistance(
      cameraFocusMode?.mode === 'map-lines'
        ? cameraFocusMode.distance
        : undefined,
    );
  }, [cameraFocusMode]);

  useTriggerCameraMoveEffect(cameraFocusMode, mapCameraRef);
  useUpdateBottomSheetWhenSelectedStopPlaceChanges(
    mapProps,
    distance,
    mapSelectionAction,
    mapViewRef,
    () => setMapSelectionAction(undefined),
  );

  return {
    mapLines:
      cameraFocusMode?.mode === 'map-lines'
        ? cameraFocusMode.mapLines
        : undefined,
    onMapClick: (sc: MapSelectionActionType) => {
      setMapSelectionAction(sc);
      setFromCoords(currentLocation?.coordinates);
    },
    selectedCoordinates: mapSelectionAction
      ? getCoordinatesFromMapSelectionAction(mapSelectionAction)
      : undefined,
  };
};
