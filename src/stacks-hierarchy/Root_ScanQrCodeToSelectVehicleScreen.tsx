import {StyleSheet} from '@atb/theme';
import {MapTexts, useTranslation} from '@atb/translations';
import React, {useCallback, useEffect, useState} from 'react';
import {Camera} from '@atb/components/camera';

import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {ScreenContainer} from './Root_ParkingViolationsReporting/components/ScreenContainer';
import {ParkingViolationTexts} from '@atb/translations/screens/ParkingViolations';
import {useGetIdsFromQrCodeMutation} from '@atb/mobility/queries/use-get-ids-from-qr-code-mutation';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';
import {ScooterSheet} from '@atb/mobility';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {
  VehicleExtendedFragment,
  VehicleId,
} from '@atb/api/types/generated/fragments/vehicles';
import {flyToLocation} from '@atb/components/map';
import {Alert, InteractionManager} from 'react-native';

import {
  SLIGHTLY_RAISED_MAP_PADDING,
  SCOOTERS_CLUSTER_RADIUS,
} from '@atb/utils/map-spec';
import {useGeolocationState} from '@atb/GeolocationContext';

export type Props =
  RootStackScreenProps<'Root_ScanQrCodeToSelectVehicleScreen'>;

export const Root_ScanQrCodeToSelectVehicleScreen: React.FC<Props> = ({
  navigation,
  route: {
    params: {mapCameraRef},
  },
}) => {
  const styles = useStyles();
  const {t} = useTranslation();

  const {currentCoordinatesRef} = useGeolocationState();

  const {
    mutateAsync: getIdsFromQrCode,
    isLoading: getIdsFromQrCodeIsLoading,
    isError: getIdsFromQrCodeIsError,
  } = useGetIdsFromQrCodeMutation();

  const isFocused = useIsFocusedAndActive();
  const [hasCapturedQr, setHasCapturedQr] = useState(false);

  const {open: openBottomSheet, close: closeBottomSheet} = useBottomSheet();

  const flyToVehicle = useCallback(
    (vehicle: VehicleExtendedFragment) => {
      flyToLocation({
        coordinates: {
          latitude: vehicle.lat,
          longitude: vehicle.lon,
        },
        padding: SLIGHTLY_RAISED_MAP_PADDING,
        mapCameraRef,
        zoomLevel: SCOOTERS_CLUSTER_RADIUS + 0.01, // ensure no clustering
      });
    },
    [mapCameraRef],
  );

  const onQrCodeScanned = useCallback(
    async (qr: string) => {
      setHasCapturedQr(true);

      const idsFromQrCode = await getIdsFromQrCode({
        qrCodeUrl: qr,
        latitude: currentCoordinatesRef?.current?.latitude || 0,
        longitude: currentCoordinatesRef?.current?.longitude || 0,
      });
      navigation.goBack();
      if (idsFromQrCode.vehicleId) {
        const vehicleId: VehicleId = idsFromQrCode.vehicleId || '';

        InteractionManager.runAfterInteractions(() => {
          openBottomSheet(() => {
            return (
              <ScooterSheet
                vehicleId={vehicleId}
                onClose={() => closeBottomSheet()}
                onReportParkingViolation={() => {}}
                onVehicleReceived={flyToVehicle}
              />
            );
          }, false);
        });
      }
    },
    [
      closeBottomSheet,
      currentCoordinatesRef,
      flyToVehicle,
      getIdsFromQrCode,
      navigation,
      openBottomSheet,
    ],
  );

  useEffect(() => {
    if (isFocused) {
      setHasCapturedQr(false);
    }
  }, [isFocused]);

  useEffect(() => {
    if (getIdsFromQrCodeIsError) {
      Alert.alert(
        t(MapTexts.qr.notFound.title),
        t(MapTexts.qr.notFound.description),
        [
          {
            text: t(MapTexts.qr.notFound.ok),
            style: 'default',
            onPress: async () => navigation.goBack(),
          },
        ],
      );
    }
  }, [getIdsFromQrCodeIsError, navigation, t]);

  return (
    <ScreenContainer
      title={t(ParkingViolationTexts.qr.title)}
      secondaryText={t(ParkingViolationTexts.qr.instructions)}
      leftHeaderButton={
        getIdsFromQrCodeIsLoading ? undefined : {type: 'back', withIcon: true}
      }
      isLoading={getIdsFromQrCodeIsLoading}
    >
      {isFocused &&
        !getIdsFromQrCodeIsLoading &&
        !getIdsFromQrCodeIsError &&
        !hasCapturedQr && (
          <Camera mode="qr" style={styles.camera} onCapture={onQrCodeScanned} />
        )}
    </ScreenContainer>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {flex: 1},
  camera: {
    flexGrow: 1,
  },
  error: {
    margin: theme.spacings.medium,
  },
}));
