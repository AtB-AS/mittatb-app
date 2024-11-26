import {VehicleExtendedFragment} from '@atb/api/types/generated/fragments/vehicles';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {AutoSelectableBottomSheetType, useMapState} from '@atb/MapContext';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';
import {RefObject, useCallback, useEffect, useRef} from 'react';
import {
  BikeStationBottomSheet,
  CarSharingStationBottomSheet,
  ScooterSheet,
} from '@atb/mobility';
import {flyToLocation} from '../utils';

import {CameraRef} from '@rnmapbox/maps/lib/typescript/src/components/Camera';
import {BicycleSheet} from '@atb/mobility/components/BicycleSheet';
import {
  BikeStationFragment,
  CarStationFragment,
} from '@atb/api/types/generated/fragments/stations';
import {SLIGHTLY_RAISED_MAP_PADDING} from '@atb/components/map';

/**
 * When a new bottomSheetToAutoSelect is set and isn't already selected,
 * this hook opens the bottom sheet for it and flies to the correct map location
 */
export const useAutoSelectMapItem = (
  mapCameraRef: React.RefObject<CameraRef>,
  onReportParkingViolation: () => void,
) => {
  const {
    bottomSheetToAutoSelect,
    setBottomSheetToAutoSelect,
    setBottomSheetCurrentlyAutoSelected,
  } = useMapState();
  const isFocused = useIsFocusedAndActive();
  const {open: openBottomSheet, close} = useBottomSheet();

  // NOTE: This ref is not used for anything since the map doesn't support
  // screen readers, but a ref is required when opening bottom sheets.
  const onCloseFocusRef = useRef<RefObject<any>>(null);

  const closeBottomSheet = useCallback(() => {
    close();
    setBottomSheetCurrentlyAutoSelected(undefined);
  }, [close, setBottomSheetCurrentlyAutoSelected]);

  const flyToMapItemLocation = useCallback(
    (
      mapItem:
        | VehicleExtendedFragment
        | BikeStationFragment
        | CarStationFragment,
    ) => {
      mapCameraRef &&
        flyToLocation({
          coordinates: {
            latitude: mapItem.lat,
            longitude: mapItem.lon,
          },
          padding: SLIGHTLY_RAISED_MAP_PADDING,
          mapCameraRef,
          // zoom level removed here for now due to performance bug
          // the bug has to do with onMapIdle being called too often
          //zoomLevel: SCOOTERS_MAX_CLUSTER_LEVEL + 0.01, // ensure no clustering
        });
    },
    [mapCameraRef],
  );

  /**
   * This should probably be aligned with useUpdateBottomSheetWhenSelectedEntityChanges,
   * allowing anything that can be selected by clicking the map, to also be selectable through QR code.
   */
  useEffect(() => {
    if (!isFocused) return;
    try {
      if (bottomSheetToAutoSelect) {
        let BottomSheetComponent: JSX.Element | undefined = undefined;
        switch (bottomSheetToAutoSelect.type) {
          case AutoSelectableBottomSheetType.Scooter:
            BottomSheetComponent = (
              <ScooterSheet
                vehicleId={bottomSheetToAutoSelect.id}
                onClose={closeBottomSheet}
                onVehicleReceived={flyToMapItemLocation}
                onReportParkingViolation={onReportParkingViolation}
              />
            );
            break;
          case AutoSelectableBottomSheetType.Bicycle:
            BottomSheetComponent = (
              <BicycleSheet
                vehicleId={bottomSheetToAutoSelect.id}
                onClose={closeBottomSheet}
                onVehicleReceived={flyToMapItemLocation}
              />
            );
            break;
          case AutoSelectableBottomSheetType.BikeStation:
            BottomSheetComponent = (
              <BikeStationBottomSheet
                stationId={bottomSheetToAutoSelect.id}
                distance={undefined}
                onClose={closeBottomSheet}
                onStationReceived={flyToMapItemLocation}
              />
            );
            break;
          case AutoSelectableBottomSheetType.CarStation:
            BottomSheetComponent = (
              <CarSharingStationBottomSheet
                stationId={bottomSheetToAutoSelect.id}
                distance={undefined}
                onClose={closeBottomSheet}
                onStationReceived={flyToMapItemLocation}
              />
            );
            break;
        }

        if (!!BottomSheetComponent) {
          openBottomSheet(() => BottomSheetComponent, onCloseFocusRef, false);
        }
        setBottomSheetCurrentlyAutoSelected(bottomSheetToAutoSelect);
        setBottomSheetToAutoSelect(undefined);
      }
    } catch (e) {
      console.warn('Failed to open bottom sheet with auto select');
      console.error(e);
    }
  }, [
    closeBottomSheet,
    bottomSheetToAutoSelect,
    openBottomSheet,
    isFocused,
    flyToMapItemLocation,
    setBottomSheetToAutoSelect,
    onReportParkingViolation,
    setBottomSheetCurrentlyAutoSelected,
  ]);
};
