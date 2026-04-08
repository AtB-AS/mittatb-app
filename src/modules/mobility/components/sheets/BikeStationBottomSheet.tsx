import {BikeStationFragment} from '@atb/api/types/generated/fragments/stations';
import {
  BottomSheetHeaderType,
  MapBottomSheet,
} from '@atb/components/bottom-sheet';
import {TransportationIconBox} from '@atb/components/icon-box';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {StyleSheet} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import {BicycleTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import React from 'react';
import {View} from 'react-native';
import {useBikeStation} from '../../use-bike-station';
import {useDoOnceOnItemReceived} from '../../use-do-once-on-item-received';
import {BikeStationIntegrationView} from '../BikeStationIntegrationView';
import {ShmoHelpParams} from '@atb/stacks-hierarchy';
import {BikeStationNotIntegratedView} from '../BicycleSheetNotIntegratedView';
import {useOperators} from '../../use-operators';
import {Loading} from '@atb/components/loading';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';

type Props = {
  stationId: string;
  distance: number | undefined;
  onClose: () => void;
  onStationReceived?: (station: BikeStationFragment) => void;
  locationArrowOnPress: () => void;
  navigateToScanQrCode: () => void;
  navigateSupportCallback: (params: ShmoHelpParams) => void;
  onVehicleTypeSelected: (vehicleId: string) => void;
};

export const BikeStationBottomSheet = ({
  stationId,
  onClose,
  onStationReceived,
  locationArrowOnPress,
  navigateToScanQrCode,
  navigateSupportCallback,
  onVehicleTypeSelected,
}: Props) => {
  const {t} = useTranslation();
  const styles = useSheetStyle();
  const {
    isLoading,
    isError,
    station,
    stationName,
    operatorName,
    brandLogoUrl,
    operatorId,
    rentalAppUri,
    appStoreUri,
    availableBikes,
  } = useBikeStation(stationId);
  const operator = useOperators().byId(operatorId);
  const operatorIsIntegrationEnabled = operator?.isDeepIntegrationEnabled;
  const {isShmoDeepIntegrationCitybikeEnabled} = useFeatureTogglesContext();

  useDoOnceOnItemReceived(onStationReceived, station);

  return (
    <MapBottomSheet
      canMinimize={true}
      enablePanDownToClose={false}
      closeCallback={onClose}
      closeOnBackdropPress={false}
      allowBackgroundTouch={true}
      enableDynamicSizing={true}
      heading={stationName}
      subText={operatorName}
      bottomSheetHeaderType={BottomSheetHeaderType.Close}
      logoIcon={
        <TransportationIconBox
          mode="bicycle"
          isFlexible={false}
          size="normal"
          type="compact"
        />
      }
      locationArrowOnPress={locationArrowOnPress}
      navigateToScanQrCode={navigateToScanQrCode}
    >
      {isLoading && (
        <View style={styles.loading}>
          <Loading size="large" />
        </View>
      )}
      {!isLoading && (isError || !station) && (
        <View style={styles.footer}>
          <MessageInfoBox
            type="error"
            message={t(BicycleTexts.stations.loadingFailed)}
          />
        </View>
      )}

      {!isLoading &&
        !isError &&
        station &&
        (operatorIsIntegrationEnabled &&
        isShmoDeepIntegrationCitybikeEnabled ? (
          <BikeStationIntegrationView
            station={station}
            navigateSupportCallback={navigateSupportCallback}
            onPressVehicleType={onVehicleTypeSelected}
          />
        ) : (
          <BikeStationNotIntegratedView
            numDocksAvailable={station.numDocksAvailable}
            onStationReceived={onStationReceived}
            rentalAppUri={rentalAppUri ?? undefined}
            appStoreUri={appStoreUri ?? undefined}
            operatorId={operatorId}
            operatorName={operatorName}
            brandLogoUrl={brandLogoUrl ?? undefined}
            stationName={stationName}
            availableBikes={availableBikes}
          />
        ))}
    </MapBottomSheet>
  );
};

const useSheetStyle = StyleSheet.createThemeHook((theme) => {
  return {
    loading: {
      marginBottom: theme.spacing.medium,
    },
    container: {
      marginHorizontal: theme.spacing.medium,
      marginBottom: theme.spacing.medium,
    },
    stationName: {
      flex: 1,
      alignItems: 'center',
    },
    stationText: {
      display: 'flex',
      flexDirection: 'row',
      marginTop: theme.spacing.small,
    },
    footer: {
      marginBottom: theme.spacing.medium,
      marginHorizontal: theme.spacing.medium,
    },
    mobilityStatContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    operatorNameAndLogo: {
      flexDirection: 'row',
    },
  };
});
