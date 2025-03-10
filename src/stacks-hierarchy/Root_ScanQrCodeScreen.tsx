import {StyleSheet} from '@atb/theme';
import {MapTexts, useTranslation} from '@atb/translations';
import React, {useCallback, useEffect, useState} from 'react';
import {Camera} from '@atb/components/camera';

import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {ScreenContainer} from './Root_ScooterHelp/components/ScreenContainer';
import {ParkingViolationTexts} from '@atb/translations/screens/ParkingViolations';
import {useGetIdsFromQrCodeMutation} from '@atb/mobility/queries/use-get-ids-from-qr-code-mutation';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';
import {Alert} from 'react-native';

import {AutoSelectableBottomSheetType, useMapContext} from '@atb/MapContext';
import {IdsFromQrCodeResponse} from '@atb/api/types/mobility';
import {getCurrentCoordinatesGlobal} from '@atb/GeolocationContext';
import {tGlobal} from '@atb/LocaleProvider';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';

export type Props = RootStackScreenProps<'Root_ScanQrCodeScreen'>;

export const Root_ScanQrCodeScreen: React.FC<Props> = ({navigation}) => {
  const styles = useStyles();
  const {t} = useTranslation();

  const isFocused = useIsFocusedAndActive();
  const {setBottomSheetToAutoSelect, setBottomSheetCurrentlyAutoSelected} =
    useMapContext();
  const [hasCapturedQr, setHasCapturedQr] = useState(false);

  const {
    mutateAsync: getIdsFromQrCode,
    isLoading: getIdsFromQrCodeIsLoading,
    isError: getIdsFromQrCodeIsError,
  } = useGetIdsFromQrCodeMutation();

  const clearStateAndAlertResultError = useCallback(() => {
    setBottomSheetToAutoSelect(undefined);
    setBottomSheetCurrentlyAutoSelected(undefined);
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
  }, [
    navigation.goBack,
    setBottomSheetCurrentlyAutoSelected,
    setBottomSheetToAutoSelect,
  ]);

  const idsFromQrCodeReceivedHandler = useCallback(
    (idsFromQrCode: IdsFromQrCodeResponse) => {
      let type: AutoSelectableBottomSheetType | undefined = undefined;
      let id: string | undefined = undefined;
      if (idsFromQrCode.formFactor) {
        if (idsFromQrCode.vehicleId) {
          id = idsFromQrCode.vehicleId;
          if (
            [
              FormFactor.Scooter,
              FormFactor.ScooterSeated,
              FormFactor.ScooterStanding,
            ].includes(idsFromQrCode.formFactor)
          ) {
            type = AutoSelectableBottomSheetType.Scooter;
          } else if (
            [FormFactor.Bicycle, FormFactor.CargoBicycle].includes(
              idsFromQrCode.formFactor,
            )
          ) {
            type = AutoSelectableBottomSheetType.Bicycle;
          }
        } else if (idsFromQrCode.stationId) {
          id = idsFromQrCode.stationId;
          if (
            [FormFactor.Bicycle, FormFactor.CargoBicycle].includes(
              idsFromQrCode.formFactor,
            )
          ) {
            type = AutoSelectableBottomSheetType.BikeStation;
          } else if ([FormFactor.Car].includes(idsFromQrCode.formFactor)) {
            type = AutoSelectableBottomSheetType.CarStation;
          }
        }
      }

      if (!!type && !!id) {
        setBottomSheetToAutoSelect({type, id});
      } else {
        clearStateAndAlertResultError();
        return;
      }

      navigation.goBack();
    },
    [clearStateAndAlertResultError, navigation, setBottomSheetToAutoSelect],
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
      //TODO: TEMPFIX
      console.log('idsFromQrCode', idsFromQrCode);

      idsFromQrCode.formFactor = FormFactor.Scooter;
      idsFromQrCode.vehicleId =
        'YRY:Vehicle:ea156985-05ff-3202-b2f8-62bb745c7b8b';

      idsFromQrCodeReceivedHandler(idsFromQrCode);
    },
    [getIdsFromQrCode, idsFromQrCodeReceivedHandler],
  );

  useEffect(() => {
    isFocused && setHasCapturedQr(false);
  }, [isFocused]);

  useEffect(() => {
    getIdsFromQrCodeIsError && clearStateAndAlertResultError();
  }, [clearStateAndAlertResultError, getIdsFromQrCodeIsError]);

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
    margin: theme.spacing.medium,
  },
}));
