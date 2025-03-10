import {VehicleExtendedFragment} from '@atb/api/types/generated/fragments/vehicles';
import {useBottomSheetContext} from '@atb/components/bottom-sheet';
import {AutoSelectableBottomSheetType, useMapContext} from '@atb/MapContext';
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
import {useNavigation} from '@react-navigation/native';
import {RootNavigationProps} from '@atb/stacks-hierarchy';
import {useHasReservationOrAvailableFareContract} from '@atb/ticketing';
import {useRemoteConfigContext} from '@atb/RemoteConfigContext';
import {PhotoFile} from '@atb/components/camera';
import {ShmoBookingEvent, ShmoBookingEventType} from '@atb/api/types/mobility';
import {useSendShmoBookingEventMutation} from '@atb/mobility/queries/use-send-shmo-booking-event-mutation';

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
  } = useMapContext();
  const isFocused = useIsFocusedAndActive();
  const {open: openBottomSheet, close} = useBottomSheetContext();
  const navigation = useNavigation<RootNavigationProps>();
  const hasReservationOrAvailableFareContract =
    useHasReservationOrAvailableFareContract();
  const {enable_vipps_login} = useRemoteConfigContext();

  const {mutateAsync: sendShmoBookingEvent} = useSendShmoBookingEventMutation();

  const onEndTrip = (file: PhotoFile, bookingId: string) => {
    if (bookingId) {
      const finishEvent: ShmoBookingEvent = {
        event: ShmoBookingEventType.FINISH,
        fileName: 'scooterPhoto.png',
        fileType: 'image/png',
        fileData:
          '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',
      };
      sendShmoBookingEvent({
        bookingId: bookingId,
        shmoBookingEvent: finishEvent,
      });
    }
  };

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
                navigateSupportCallback={() => {
                  closeBottomSheet();
                  navigation.navigate('Root_ScooterHelpScreen', {
                    vehicleId: bottomSheetToAutoSelect.id,
                  });
                }}
                photoNavigation={(bookingId) => {
                  closeBottomSheet();
                  navigation.navigate('Root_PhotoCaptureScreen', {
                    confirmImageCallback: (photo) =>
                      onEndTrip(photo, bookingId),
                  });
                }}
                loginCallback={() => {
                  closeBottomSheet();
                  if (hasReservationOrAvailableFareContract) {
                    navigation.navigate(
                      'Root_LoginAvailableFareContractWarningScreen',
                      {},
                    );
                  } else if (enable_vipps_login) {
                    navigation.navigate('Root_LoginOptionsScreen', {
                      showGoBack: true,
                      transitionOverride: 'slide-from-bottom',
                    });
                  } else {
                    navigation.navigate('Root_LoginPhoneInputScreen', {});
                  }
                }}
                startOnboardingCallback={() => {
                  closeBottomSheet();
                  navigation.navigate('Root_ShmoOnboardingScreen');
                }}
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
    navigation,
    enable_vipps_login,
    hasReservationOrAvailableFareContract,
    onEndTrip,
  ]);
};
