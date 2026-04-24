import {MapTexts, useTranslation} from '@atb/translations';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Camera, CameraScreenContainer} from '@atb/components/camera';

import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {ParkingViolationTexts} from '@atb/translations/screens/ParkingViolations';
import {useGetAssetFromQrCodeMutation} from '@atb/modules/mobility';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';
import {Alert, Linking} from 'react-native';

import {
  MapStateActionType,
  useMapContext,
  useMapSelectionAnalytics,
} from '@atb/modules/map';
import {AssetFromQrCodeResponse} from '@atb/api/types/mobility';
import {getCurrentCoordinatesGlobal} from '@atb/modules/geolocation';
import {tGlobal} from '@atb/modules/locale';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {openInAppBrowser} from '@atb/modules/in-app-browser';
import {openUrl} from '@atb/utils/open-url';
import {APP_SCHEME} from '@env';
import {
  isAppDeepLink,
  matchKnownUrl,
  normalizeUrlForOpening,
} from './handle-scanned-qr';

export type Props = RootStackScreenProps<'Root_ScanQrCodeScreen'>;

export const Root_ScanQrCodeScreen: React.FC<Props> = ({navigation}) => {
  const {t} = useTranslation();
  const focusRef = useFocusOnLoad(navigation);
  const isFocused = useIsFocusedAndActive();
  const {dispatchMapState} = useMapContext();
  const [hasCapturedQr, setHasCapturedQr] = useState(false);
  const isProcessingQr = useRef(false);
  const analytics = useMapSelectionAnalytics();
  const {logEvent} = useAnalyticsContext();
  const {knownQrCodeUrls} = useFirestoreConfigurationContext();

  const {
    mutateAsync: getAssetFromQrCode,
    isPending: getAssetFromQrCodeIsLoading,
    isError: getAssetFromQrCodeIsError,
    error: getAssetFromQrCodeError,
  } = useGetAssetFromQrCodeMutation();

  const onGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const clearStateAndAlertResultError = useCallback(() => {
    dispatchMapState({
      type: MapStateActionType.None,
    });

    const isLocationRequired =
      getAssetFromQrCodeError?.kind === 'LOCATION_REQUIRED';

    Alert.alert(
      tGlobal(
        isLocationRequired
          ? MapTexts.qr.locationRequired.title
          : MapTexts.qr.notFound.title,
      ),
      tGlobal(
        isLocationRequired
          ? MapTexts.qr.locationRequired.description
          : MapTexts.qr.notFound.description,
      ),
      [
        {
          text: tGlobal(MapTexts.qr.notFound.ok),
          style: 'default',
          onPress: onGoBack,
        },
      ],
    );
  }, [dispatchMapState, onGoBack, getAssetFromQrCodeError]);

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

      onGoBack();
    },
    [analytics, clearStateAndAlertResultError, dispatchMapState, onGoBack],
  );

  const alertNotFound = useCallback(() => {
    Alert.alert(
      tGlobal(MapTexts.qr.notFound.title),
      tGlobal(MapTexts.qr.notFound.description),
      [
        {
          text: tGlobal(MapTexts.qr.notFound.ok),
          style: 'default',
          onPress: onGoBack,
        },
      ],
    );
  }, [onGoBack]);

  const onQrCodeScanned = useCallback(
    async (qr: string) => {
      if (isProcessingQr.current) return;
      isProcessingQr.current = true;
      setHasCapturedQr(true);

      logEvent('Map', 'QR scanned', {url: qr.slice(0, 512)});

      if (isAppDeepLink(qr, APP_SCHEME)) {
        try {
          await Linking.openURL(qr);
        } catch {
          alertNotFound();
        }
        return;
      }

      const match = matchKnownUrl(qr, knownQrCodeUrls);
      if (match) {
        const urlToOpen = normalizeUrlForOpening(qr);
        if (match.openMode === 'in-app-browser') {
          await openInAppBrowser(urlToOpen, 'close');
        } else {
          await openUrl(urlToOpen);
        }
        onGoBack();
        return;
      }

      const coordinates = getCurrentCoordinatesGlobal();
      const locationParams = coordinates
        ? {latitude: coordinates.latitude, longitude: coordinates.longitude}
        : {};

      const assetFromQrCode = await getAssetFromQrCode({
        qrCodeUrl: qr,
        ...locationParams,
      });
      assetFromQrCodeReceivedHandler(assetFromQrCode);
    },
    [
      logEvent,
      knownQrCodeUrls,
      onGoBack,
      alertNotFound,
      getAssetFromQrCode,
      assetFromQrCodeReceivedHandler,
    ],
  );

  useEffect(() => {
    if (isFocused) {
      setHasCapturedQr(false);
      isProcessingQr.current = false;
    }
  }, [isFocused]);

  useEffect(() => {
    getAssetFromQrCodeIsError && clearStateAndAlertResultError();
  }, [clearStateAndAlertResultError, getAssetFromQrCodeIsError]);

  return (
    <CameraScreenContainer
      title={t(ParkingViolationTexts.qr.title)}
      secondaryText={t(ParkingViolationTexts.qr.instructions)}
      isLoading={getAssetFromQrCodeIsLoading}
      onGoBack={onGoBack}
      focusRef={focusRef}
    >
      {isFocused &&
        !getAssetFromQrCodeIsLoading &&
        !getAssetFromQrCodeIsError &&
        !hasCapturedQr && <Camera mode="qr" onCapture={onQrCodeScanned} />}
    </CameraScreenContainer>
  );
};
