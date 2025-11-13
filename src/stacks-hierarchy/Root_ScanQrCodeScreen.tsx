import {StyleSheet} from '@atb/theme';
import {MapTexts, useTranslation} from '@atb/translations';
import React, {useCallback, useEffect, useState} from 'react';
import {Camera} from '@atb/components/camera';

import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {ScreenContainer} from '../components/PhotoCapture/ScreenContainer';
import {ParkingViolationTexts} from '@atb/translations/screens/ParkingViolations';
import {useGetAssetFromQrCodeMutation} from '@atb/modules/mobility';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';
import {Alert} from 'react-native';

import {
  MapStateActionType,
  useMapContext,
  useMapSelectionAnalytics,
} from '@atb/modules/map';
import {AssetFromQrCodeResponse} from '@atb/api/types/mobility';
import {getCurrentCoordinatesGlobal} from '@atb/modules/geolocation';
import {tGlobal} from '@atb/modules/locale';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';

export type Props = RootStackScreenProps<'Root_ScanQrCodeScreen'>;

export const Root_ScanQrCodeScreen: React.FC<Props> = ({navigation}) => {
  const styles = useStyles();
  const {t} = useTranslation();

  const isFocused = useIsFocusedAndActive();
  const {dispatchMapState} = useMapContext();
  const [hasCapturedQr, setHasCapturedQr] = useState(false);
  const analytics = useMapSelectionAnalytics();

  const {
    mutateAsync: getAssetFromQrCode,
    isPending: getAssetFromQrCodeIsLoading,
    isError: getAssetFromQrCodeIsError,
  } = useGetAssetFromQrCodeMutation();

  const clearStateAndAlertResultError = useCallback(() => {
    dispatchMapState({
      type: MapStateActionType.None,
    });
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
  }, [dispatchMapState, navigation.goBack]);

  const assetFromQrCodeReceivedHandler = useCallback(
    (assetFromQrCode: AssetFromQrCodeResponse) => {
      let type: MapStateActionType | undefined = undefined;
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
            type = MapStateActionType.ScooterScanned;
          } else if (
            [FormFactor.Bicycle, FormFactor.CargoBicycle].includes(
              assetFromQrCode.formFactor,
            )
          ) {
            type = MapStateActionType.BicycleScanned;
          }
        } else if (assetFromQrCode.stationId) {
          id = assetFromQrCode.stationId;
          if (
            [FormFactor.Bicycle, FormFactor.CargoBicycle].includes(
              assetFromQrCode.formFactor,
            )
          ) {
            type = MapStateActionType.BikeStationScanned;
          } else if ([FormFactor.Car].includes(assetFromQrCode.formFactor)) {
            type = MapStateActionType.CarStationScanned;
          }
        }
      }

      if (!!type && !!id) {
        dispatchMapState({
          type: type,
          assetId: id,
        });
        analytics.logEvent('Map', 'Scooter selected', {
          id,
        });
      } else {
        clearStateAndAlertResultError();
        return;
      }

      navigation.goBack();
    },
    [analytics, clearStateAndAlertResultError, dispatchMapState, navigation],
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
      overrideThemeName="dark"
      title={t(ParkingViolationTexts.qr.title)}
      rightHeaderButton={
        getAssetFromQrCodeIsLoading ? undefined : {type: 'close'}
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
