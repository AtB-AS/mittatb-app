import {useBottomSheet} from '@atb/components/bottom-sheet';
import {Button} from '@atb/components/button';
import {Camera} from '@atb/components/camera';
import {StyleSheet} from '@atb/theme';
import {dictionary, useTranslation} from '@atb/translations';
import {ParkingViolationTexts} from '@atb/translations/screens/ParkingViolations';
import {useIsFocused} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {Dimensions, View} from 'react-native';
import {useParkingViolationsState} from './ParkingViolationsContext';
import {ScreenContainer} from './ScreenContainer';
import {SelectProviderBottomSheet} from './SelectProviderBottomSheet';
import {VehicleLookupConfirmationBottomSheet} from './VehicleLookupBottomSheet';
import {ParkingViolationsScreenProps} from './navigation-types';
import {lookupVehicleByQr, sendViolationsReport} from '@atb/api/mobility';
import {Processing} from '@atb/components/loading';
import {MessageBox} from '@atb/components/message-box';
import {blobToBase64} from './utils';
import {useAuthState} from '@atb/auth';

export type QrScreenProps =
  ParkingViolationsScreenProps<'ParkingViolations_Qr'>;

export const ParkingViolations_Qr = ({
  navigation,
  route: {params},
}: QrScreenProps) => {
  const {t} = useTranslation();
  const style = useStyles();
  const isFocused = useIsFocused();
  const [capturedQr, seCapturedQr] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const {open: openBottomSheet, close: closeBottomSheet} = useBottomSheet();
  const {providers, position} = useParkingViolationsState();
  const {abtCustomerId} = useAuthState();

  useEffect(() => {
    if (isFocused) {
      seCapturedQr(undefined);
    }
  }, [isFocused]);

  const submitReport = async (providerId: number) => {
    setIsLoading(true);
    const result = await fetch(params.photo);
    const data = await result.blob();
    const base64Image = (await blobToBase64(data)) as string;
    const image = base64Image.split(',')[1];
    //Nivel use the file name suffix as imageType
    const imageType = params.photo.split('.').pop();
    sendViolationsReport({
      appId: abtCustomerId,
      image,
      imageType,
      latitude: position?.latitude ?? 0,
      longitude: position?.longitude ?? 0,
      providerId,
      qr: capturedQr,
      violations: params.selectedViolations.map((v) => v.code),
      timestamp: new Date().toISOString(),
    })
      .then(() => {
        navigation.navigate('ParkingViolations_Confirmation');
        enableScanning();
      })
      .catch((e) => {
        console.error(e);
        setIsError(true);
        enableScanning();
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
            close={enableScanning}
          />
        ));
      } else {
        selectProvider();
      }
    }
  };

  const selectProvider = () => {
    openBottomSheet(() => (
      <SelectProviderBottomSheet
        providers={providers}
        onSelect={(provider) => {
          submitReport(provider.id);
        }}
        close={enableScanning}
      />
    ));
  };

  const disableScanning = (qr: string) => {
    seCapturedQr(qr);
    setIsLoading(true);
  };

  const enableScanning = () => {
    setIsLoading(false);
    seCapturedQr(undefined);
    closeBottomSheet();
  };

  return (
    <ScreenContainer
      title={t(ParkingViolationTexts.qr.title)}
      secondaryText={t(ParkingViolationTexts.qr.instructions)}
      buttons={
        <Button
          mode="secondary"
          interactiveColor={'interactive_0'}
          onPress={selectProvider}
          text={t(ParkingViolationTexts.qr.scanningNotPossible)}
          disabled={isError}
        />
      }
    >
      {isLoading && (
        <View style={style.centered}>
          <Processing message={t(dictionary.loading)} />
        </View>
      )}
      {isError && (
        <MessageBox
          style={style.error}
          title={t(ParkingViolationTexts.error.sendReport.title)}
          message={t(ParkingViolationTexts.error.sendReport.message)}
          type={'error'}
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
    marginVertical: theme.spacings.large,
    justifyContent: 'flex-start',
    // QR camera is always 4/3 aspect ratio but the QR code frame overlay is 100% height.
    // Setting the height and width explicitly prevents the overlay from overflowing
    // the camera view.
    height:
      (Dimensions.get('window').width - 2 * theme.spacings.medium) * 1.33333,
    width: Dimensions.get('window').width - 2 * theme.spacings.medium,
  },
  error: {
    marginTop: theme.spacings.medium,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
  },
}));
