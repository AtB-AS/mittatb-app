import {useBottomSheetContext} from '@atb/components/bottom-sheet';
import {useMapContext} from '@atb/MapContext';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';
import React, {RefObject, useCallback, useEffect, useRef} from 'react';
import {flyToLocation} from '../utils';
import {CameraRef} from '@rnmapbox/maps/lib/typescript/src/components/Camera';
import {SLIGHTLY_RAISED_MAP_PADDING} from '@atb/components/map';
import {useNavigation} from '@react-navigation/native';
import {RootNavigationProps} from '@atb/stacks-hierarchy';
import {useActiveShmoBookingQuery} from '@atb/mobility/queries/use-active-shmo-booking-query';
import {ActiveScooterSheet} from '@atb/mobility/components/sheets/ActiveScooterSheet';
import {ShmoBookingState} from '@atb/api/types/mobility';
import {useGeolocationContext} from '@atb/GeolocationContext';
import {FinishedScooterSheet} from '@atb/mobility/components/sheets/FinishedScooterSheet';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';

export const useShmoActiveBottomSheet = (
  mapCameraRef: React.RefObject<CameraRef | null>,
) => {
  const {data: activeBooking} = useActiveShmoBookingQuery();
  const {isShmoDeepIntegrationEnabled} = useFeatureTogglesContext();
  const {
    bottomSheetToAutoSelect,
    setBottomSheetToAutoSelect,
    setBottomSheetCurrentlyAutoSelected,
  } = useMapContext();
  const isFocused = useIsFocusedAndActive();
  const {open: openBottomSheet, close} = useBottomSheetContext();
  const navigation = useNavigation<RootNavigationProps>();
  const {getCurrentCoordinates} = useGeolocationContext();

  // NOTE: This ref is not used for anything since the map doesn't support
  // screen readers, but a ref is required when opening bottom sheets.
  const onCloseFocusRef = useRef<RefObject<any>>(null);

  const closeBottomSheet = useCallback(() => {
    close();
    setBottomSheetCurrentlyAutoSelected(undefined);
  }, [close, setBottomSheetCurrentlyAutoSelected]);

  const flyToUserLocation = useCallback(async () => {
    const coordiantes = await getCurrentCoordinates();
    mapCameraRef &&
      flyToLocation({
        coordinates: {
          latitude: coordiantes?.latitude ?? 0,
          longitude: coordiantes?.latitude ?? 0,
        },
        padding: SLIGHTLY_RAISED_MAP_PADDING,
        mapCameraRef,
        zoomLevel: 15,
      });
  }, [mapCameraRef, getCurrentCoordinates]);

  useEffect(() => {
    if (!isFocused || !isShmoDeepIntegrationEnabled) return;
    try {
      if (
        activeBooking &&
        activeBooking.asset.formFactor === FormFactor.Scooter
      ) {
        switch (activeBooking.state) {
          case ShmoBookingState.IN_USE:
            openBottomSheet(
              () => (
                <ActiveScooterSheet
                  onClose={closeBottomSheet}
                  onActiveBookingReceived={flyToUserLocation}
                  navigateSupportCallback={() => {
                    closeBottomSheet();
                    navigation.navigate('Root_ScooterHelpScreen', {
                      operatorId: activeBooking.asset.operator.id,
                      vehicleId: null, //null when active booking, bookingId is used in support api instead
                    });
                  }}
                />
              ),
              onCloseFocusRef,
              false,
            );
            break;
          case ShmoBookingState.FINISHING:
            openBottomSheet(
              () => (
                <FinishedScooterSheet
                  onClose={closeBottomSheet}
                  navigateSupportCallback={() => {
                    closeBottomSheet();
                    navigation.navigate('Root_ScooterHelpScreen', {
                      operatorId: activeBooking.asset.operator.id,
                      vehicleId: null, //null when active booking, bookingId is used in support api instead
                    });
                  }}
                />
              ),
              onCloseFocusRef,
              false,
            );
            break;
          default:
            break;
        }
        setBottomSheetToAutoSelect(undefined);
      }
    } catch (e) {
      console.warn('Failed to open bottom sheet from active booking');
      console.error(e);
    }
  }, [
    closeBottomSheet,
    bottomSheetToAutoSelect,
    openBottomSheet,
    isFocused,
    flyToUserLocation,
    setBottomSheetToAutoSelect,
    navigation,
    activeBooking,
    isShmoDeepIntegrationEnabled,
  ]);
};
