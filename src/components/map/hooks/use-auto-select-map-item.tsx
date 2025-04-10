import {VehicleExtendedFragment} from '@atb/api/types/generated/fragments/vehicles';
import {useBottomSheetContext} from '@atb/components/bottom-sheet';
import {AutoSelectableBottomSheetType, useMapContext} from '@atb/MapContext';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';
import React, {RefObject, useCallback, useEffect, useRef} from 'react';
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
import {InteractionManager} from 'react-native';
import {ShmoBookingState} from '@atb/api/types/mobility';
import {FinishedScooterSheet} from '@atb/mobility/components/sheets/FinishedScooterSheet';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';

export type AutoSelectableMapItem =
  | VehicleExtendedFragment
  | BikeStationFragment
  | CarStationFragment;

/**
 * When a new bottomSheetToAutoSelect is set and isn't already selected,
 * this hook opens the bottom sheet for it and flies to the correct map location
 */
export const useAutoSelectMapItem = (
  mapCameraRef: React.RefObject<CameraRef | null>,
  onReportParkingViolation: () => void,
  tabBarHeight?: number,
) => {
  const {
    bottomSheetToAutoSelect,
    setBottomSheetToAutoSelect,
    setBottomSheetCurrentlyAutoSelected,
    setAutoSelectedMapItem,
  } = useMapContext();
  const isFocused = useIsFocusedAndActive();
  const {open: openBottomSheet, close} = useBottomSheetContext();
  const navigation = useNavigation<RootNavigationProps>();
  const hasReservationOrAvailableFareContract =
    useHasReservationOrAvailableFareContract();
  const {enable_vipps_login} = useRemoteConfigContext();
  const {isShmoDeepIntegrationEnabled} = useFeatureTogglesContext();

  // NOTE: This ref is not used for anything since the map doesn't support
  // screen readers, but a ref is required when opening bottom sheets.
  const onCloseFocusRef = useRef<RefObject<any>>(null);

  const closeBottomSheet = useCallback(() => {
    setAutoSelectedMapItem(undefined);
    setBottomSheetCurrentlyAutoSelected(undefined);
    setBottomSheetToAutoSelect(undefined);
    close();
  }, [
    close,
    setAutoSelectedMapItem,
    setBottomSheetCurrentlyAutoSelected,
    setBottomSheetToAutoSelect,
  ]);

  const flyToMapItemLocation = useCallback(
    (mapItem: AutoSelectableMapItem) => {
      setAutoSelectedMapItem(mapItem);

      InteractionManager.runAfterInteractions(() => {
        /*
          When an item has already been loaded, onMapItemReceived will be called immediately, in which case flyToLocation won't work.
          This is why runAfterInteractions is used here. We may find that a setTimeout is needed as well.
        */
        mapCameraRef &&
          flyToLocation({
            coordinates: {
              latitude: mapItem.lat,
              longitude: mapItem.lon,
            },
            padding: {
              ...SLIGHTLY_RAISED_MAP_PADDING,
              paddingBottom:
                SLIGHTLY_RAISED_MAP_PADDING.paddingBottom + (tabBarHeight ?? 0),
            },
            mapCameraRef,
            zoomLevel: 19, // no clustering at this zoom level
          });
      });
    },
    [mapCameraRef, setAutoSelectedMapItem, tabBarHeight],
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
            if (
              bottomSheetToAutoSelect?.shmoBookingState ===
              ShmoBookingState.FINISHED
            ) {
              if (isShmoDeepIntegrationEnabled) {
                BottomSheetComponent = (
                  <FinishedScooterSheet
                    bookingId={bottomSheetToAutoSelect.id}
                    onClose={closeBottomSheet}
                    navigateSupportCallback={(operatorId, bookingId) => {
                      closeBottomSheet();
                      navigation.navigate('Root_ScooterHelpScreen', {
                        operatorId,
                        bookingId,
                      });
                    }}
                  />
                );
              }
            } else {
              BottomSheetComponent = (
                <ScooterSheet
                  vehicleId={bottomSheetToAutoSelect.id}
                  onClose={closeBottomSheet}
                  onVehicleReceived={flyToMapItemLocation}
                  onReportParkingViolation={onReportParkingViolation}
                  navigateSupportCallback={closeBottomSheet}
                  navigation={navigation}
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
            }
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
          openBottomSheet(
            () => BottomSheetComponent,
            onCloseFocusRef,
            false,
            tabBarHeight,
          );
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
    close,
    isShmoDeepIntegrationEnabled,
    tabBarHeight,
  ]);
};
