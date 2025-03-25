import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';
import React, {useCallback, useEffect} from 'react';
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
import {useBottomSheetV2} from '@atb/components/bottom-sheet-v2';
import {useMapContext} from '@atb/MapContext';

export const useShmoActiveBottomSheet = (
  mapCameraRef: React.RefObject<CameraRef | null>,
) => {
  const {data: activeBooking} = useActiveShmoBookingQuery();
  const {isShmoDeepIntegrationEnabled} = useFeatureTogglesContext();
  const isFocused = useIsFocusedAndActive();
  const navigation = useNavigation<RootNavigationProps>();
  const {getCurrentCoordinates} = useGeolocationContext();
  const {setContent, snapToIndex, close} = useBottomSheetV2();

  const {bottomSheetToAutoSelect, setBottomSheetCurrentlyAutoSelected} =
    useMapContext();

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
        activeBooking
        /* TODO: uncomment this when formfactor is in use
        && activeBooking.asset.formFactor === FormFactor.Scooter*/
      ) {
        switch (activeBooking.state) {
          case ShmoBookingState.IN_USE:
            setContent(
              <ActiveScooterSheet
                onActiveBookingReceived={flyToUserLocation}
                navigateSupportCallback={() => {
                  console.log('navigateSupportCallback11111');
                  closeBottomSheet();
                  navigation.navigate('Root_ScooterHelpScreen', {
                    vehicleId: 'fixthis', //TODO:this will be fixed in another PR
                  });
                }}
              />,
            );
            snapToIndex(1);
            setBottomSheetCurrentlyAutoSelected(bottomSheetToAutoSelect);
            break;
          case ShmoBookingState.FINISHING:
            setContent(
              <FinishedScooterSheet
                onClose={closeBottomSheet}
                navigateSupportCallback={() => {
                  closeBottomSheet();
                  navigation.navigate('Root_ScooterHelpScreen', {
                    vehicleId: 'fixthis', //TODO:this will be fixed in another PR
                  });
                }}
              />,
            );
            snapToIndex(1);
            setBottomSheetCurrentlyAutoSelected(bottomSheetToAutoSelect);
            break;
          default:
            break;
        }
      }
    } catch (e) {
      console.warn('Failed to open bottom sheet from active booking');
      console.error(e);
    }
  }, [
    isFocused,
    flyToUserLocation,
    navigation,
    activeBooking,
    isShmoDeepIntegrationEnabled,
    snapToIndex,
    setContent,
    closeBottomSheet,
    bottomSheetToAutoSelect,
    setBottomSheetCurrentlyAutoSelected,
  ]);
};
