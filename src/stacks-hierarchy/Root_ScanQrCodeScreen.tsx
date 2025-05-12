import {StyleSheet} from '@atb/theme';
import {MapTexts, useTranslation} from '@atb/translations';
import React, {useCallback, useEffect, useState} from 'react';
import {Camera} from '@atb/components/camera';

import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {ScreenContainer} from '../components/PhotoCapture/ScreenContainer';
import {ParkingViolationTexts} from '@atb/translations/screens/ParkingViolations';
import {useGetAssetFromQrCodeMutation} from '@atb/mobility/queries/use-get-ids-from-qr-code-mutation';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';
import {Alert} from 'react-native';

import {AutoSelectableBottomSheetType, useMapContext} from '@atb/MapContext';
import {AssetFromQrCodeResponse} from '@atb/api/types/mobility';
import {getCurrentCoordinatesGlobal} from '@atb/modules/geolocation';
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
    mutateAsync: getAssetFromQrCode,
    isLoading: getAssetFromQrCodeIsLoading,
    isError: getAssetFromQrCodeIsError,
  } = useGetAssetFromQrCodeMutation();

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

  const assetFromQrCodeReceivedHandler = useCallback(
    (assetFromQrCode: AssetFromQrCodeResponse) => {
      let type: AutoSelectableBottomSheetType | undefined = undefined;
      let id: string | undefined = undefined;
      if (assetFromQrCode.formFactor) {
        if (assetFromQrCode.id) {
          id = assetFromQrCode.id;
          if (
            [
              FormFactor.Scooter,
              FormFactor.ScooterSeated,
              FormFactor.ScooterStanding,
            ].includes(assetFromQrCode.formFactor)
          ) {
            type = AutoSelectableBottomSheetType.Scooter;
          } else if (
            [FormFactor.Bicycle, FormFactor.CargoBicycle].includes(
              assetFromQrCode.formFactor,
            )
          ) {
            type = AutoSelectableBottomSheetType.Bicycle;
          }
        } else if (assetFromQrCode.stationId) {
          id = assetFromQrCode.stationId;
          if (
            [FormFactor.Bicycle, FormFactor.CargoBicycle].includes(
              assetFromQrCode.formFactor,
            )
          ) {
            type = AutoSelectableBottomSheetType.BikeStation;
          } else if ([FormFactor.Car].includes(assetFromQrCode.formFactor)) {
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

      const assetFromQrCode = await getAssetFromQrCode({
        qrCodeUrl: qr,
        latitude: coordinates?.latitude ?? 0,
        longitude: coordinates?.longitude ?? 0,
      });
      assetFromQrCodeReceivedHandler(assetFromQrCode);
    },
    [getAssetFromQrCode, assetFromQrCodeReceivedHandler],
  );

  useEffect(() => {
    isFocused && setHasCapturedQr(false);
  }, [isFocused]);

  useEffect(() => {
    getAssetFromQrCodeIsError && clearStateAndAlertResultError();
  }, [clearStateAndAlertResultError, getAssetFromQrCodeIsError]);

  return (
    <ScreenContainer
      title={t(ParkingViolationTexts.qr.title)}
      leftHeaderButton={
        getAssetFromQrCodeIsLoading
          ? undefined
          : {type: 'close', withIcon: true}
      }
      isLoading={getAssetFromQrCodeIsLoading}
    >
      {isFocused &&
        !getAssetFromQrCodeIsLoading &&
        !getAssetFromQrCodeIsError &&
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
