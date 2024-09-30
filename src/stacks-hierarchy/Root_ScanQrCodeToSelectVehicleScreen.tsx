import {StyleSheet} from '@atb/theme';
import {MapTexts, useTranslation} from '@atb/translations';
import React, {useCallback, useEffect, useState} from 'react';
import {Camera} from '@atb/components/camera';

import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {ScreenContainer} from './Root_ParkingViolationsReporting/components/ScreenContainer';
import {ParkingViolationTexts} from '@atb/translations/screens/ParkingViolations';
import {useGetIdsFromQrCodeMutation} from '@atb/mobility/queries/use-get-ids-from-qr-code-mutation';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';
import {Alert} from 'react-native';

import {useGeolocationState} from '@atb/GeolocationContext';
import {AutoSelectableBottomSheetType, useMapState} from '@atb/MapContext';
import {IdsFromQrCodeResponse} from '@atb/api/types/mobility';

export type Props =
  RootStackScreenProps<'Root_ScanQrCodeToSelectVehicleScreen'>;

export const Root_ScanQrCodeToSelectVehicleScreen: React.FC<Props> = ({
  navigation,
}) => {
  const styles = useStyles();
  const {t} = useTranslation();

  const isFocused = useIsFocusedAndActive();
  const {currentCoordinatesRef} = useGeolocationState();
  const {setBottomSheetToAutoSelect} = useMapState();
  const [hasCapturedQr, setHasCapturedQr] = useState(false);

  const {
    mutateAsync: getIdsFromQrCode,
    isLoading: getIdsFromQrCodeIsLoading,
    isError: getIdsFromQrCodeIsError,
  } = useGetIdsFromQrCodeMutation();

  const alertResultError = useCallback(() => {
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
  }, [navigation, t]);

  const idsFromQrCodeReceivedHandler = useCallback(
    (idsFromQrCode: IdsFromQrCodeResponse) => {
      // NB come back and fix this once the Shmo QR endpoint is updated!
      // the AutoSelectableBottomSheetType should then be decided based on FormFactor(s)
      const isBysykkelOperator = idsFromQrCode.operatorId.includes('bysykkel');

      if (idsFromQrCode.vehicleId) {
        setBottomSheetToAutoSelect({
          type: isBysykkelOperator
            ? AutoSelectableBottomSheetType.Bicycle
            : AutoSelectableBottomSheetType.Scooter,
          id: idsFromQrCode.vehicleId,
        });
      } else if (idsFromQrCode.stationId) {
        setBottomSheetToAutoSelect({
          type: isBysykkelOperator
            ? AutoSelectableBottomSheetType.BikeStation
            : AutoSelectableBottomSheetType.CarStation,
          id: idsFromQrCode.stationId,
        });
      } else {
        alertResultError();
        return;
      }

      navigation.goBack();
    },
    [alertResultError, navigation, setBottomSheetToAutoSelect],
  );

  const onQrCodeScanned = useCallback(
    async (qr: string) => {
      setHasCapturedQr(true);

      const idsFromQrCode = await getIdsFromQrCode({
        qrCodeUrl: qr,
        latitude: currentCoordinatesRef?.current?.latitude ?? 0,
        longitude: currentCoordinatesRef?.current?.longitude ?? 0,
      });
      idsFromQrCodeReceivedHandler(idsFromQrCode);
    },
    [getIdsFromQrCode, currentCoordinatesRef, idsFromQrCodeReceivedHandler],
  );

  useEffect(() => {
    if (isFocused) {
      setHasCapturedQr(false);

      // useful for testing:
      // setTimeout(() => {
      //   alertResultError();
      //   idsFromQrCodeReceivedHandler({
      //     operatorId: 'YRY:Operator:Ryde',
      //     vehicleId: 'YRY:Vehicle:ea157103-05bb-3afd-ba77-0bfd643cdc93',
      //   });
      // }, 800);
    }
  }, [isFocused]); // , idsFromQrCodeReceivedHandler, navigation

  useEffect(() => {
    getIdsFromQrCodeIsError && alertResultError();
  }, [alertResultError, getIdsFromQrCodeIsError]);

  return (
    <ScreenContainer
      title={t(ParkingViolationTexts.qr.title)}
      //secondaryText={t(ParkingViolationTexts.qr.instructions)}
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
