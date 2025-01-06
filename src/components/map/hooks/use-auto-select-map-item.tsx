import {VehicleExtendedFragment} from '@atb/api/types/generated/fragments/vehicles';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {AutoSelectableBottomSheetType, useMapState} from '@atb/MapContext';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';
import {useCallback, useEffect} from 'react';
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
import {
  MapSelectionActionType,
  SLIGHTLY_RAISED_MAP_PADDING,
} from '@atb/components/map';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';

/**
 * When a new bottomSheetToAutoSelect is set and isn't already selected,
 * this hook opens the bottom sheet for it and flies to the correct map location
 */
export const useAutoSelectMapItem = (
  mapCameraRef: React.RefObject<CameraRef>,
  onReportParkingViolation: () => void,
  onMapClick: (sc: MapSelectionActionType) => void,
) => {
  const {
    bottomSheetToAutoSelect,
    setBottomSheetToAutoSelect,
    setBottomSheetCurrentlyAutoSelected,
  } = useMapState();
  const isFocused = useIsFocusedAndActive();
  const {open: openBottomSheet} = useBottomSheet(); // close

  const closeBottomSheet = useCallback(() => {
    //close(); // not needed?
    onMapClick({source: 'qr-scan', feature: undefined});
    setBottomSheetCurrentlyAutoSelected(undefined);
  }, [setBottomSheetCurrentlyAutoSelected, onMapClick]); // close,

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
          zoomLevel: 19, // 1 more than the max cluster zoom server side
        });
    },
    [mapCameraRef],
  );

  const onItemReceived = useCallback(
    (
      item: VehicleExtendedFragment | BikeStationFragment | CarStationFragment,
      vehicle_type_form_factor: FormFactor,
    ) => {
      console.log('item', JSON.stringify(item));
      onMapClick({
        source: 'qr-scan',
        feature: {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [item.lon, item.lat],
          },
          properties: {
            ...item, // todo: also get system_id on item, so that the spcecific instead of generic icon will be selected
            vehicle_type_form_factor,
          },
        },
      });
      flyToMapItemLocation(item);
    },
    [flyToMapItemLocation, onMapClick],
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
                onVehicleReceived={(item) =>
                  onItemReceived(item, FormFactor.Scooter)
                }
                onReportParkingViolation={onReportParkingViolation}
              />
            );
            break;
          case AutoSelectableBottomSheetType.Bicycle:
            BottomSheetComponent = (
              <BicycleSheet
                vehicleId={bottomSheetToAutoSelect.id}
                onClose={closeBottomSheet}
                onVehicleReceived={(item) =>
                  onItemReceived(item, FormFactor.Bicycle)
                }
              />
            );
            break;
          case AutoSelectableBottomSheetType.BikeStation:
            BottomSheetComponent = (
              <BikeStationBottomSheet
                stationId={bottomSheetToAutoSelect.id}
                distance={undefined}
                onClose={closeBottomSheet}
                onStationReceived={(item) =>
                  onItemReceived(item, FormFactor.Bicycle)
                }
              />
            );
            break;
          case AutoSelectableBottomSheetType.CarStation:
            BottomSheetComponent = (
              <CarSharingStationBottomSheet
                stationId={bottomSheetToAutoSelect.id}
                distance={undefined}
                onClose={closeBottomSheet}
                onStationReceived={(item) =>
                  onItemReceived(item, FormFactor.Car)
                }
              />
            );
            break;
        }

        if (!!BottomSheetComponent) {
          openBottomSheet(() => BottomSheetComponent, false);
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
    onItemReceived,
  ]);
};
