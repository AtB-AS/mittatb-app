import {BikeStationFragment} from '@atb/api/types/generated/fragments/stations';
import {
  BottomSheetHeaderType,
  MapBottomSheet,
} from '@atb/components/bottom-sheet';
import {TransportationIconBox} from '@atb/components/icon-box';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {StyleSheet} from '@atb/theme';
import {dictionary, useTranslation} from '@atb/translations';
import {BicycleTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import React, {useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {useBikeStation} from '../../use-bike-station';
import {useDoOnceOnItemReceived} from '../../use-do-once-on-item-received';
import {BikeStationIntegration} from '../BikeStationIntegration';
import {ShmoHelpParams} from '@atb/stacks-hierarchy';
import {getVehicles} from '@atb/api/mobility';

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
  const {isLoading, isError, station, stationName, operatorName} =
    useBikeStation(stationId);
  const [loadingSelectedVehicle, setLoadingSelectedVehicle] = useState(false);
  const [selectedVehicleError, setSelectedVehicleError] = useState(false);

  useDoOnceOnItemReceived(onStationReceived, station);

  const onPressVehicleType = async (propulsionType: string) => {
    setLoadingSelectedVehicle(true);
    setSelectedVehicleError(false);
    try {
      const vehicles = await getVehicles({
        stationId: station?.id,
        propulsionType,
        sort: '-currentRangeMeters',
        maxCount: 1,
      });

      if (vehicles.length === 0) {
        console.warn('No vehicles available for this type');
        setSelectedVehicleError(true);
        return;
      }

      const vehicleId = vehicles[0].id;
      onVehicleTypeSelected(vehicleId);
    } catch (error) {
      console.warn('Failed to fetch vehicles for selected type', error);
      setSelectedVehicleError(true);
    } finally {
      setLoadingSelectedVehicle(false);
    }
  };

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
      {(isLoading || loadingSelectedVehicle) && (
        <View style={styles.activityIndicator}>
          <ActivityIndicator size="large" />
        </View>
      )}
      {!isLoading && !loadingSelectedVehicle && (isError || !station) && (
        <View style={styles.footer}>
          <MessageInfoBox
            type="error"
            message={t(BicycleTexts.stations.loadingFailed)}
          />
        </View>
      )}
      {!isLoading && !loadingSelectedVehicle && selectedVehicleError && (
        <View style={styles.footer}>
          <MessageInfoBox
            type="error"
            message={t(dictionary.genericErrorMsg)}
          />
        </View>
      )}
      {!isLoading && !loadingSelectedVehicle && !isError && station && (
        <BikeStationIntegration
          station={station}
          navigateSupportCallback={navigateSupportCallback}
          onPressVehicleType={onPressVehicleType}
        />
      )}
    </MapBottomSheet>
  );
};

const useSheetStyle = StyleSheet.createThemeHook((theme) => {
  return {
    activityIndicator: {
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
