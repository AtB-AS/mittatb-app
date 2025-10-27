import {useActiveShmoBookingQuery} from '@atb/modules/mobility';
import {MapBottomSheetType, useMapContext} from '../MapContext';
import {useCallback, useEffect} from 'react';
import {flyToLocation, mapPositionToCoordinates} from '../utils';
import {getSlightlyRaisedMapPadding} from '../MapConfig';
import {CameraRef} from '@rnmapbox/maps/lib/typescript/src/components/Camera';
import {MapView} from '@rnmapbox/maps';

/**
 * When you select an item in the map that opens a bottomsheet, we want to center the icon to the middle of the screen.
 * In order to do that we need to take into account the bottomsheet height, which can vary depending on content rendered.
 * So this hook reacts to changes in the bottomsheet state and height and then flies to the selected map item.
 */

export const useFlyToSelectedMapItemWithPadding = (
  mapCameraRef: React.RefObject<CameraRef | null>,
  mapViewRef: React.RefObject<MapView | null>,
) => {
  const {data: activeShmoBooking} = useActiveShmoBookingQuery();
  const {
    mapState,
    currentBottomSheet,
    setCurrentBottomSheet,
    paddingBottomMap,
  } = useMapContext();

  const flyToWithPadding = useCallback(() => {
    if (mapState.feature) {
      flyToLocation({
        coordinates: mapPositionToCoordinates(
          mapState.feature.geometry.coordinates,
        ),
        padding: getSlightlyRaisedMapPadding(paddingBottomMap),
        mapCameraRef,
        mapViewRef,
        animationMode: 'easeTo',
        zoomLevel: mapState?.customZoomLevel,
      });
    }
  }, [
    mapState.feature,
    mapState?.customZoomLevel,
    paddingBottomMap,
    mapCameraRef,
    mapViewRef,
  ]);

  useEffect(() => {
    if (activeShmoBooking !== null || !mapState.feature) {
      return;
    }

    // When a bottomsheet is already open and a user presses another item of the same type in the map
    const sameSheetType =
      currentBottomSheet?.bottomSheetType === mapState.bottomSheetType;

    const sameFeature =
      currentBottomSheet?.feature?.properties?.id ===
      mapState.feature.properties?.id;

    // This is the normal case where a user selects an item in the map and the bottomsheet opens.
    // We need to listen in a useEffect since the height is not fully determined yet, so "paddingBottomMap" might update two times on the same open, since some content is loaded late.
    if (!currentBottomSheet.isFullyOpen) {
      flyToWithPadding();
      return;
    }

    // If the bottomsheet is already open with the same type, but a different feature (swapping between scooters without closing the sheet etc), we need to fly to the new feature.
    // We need to manually know this, since events in the bottomsheet wont rerun on swapping data, since the sheet is already open.
    if (currentBottomSheet.isFullyOpen && sameSheetType && !sameFeature) {
      flyToWithPadding();

      // Store the new feature in state so it wont rerun this effect again until a new feature is selected.
      setCurrentBottomSheet({
        isFullyOpen: true,
        bottomSheetType: mapState.bottomSheetType,
        feature: mapState.feature,
      });
      return;
    }

    // If the bottomsheet type changed while being fully open (selecting new item in the map when something already is selected), we need to reset the bottomsheet state to closed, since the onClose event in the bottomsheet wont trigger when swapping between two different sheets.
    if (
      currentBottomSheet.isFullyOpen &&
      currentBottomSheet?.bottomSheetType !== mapState.bottomSheetType
    ) {
      setCurrentBottomSheet({
        isFullyOpen: false,
        bottomSheetType: MapBottomSheetType.None,
        feature: null,
      });
    }
  }, [
    activeShmoBooking,
    flyToWithPadding,
    mapState,
    setCurrentBottomSheet,
    currentBottomSheet,
  ]);
};
