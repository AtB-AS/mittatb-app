import {VehicleFragment} from '@atb/api/types/generated/fragments/vehicles';
import React from 'react';
import {Linking, Platform} from 'react-native';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {
  getTextForLanguage,
  Language,
  ScreenHeaderTexts,
  useTranslation,
} from '@atb/translations';
import {StyleSheet} from '@atb/theme';
import {Battery} from '@atb/assets/svg/mono-icons/map';
import {Button} from '@atb/components/button';
import ScooterTexts from '@atb/translations/screens/subscreens/ScooterTexts';
import {VehicleStat} from '@atb/vehicles/components/VehicleStat';
import {Section} from '@atb/components/sections';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {formatDecimalNumber} from '@atb/utils/numbers';
import {PricingPlan} from '@atb/vehicles/components/PricingPlan';

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
  const operatorAppUri =
    Platform.OS === 'ios'
      ? vehicle.rentalUris?.ios
      : vehicle.rentalUris?.android;

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

      <Section withFullPadding>
        <VehicleStat
          style={style.vehicleStat}
          svg={Battery}
          primaryStat={vehicle.currentFuelPercent + '%'}
          secondaryStat={getRange(vehicle.currentRangeMeters, language)}
        />
        <PricingPlan operator={operatorName} plan={vehicle.pricingPlan} />
      </Section>

      {operatorAppUri && (
        <FullScreenFooter>
          <Button
            style={style.button}
            text={t(ScooterTexts.primaryButton.text(operatorName))}
            onPress={async () => await Linking.openURL(operatorAppUri)}
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
    marginTop: theme.spacings.large,
  },
  container: {
    padding: theme.spacings.medium,
    backgroundColor: theme.static.background.background_1.background,
  },
  vehicleStat: {
    marginBottom: theme.spacings.medium,
  },
}));
