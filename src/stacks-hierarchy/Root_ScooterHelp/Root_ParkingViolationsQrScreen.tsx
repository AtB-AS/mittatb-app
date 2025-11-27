import {Button} from '@atb/components/button';
import {Camera, CameraScreenContainer} from '@atb/components/camera';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import {ParkingViolationTexts} from '@atb/translations/screens/ParkingViolations';
import {getThemeColor} from '../../components/PhotoCapture/ScreenContainer';
import {useEffect, useMemo, useRef, useState} from 'react';
import {SelectProviderBottomSheet} from './bottom-sheets/SelectProviderBottomSheet';
import {VehicleLookupConfirmationBottomSheet} from './bottom-sheets/VehicleLookupBottomSheet';
import {lookupVehicleByQr, sendViolationsReport} from '@atb/api/bff/mobility';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {
  blobToBase64,
  useParkingViolations,
} from '@atb/modules/parking-violations-reporting';
import {useAuthContext} from '@atb/modules/auth';
import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';
import {compressImage} from '@atb/utils/image';
import {View} from 'react-native';
import {BottomSheetModal as GorhamBottomSheetModal} from '@gorhom/bottom-sheet';
import {ViolationsReportingProvider} from '@atb/api/types/mobility';

export type QrScreenProps =
  RootStackScreenProps<'Root_ParkingViolationsQrScreen'>;

export const Root_ParkingViolationsQrScreen = ({
  navigation,
  route: {params},
}: QrScreenProps) => {
  const {t} = useTranslation();
  const style = useStyles();
  const {theme} = useThemeContext();
  const themeColor = getThemeColor(theme);
  const isFocused = useIsFocusedAndActive();
  const [capturedQr, setCapturedQr] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const {providers, coordinates} = useParkingViolations();
  const {userId} = useAuthContext();
  const onCloseFocusRef = useRef<View | null>(null);
  const providerAndVehicleBottomSheetModalRef =
    useRef<GorhamBottomSheetModal | null>(null);
  const selectProviderBottomSheetModalRef =
    useRef<GorhamBottomSheetModal | null>(null);
  const [providerAndVehicleId, setProviderAndVehicleId] = useState<{
    provider: ViolationsReportingProvider;
    vehicle_id: string | undefined;
  } | null>(null);
  const [qrScanFailed, setQrScanFailed] = useState(false);

  const providersList = useMemo(
    () => [
      ...providers,
      {name: t(ParkingViolationTexts.selectProvider.unknownProvider)},
    ],
    [providers, t],
  );

  useEffect(() => {
    if (isFocused) {
      setCapturedQr(undefined);
    }
  }, [isFocused]);

  useEffect(() => {
    if (providerAndVehicleId) {
      providerAndVehicleBottomSheetModalRef?.current?.present();
    }
  }, [providerAndVehicleId]);

  const handleFinishSubmitReport = () => {
    enableScanning();
    selectProviderBottomSheetModalRef?.current?.dismiss();
    providerAndVehicleBottomSheetModalRef?.current?.dismiss();
  };

  const submitReport = async (providerId?: number) => {
    setIsLoading(true);
    selectProviderBottomSheetModalRef?.current?.dismiss();
    providerAndVehicleBottomSheetModalRef?.current?.dismiss();

    const compressedBlob = await compressImage(params.photo, 2048, 2048);
    if (!compressedBlob) {
      setIsError(true);
      return;
    }

    const base64Image = await blobToBase64(compressedBlob);

    // Remove metadata, e.g. 'data:image/png;base64', and keep just the base64
    // encoded part of the image.
    const base64data = base64Image.split(',').pop();

    // Nivel uses the file name suffix as imageType.
    const imageType = params.photo.split('.').pop();

    sendViolationsReport({
      appId: userId,
      image: base64data,
      imageType,
      latitude: coordinates?.latitude ?? 0,
      longitude: coordinates?.longitude ?? 0,
      providerId,
      qr: capturedQr,
      violations: params.selectedViolations.map((v) => v.code),
      timestamp: new Date().toISOString(),
    })
      .then(() => {
        navigation.navigate('Root_ParkingViolationsConfirmationScreen', {
          providerName: providers.find((p) => p.id === providerId)?.name,
        });
        handleFinishSubmitReport();
      })
      .catch((e) => {
        console.error(e);
        setIsError(true);
        handleFinishSubmitReport();
      });
  };

  const getProviderByQr = async (qr: string) =>
    lookupVehicleByQr({qr})
      .then(({provider_id, vehicle_id}) => {
        const provider = providers.find((p) => p.id === provider_id);
        if (!provider) return undefined;
        return {provider, vehicle_id};
      })
      .catch(() => undefined); // If lookup fails let user select operator manually.

  const handlePhotoCapture = async (qr: string) => {
    if (!capturedQr) {
      disableScanning(qr);
      const providerAndVehicleId = await getProviderByQr(qr);
      if (providerAndVehicleId) {
        setProviderAndVehicleId(providerAndVehicleId);
      } else {
        setQrScanFailed(true);
        selectProvider();
      }
    }
  };

  const selectProvider = () => {
    selectProviderBottomSheetModalRef?.current?.present();
  };

  const disableScanning = (qr: string) => {
    setCapturedQr(qr);
    setIsLoading(true);
  };

  const enableScanning = () => {
    setIsLoading(false);
    setCapturedQr(undefined);
  };

  return (
    <>
      <CameraScreenContainer
        title={t(ParkingViolationTexts.qr.title)}
        secondaryText={t(ParkingViolationTexts.qr.instructions)}
        isLoading={isLoading}
      >
        {isError && (
          <MessageInfoBox
            style={style.error}
            title={t(ParkingViolationTexts.issue.sendReport.title)}
            message={t(ParkingViolationTexts.issue.sendReport.message)}
            type="error"
          />
        )}
        {isFocused && !isLoading && !isError && !capturedQr && (
          <Camera
            mode="qr"
            onCapture={handlePhotoCapture}
            bottomButtonNode={
              <Button
                expanded={false}
                disabled={isError}
                mode="secondary"
                backgroundColor={themeColor}
                onPress={() => selectProvider()}
                text={t(ParkingViolationTexts.qr.scanningNotPossible)}
                ref={onCloseFocusRef}
                interactiveColor={theme.color.interactive[2]}
              />
            }
          />
        )}
      </CameraScreenContainer>
      {providerAndVehicleId && (
        <VehicleLookupConfirmationBottomSheet
          vehicleId={providerAndVehicleId.vehicle_id}
          provider={providerAndVehicleId.provider}
          onReportSubmit={submitReport}
          onClose={enableScanning}
          onCloseFocusRef={onCloseFocusRef}
          bottomSheetModalRef={providerAndVehicleBottomSheetModalRef}
        />
      )}
      <SelectProviderBottomSheet
        providers={providersList}
        qrScanFailed={qrScanFailed}
        onSelect={(provider) => {
          submitReport(provider.id);
        }}
        onClose={enableScanning}
        onCloseFocusRef={onCloseFocusRef}
        bottomSheetModalRef={selectProviderBottomSheetModalRef}
      />
    </>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  error: {
    margin: theme.spacing.medium,
  },
}));
