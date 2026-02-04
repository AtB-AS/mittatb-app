import React from 'react';
import {useControlPositionsStyle} from '../hooks/use-control-styles';
import {MapBottomSheetType, useMapContext} from '../MapContext';
import {ExternalRealtimeMapButton} from './external-realtime-map/ExternalRealtimeMapButton';
import {
  isVehicle,
  MapFilter,
  useActiveShmoBookingQuery,
  useInitShmoBookingMutationStatus,
} from '@atb/modules/mobility';
import {LocationArrow} from './LocationArrow';
import {ScanButton} from './ScanButton';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {View} from 'react-native';

export const MapButtons = ({
  navigateToScanQrCode,
  locationArrowOnPress,
}: {
  navigateToScanQrCode: () => void;
  locationArrowOnPress: () => void;
}) => {
  const controlStyles = useControlPositionsStyle(false);
  const {mapState} = useMapContext();
  const mapFilterIsOpen =
    mapState.bottomSheetType === MapBottomSheetType.Filter;
  const selectedFeature = mapState.feature;
  const selectedFeatureIsAVehicle = isVehicle(selectedFeature);

  const {data: activeShmoBooking, isLoading: activeShmoBookingIsLoading} =
    useActiveShmoBookingQuery();
  const {isShmoDeepIntegrationEnabled} = useFeatureTogglesContext();

  const {isMutating: initShmoOneStopBookingIsMutating} =
    useInitShmoBookingMutationStatus();

  const showScanButton =
    isShmoDeepIntegrationEnabled &&
    !activeShmoBooking &&
    !activeShmoBookingIsLoading &&
    (!selectedFeature || selectedFeatureIsAVehicle) &&
    !initShmoOneStopBookingIsMutating &&
    !mapFilterIsOpen;

  const showMapFilterButton =
    mapState.bottomSheetType === MapBottomSheetType.None;

  return (
    <>
      <View
        style={[
          controlStyles.mapButtonsContainer,
          controlStyles.mapButtonsContainerRight,
          mapFilterIsOpen && {bottom: 0},
        ]}
      >
        <ExternalRealtimeMapButton />

        {showMapFilterButton && <MapFilter />}

        <LocationArrow onPress={locationArrowOnPress} />
      </View>
      {showScanButton && (
        <ScanButton navigateToScanQrCode={navigateToScanQrCode} />
      )}
    </>
  );
};
