import React from 'react';
import {useControlPositionsStyle} from '../hooks/use-control-styles';
import {MapBottomSheetType, useMapContext} from '../MapContext';
import {ExternalRealtimeMapButton} from './external-realtime-map/ExternalRealtimeMapButton';
import {
  isBicycleV2,
  isScooterV2,
  MapFilter,
  useActiveShmoBookingQuery,
  useInitShmoBookingMutationStatus,
} from '@atb/modules/mobility';
import {PositionArrow} from './PositionArrow';
import {ScanButton} from './ScanButton';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {View} from 'react-native';
//import {useThemeContext} from '@atb/theme';

/** LEGGE TIL OVER BOTTOMSHEETEN OGSÅ, FJERN FORSØK PÅ ANIMASJON */

export const MapButtons = ({
  positionArrowCallback,
}: {
  positionArrowCallback: () => void;
}) => {
  const controlStyles = useControlPositionsStyle(false);
  const {mapState} = useMapContext();
  const mapFilterIsOpen =
    mapState.bottomSheetType === MapBottomSheetType.Filter;
  const sheetSelected = mapState.bottomSheetType !== MapBottomSheetType.None;
  const selectedFeature = mapState.feature;
  const selectedFeatureIsAVehicle =
    isScooterV2(selectedFeature) || isBicycleV2(selectedFeature);

  const {data: activeShmoBooking, isLoading: activeShmoBookingIsLoading} =
    useActiveShmoBookingQuery();
  const {isShmoDeepIntegrationEnabled, isMapV2Enabled} =
    useFeatureTogglesContext();

  const {isMutating: initShmoOneStopBookingIsMutating} =
    useInitShmoBookingMutationStatus();

  const showScanButton =
    isShmoDeepIntegrationEnabled &&
    isMapV2Enabled &&
    !activeShmoBooking &&
    !activeShmoBookingIsLoading &&
    (!selectedFeature || selectedFeatureIsAVehicle) &&
    !initShmoOneStopBookingIsMutating &&
    !mapFilterIsOpen;

  const showMapFilterButton =
    !sheetSelected && !activeShmoBooking && !activeShmoBookingIsLoading;

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

        {showMapFilterButton && <MapFilter isLoading={false} />}

        <PositionArrow onPress={positionArrowCallback} />
      </View>
      {showScanButton && <ScanButton />}
    </>
  );
};
