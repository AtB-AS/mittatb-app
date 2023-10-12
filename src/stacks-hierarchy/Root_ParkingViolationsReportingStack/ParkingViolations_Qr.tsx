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
import {lookupVehicleByQr} from '@atb/api/mobility';
import {Processing} from '@atb/components/loading';

export type QrScreenProps =
  ParkingViolationsScreenProps<'ParkingViolations_Qr'>;

export const ParkingViolations_Qr = ({
  navigation,
  route: {params},
}: QrScreenProps) => {
  const {t} = useTranslation();
  const style = useStyles();
  const isFocused = useIsFocused();
  const [hasCapturedQr, setHasCapturedQr] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {open: openBottomSheet, close: closeBottomSheet} = useBottomSheet();
  const {providers} = useParkingViolationsState();

  useEffect(() => {
    if (isFocused) {
      setHasCapturedQr(false);
    }
  }, [isFocused]);

  const submitReport = (providerId: number, vehicleId?: string | undefined) => {
    navigation.navigate('ParkingViolations_Confirmation', {
      ...params,
      providerId,
      vehicleId,
    });
    enableScanning();
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
    if (!hasCapturedQr) {
      disableScanning();
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

  const disableScanning = () => {
    setHasCapturedQr(true);
    setIsLoading(true);
  };

  const enableScanning = () => {
    setIsLoading(false);
    setHasCapturedQr(false);
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
        />
      }
    >
      {isLoading && (
        <View style={style.processing}>
          <Processing message={t(dictionary.loading)} />
        </View>
      )}

      {isFocused && !isLoading && !hasCapturedQr && (
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
  processing: {
    flex: 1,
    justifyContent: 'center',
  },
}));
