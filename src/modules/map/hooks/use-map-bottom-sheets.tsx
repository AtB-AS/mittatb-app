import {useAnalyticsContext} from '@atb/modules/analytics';
import {
  ScooterSheet,
  SelectShmoPaymentMethodSheet,
} from '@atb/modules/mobility';

import {RootNavigationProps} from '@atb/stacks-hierarchy';
import {useNavigation} from '@react-navigation/native';
import React, {RefObject, useCallback, useState} from 'react';
import {useEnterPaymentMethods} from './use-enter-payment-methods';
import {AutoSelectableBottomSheetType, useMapContext} from '../MapContext';
import {AutoSelectableMapItem} from './use-auto-select-map-item';
import {InteractionManager} from 'react-native';
import {flyToLocation, getMapPadding} from '../utils';
import MapboxGL from '@rnmapbox/maps';

type MapBottomSheetsProps = {
  unSelectMapItem: () => void;
  mapCameraRef: RefObject<MapboxGL.Camera | null>;
  mapViewRef: RefObject<MapboxGL.MapView | null>;
  tabBarHeight?: number;
};

export const MapBottomSheets = ({
  unSelectMapItem,
  mapCameraRef,
  mapViewRef,
  tabBarHeight,
}: MapBottomSheetsProps) => {
  const [openPaymentType, setOpenPaymentType] = useState<boolean>(false);
  const navigateToPaymentMethods = useEnterPaymentMethods();
  const {mapSelectionState, mapSelectionDispatch, setAutoSelectedMapItem} =
    useMapContext();

  const analytics = useAnalyticsContext();
  const navigation = useNavigation<RootNavigationProps>();

  const onReportParkingViolation = useCallback(() => {
    analytics.logEvent('Mobility', 'Report parking violation clicked');
    navigation.navigate('Root_ParkingViolationsSelectScreen');
  }, [analytics, navigation]);

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
            padding: getMapPadding(tabBarHeight),
            mapCameraRef,
            mapViewRef,
            zoomLevel: 19, // no clustering at this zoom level
          });
      });
    },
    [mapCameraRef, mapViewRef, setAutoSelectedMapItem, tabBarHeight],
  );

  console.log('yo');

  async function selectPaymentMethod() {
    setOpenPaymentType(true);
  }

  const handleCloseScooterSheet = useCallback(() => {
    mapSelectionDispatch({mapState: 'NONE'});
    unSelectMapItem();
  }, [mapSelectionDispatch, unSelectMapItem]);

  return (
    <>
      {mapSelectionState.mapState === AutoSelectableBottomSheetType.Scooter &&
        !openPaymentType && (
          <ScooterSheet
            onVehicleReceived={flyToMapItemLocation}
            selectPaymentMethod={selectPaymentMethod}
            vehicleId={(mapSelectionState.assetId as string) ?? ''}
            onClose={handleCloseScooterSheet}
            onReportParkingViolation={onReportParkingViolation}
            navigation={navigation}
            startOnboardingCallback={() => {
              navigation.navigate('Root_ShmoOnboardingScreen');
            }}
          />
        )}

      {openPaymentType && (
        <SelectShmoPaymentMethodSheet
          onSelect={() => {
            setOpenPaymentType(false);
          }}
          onClose={() => {
            setOpenPaymentType(false);
          }}
          onGoToPaymentPage={() => {
            setOpenPaymentType(false);
            navigateToPaymentMethods();
          }}
        />
      )}
    </>
  );
};
