import {useBottomSheet} from '@atb/components/bottom-sheet';
import {Button} from '@atb/components/button';
import {Camera} from '@atb/components/camera';
import {StyleSheet} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import {ParkingViolationTexts} from '@atb/translations/screens/ParkingViolations';
import {useEffect, useMemo, useState} from 'react';
import {ScreenContainer} from './components/ScreenContainer';
import {SelectProviderBottomSheet} from './bottom-sheets/SelectProviderBottomSheet';
import {VehicleLookupConfirmationBottomSheet} from './bottom-sheets/VehicleLookupBottomSheet';
import {lookupVehicleByQr, sendViolationsReport} from '@atb/api/mobility';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {
  blobToBase64,
  useParkingViolations,
} from '@atb/parking-violations-reporting';
import {useAuthState} from '@atb/auth';
import {Image} from 'react-native-compressor';
import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';

export type QrScreenProps = RootStackScreenProps<'Root_ParkingViolationsQrScreen'>;

export const Root_ParkingViolationsQr = ({
  navigation,
  route: {params},
}: QrScreenProps) => {
  const {t} = useTranslation();
  const style = useStyles();
  const isFocused = useIsFocusedAndActive();
  const [capturedQr, setCapturedQr] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const {open: openBottomSheet, close: closeBottomSheet} = useBottomSheet();
  const {providers, coordinates} = useParkingViolations();
  const {userId} = useAuthState();

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

  const submitReport = async (providerId?: number) => {
    setIsLoading(true);
    closeBottomSheet();

    const compressed = await Image.compress(params.photo, {
      maxHeight: 2048,
      maxWidth: 2048,
    });
    const image = await fetch(compressed);
    const imageBlob = await image.blob();
    const base64Image = (await blobToBase64(imageBlob)) as string;
    // Remove metadata, e.g. 'data:image/png;base64',
    // and keep just the base64 encoded part of the image
    // Nivel does not accept the metadata being a part of the image.
    const base64data = base64Image.split(',').pop();
    // Nivel use the file name suffix as imageType.
    // (omg, why not just accept the base64 metadata, or at least a mime type as imageType?)
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
        enableScanning();
        closeBottomSheet();
      })
      .catch((e) => {
        console.error(e);
        setIsError(true);
        enableScanning();
        closeBottomSheet();
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
        openBottomSheet(() => (
          <VehicleLookupConfirmationBottomSheet
            vehicleId={providerAndVehicleId.vehicle_id}
            provider={providerAndVehicleId.provider}
            onReportSubmit={submitReport}
            onClose={enableScanning}
          />
        ));
      } else {
        selectProvider(true);
      }
    }
  };

  const selectProvider = (qrScanFailed?: boolean) => {
    openBottomSheet(() => (
      <SelectProviderBottomSheet
        providers={providersList}
        qrScanFailed={qrScanFailed}
        onSelect={(provider) => {
          submitReport(provider.id);
        }}
        onClose={enableScanning}
      />
    ));
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
    <ScreenContainer
      title={t(ParkingViolationTexts.qr.title)}
      secondaryText={t(ParkingViolationTexts.qr.instructions)}
      leftHeaderButton={isLoading ? undefined : {type: 'back', withIcon: true}}
      buttons={
        <Button
          disabled={isError}
          mode="secondary"
          interactiveColor="interactive_0"
          onPress={() => selectProvider()}
          text={t(ParkingViolationTexts.qr.scanningNotPossible)}
        />
      }
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
        <Camera mode="qr" style={style.camera} onCapture={handlePhotoCapture} />
      )}
    </ScreenContainer>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  camera: {
    flexGrow: 1,
  },
  error: {
    margin: theme.spacings.medium,
  },
}));
