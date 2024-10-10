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

import {AutoSelectableBottomSheetType, useMapState} from '@atb/MapContext';
import {IdsFromQrCodeResponse} from '@atb/api/types/mobility';
import {getCurrentCoordinatesGlobal} from '@atb/GeolocationContext';
import {tGlobal} from '@atb/LocaleProvider';

export type Props = RootStackScreenProps<'Root_ScanQrCodeScreen'>;

export const Root_ScanQrCodeScreen: React.FC<Props> = ({navigation}) => {
  const styles = useStyles();
  const {t} = useTranslation();

  const isFocused = useIsFocusedAndActive();
  const {setBottomSheetToAutoSelect, setBottomSheetCurrentlyAutoSelected} =
    useMapState();
  const [hasCapturedQr, setHasCapturedQr] = useState(false);

  const {
    mutateAsync: getIdsFromQrCode,
    isLoading: getIdsFromQrCodeIsLoading,
    isError: getIdsFromQrCodeIsError,
  } = useGetIdsFromQrCodeMutation();

  const alertResultError = useCallback(() => {
    Alert.alert(
      tGlobal(MapTexts.qr.notFound.title),
      tGlobal(MapTexts.qr.notFound.description),
      [
        {
          text: tGlobal(MapTexts.qr.notFound.ok),
          style: 'default',
          onPress: navigation.goBack,
        },
      ],
    );
  }, [navigation]);

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
        setBottomSheetToAutoSelect(undefined);
        setBottomSheetCurrentlyAutoSelected(undefined);
        alertResultError();
        return;
      }

      navigation.goBack();
    },
    [
      alertResultError,
      navigation,
      setBottomSheetCurrentlyAutoSelected,
      setBottomSheetToAutoSelect,
    ],
  );

  const onQrCodeScanned = useCallback(
    async (qr: string) => {
      setHasCapturedQr(true);

      const coordinates = getCurrentCoordinatesGlobal();

      const idsFromQrCode = await getIdsFromQrCode({
        qrCodeUrl: qr,
        latitude: coordinates?.latitude ?? 0,
        longitude: coordinates?.longitude ?? 0,
      });
      idsFromQrCodeReceivedHandler(idsFromQrCode);
    },
    [getIdsFromQrCode, idsFromQrCodeReceivedHandler],
  );

  useEffect(() => {
    isFocused && setHasCapturedQr(false);
  }, [isFocused]);

  useEffect(() => {
    getIdsFromQrCodeIsError && alertResultError();
  }, [alertResultError, getIdsFromQrCodeIsError]);

  return (
    <ScreenContainer
      title={t(ParkingViolationTexts.qr.title)}
      leftHeaderButton={
        getIdsFromQrCodeIsLoading ? undefined : {type: 'close', withIcon: true}
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
