import {useBottomSheetContext} from '@atb/components/bottom-sheet';
import {useMapContext} from '@atb/modules/map';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';
import React, {RefObject, useCallback, useEffect, useRef} from 'react';
import {flyToLocation, getMapPadding} from '../utils';
import MapboxGL from '@rnmapbox/maps';
import {useNavigation} from '@react-navigation/native';
import {RootNavigationProps} from '@atb/stacks-hierarchy';
import {useActiveShmoBookingQuery} from '@atb/modules/mobility';
import {ActiveScooterSheet} from '@atb/modules/mobility';
import {ShmoBookingState} from '@atb/api/types/mobility';
import {useGeolocationContext} from '@atb/modules/geolocation';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';

export const useShmoActiveBottomSheet = (
  mapCameraRef: React.RefObject<MapboxGL.Camera | null>,
  mapViewRef: RefObject<MapboxGL.MapView | null>,
  mapSelectionCloseCallback: () => void,
  tabBarHeight?: number,
) => {
  const {data: activeBooking} = useActiveShmoBookingQuery();
  const {isShmoDeepIntegrationEnabled} = useFeatureTogglesContext();
  const {setBottomSheetToAutoSelect, setBottomSheetCurrentlyAutoSelected} =
    useMapContext();
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
    const coordinates = await getCurrentCoordinates();
    mapCameraRef &&
      flyToLocation({
        coordinates: {
          latitude: coordinates?.latitude ?? 0,
          longitude: coordinates?.longitude ?? 0,
        },
        padding: getMapPadding(tabBarHeight),
        mapCameraRef,
        mapViewRef,
        zoomLevel: 15,
      });
  }, [getCurrentCoordinates, mapCameraRef, mapViewRef, tabBarHeight]);

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
                  mapViewRef={mapViewRef}
                  onForceClose={mapSelectionCloseCallback}
                  onActiveBookingReceived={flyToUserLocation}
                  navigateSupportCallback={() => {
                    closeBottomSheet();
                    navigation.navigate('Root_ScooterHelpScreen', {
                      operatorId: activeBooking.asset.operator.id,
                      bookingId: activeBooking.bookingId,
                    });
                  }}
                  photoNavigation={() => {
                    mapSelectionCloseCallback();
                    closeBottomSheet();
                    navigation.navigate('Root_ParkingPhotoScreen', {
                      bookingId: activeBooking.bookingId,
                    });
                  }}
                />
              ),
              onCloseFocusRef,
              false,
              tabBarHeight,
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
    openBottomSheet,
    isFocused,
    flyToUserLocation,
    setBottomSheetToAutoSelect,
    navigation,
    activeBooking,
    isShmoDeepIntegrationEnabled,
    mapSelectionCloseCallback,
    tabBarHeight,
    mapViewRef,
  ]);
};
