import {VehicleFragment} from '@atb/api/types/generated/fragments/vehicles';
import React, {useCallback} from 'react';
import {Alert, AlertButton, Linking, Platform, View} from 'react-native';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {
  getTextForLanguage,
  Language,
  ScreenHeaderTexts,
  useTranslation,
} from '@atb/translations';
import {StyleSheet} from '@atb/theme';
import {Battery} from '@atb/assets/svg/mono-icons/vehicles';
import {Button} from '@atb/components/button';
import {
  ScooterTexts,
  VehicleTexts,
} from '@atb/translations/screens/subscreens/VehicleTexts';
import {VehicleStat} from '@atb/vehicles/components/VehicleStat';
import {Section} from '@atb/components/sections';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {formatDecimalNumber} from '@atb/utils/numbers';
import {PricingPlan} from '@atb/vehicles/components/PricingPlan';
import {ScooterImage} from '@atb/vehicles/components/ScooterImage';

type Props = {
  vehicle: VehicleFragment;
  close: () => void;
};
export const ScooterSheet = ({vehicle, close}: Props) => {
  const {t, language} = useTranslation();
  const style = useSheetStyle();
  const operatorName =
    getTextForLanguage(vehicle.system.operator.name.translation, language) ??
    t(ScooterTexts.unknownOperator);
  const appStoreUri =
    Platform.OS === 'ios'
      ? vehicle.system.rentalApps?.ios?.storeUri
      : vehicle.system.rentalApps?.android?.storeUri;
  const rentalAppUri =
    Platform.OS === 'ios'
      ? vehicle.rentalUris?.ios
      : vehicle.rentalUris?.android;

  const appStoreOpenError = (operatorName: string) => {
    const appStore = t(VehicleTexts.appStore());
    Alert.alert(
      '',
      t(VehicleTexts.appStoreOpenError.text(appStore, operatorName)),
      [
        {
          text: t(VehicleTexts.appStoreOpenError.button),
          style: 'cancel',
        },
      ],
    );
  };

  type AppMissingAlertArgs = {
    operatorName: string;
    appStoreUri: string | undefined;
  };
  const appMissingAlert = ({
    operatorName,
    appStoreUri,
  }: AppMissingAlertArgs) => {
    const buttons: AlertButton[] = [
      {
        text: t(VehicleTexts.appMissingAlert.buttons.cancel),
        style: 'cancel',
      },
    ];
    if (appStoreUri) {
      buttons.push({
        text: t(
          VehicleTexts.appMissingAlert.buttons.openAppStore(
            t(VehicleTexts.appStore()),
          ),
        ),
        style: 'default',
        onPress: () =>
          Linking.openURL(appStoreUri).catch(() =>
            appStoreOpenError(operatorName),
          ),
      });
    }
    Alert.alert(
      t(VehicleTexts.appMissingAlert.title(operatorName)),
      t(VehicleTexts.appMissingAlert.text(operatorName)),
      buttons,
    );
  };

  const openOperatorApp = useCallback(async () => {
    if (!rentalAppUri) return;
    await Linking.openURL(rentalAppUri).catch(() =>
      appMissingAlert({operatorName, appStoreUri}),
    );
  }, [rentalAppUri, operatorName, appStoreUri]);

  return (
    <BottomSheetContainer>
      <ScreenHeaderWithoutNavigation
        title={operatorName}
        leftButton={{
          type: 'close',
          onPress: close,
          text: t(ScreenHeaderTexts.headerButton.close.text),
        }}
        color={'background_1'}
        setFocusOnLoad={false}
      />

      <Section withFullPadding style={style.container}>
        <View style={style.vehicleStats}>
          <VehicleStat
            style={style.vehicleStat}
            svg={Battery}
            primaryStat={vehicle.currentFuelPercent + '%'}
            secondaryStat={getRange(vehicle.currentRangeMeters, language)}
          />
          <PricingPlan operator={operatorName} plan={vehicle.pricingPlan} />
        </View>
        <ScooterImage style={style.vehicleImage} />
      </Section>

      {rentalAppUri && (
        <FullScreenFooter>
          <Button
            style={style.button}
            text={t(ScooterTexts.primaryButton.text(operatorName))}
            onPress={openOperatorApp}
            mode="primary"
            interactiveColor={'interactive_0'}
          />
        </FullScreenFooter>
      )}
    </BottomSheetContainer>
  );
};

const getRange = (rangeInMeters: number, language: Language) => {
  const rangeInKm =
    rangeInMeters > 5000
      ? (rangeInMeters / 1000).toFixed(0)
      : formatDecimalNumber(rangeInMeters / 1000, language, 1);
  return `ca ${rangeInKm}km`;
};

const useSheetStyle = StyleSheet.createThemeHook((theme) => ({
  button: {
    marginTop: theme.spacings.medium,
  },
  container: {
    flexGrow: 1,
    flexShrink: 0,
    flexDirection: 'row',
    display: 'flex',
  },
  vehicleStats: {
    flex: 0,
    justifyContent: 'flex-end',
  },
  vehicleImage: {
    flexGrow: 1,
    justifyContent: 'center',
    marginBottom: theme.spacings.medium,
  },
  vehicleStat: {
    marginBottom: theme.spacings.medium,
  },
}));
