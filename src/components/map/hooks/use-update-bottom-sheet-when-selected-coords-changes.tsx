import {
  CameraFocusModeType,
  FeatureOrCoordinates,
  MapProps,
} from '@atb/components/map/types';
import React, {RefObject, useEffect} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import DeparturesDialogSheet from '@atb/components/map/components/DeparturesDialogSheet';
import {findClickedStopPlace, isCoordinates} from '@atb/components/map/utils';
import MapboxGL from '@react-native-mapbox-gl/maps';

export const useUpdateBottomSheetWhenSelectedCoordsChanges = (
  mapProps: MapProps,
  cameraFocusMode: CameraFocusModeType | undefined,
  mapViewRef: RefObject<MapboxGL.MapView>,
  closeCallback: () => void,
) => {
  const isFocused = useIsFocused();

  const {open: openBottomSheet, close: closeBottomSheet} = useBottomSheet();

  const closeWithCallback = () => {
    closeBottomSheet();
    closeCallback();
  };

  useEffect(() => {
    (async function () {
      if (!isFocused) return;
      if (mapProps.selectionMode !== 'ExploreStops') return;

      if (
        cameraFocusMode?.mode === 'stop-place' ||
        cameraFocusMode?.mode === 'map-lines'
      ) {
        openBottomSheet(
          () => (
            <DeparturesDialogSheet
              close={closeWithCallback}
              stopPlaceFeature={cameraFocusMode.stopPlaceFeature}
              navigateToDetails={(...params) => {
                closeBottomSheet();
                mapProps.navigateToDetails(...params);
              }}
              navigateToQuay={(...params) => {
                closeBottomSheet();
                mapProps.navigateToQuay(...params);
              }}
            />
          ),
          undefined,
          false,
        );
      } else {
        closeWithCallback();
      }
    })();
  }, [cameraFocusMode, isFocused]);
};
