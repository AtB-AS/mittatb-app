import {VehicleFragment} from '@atb/api/types/generated/fragments/vehicles';
import React from 'react';
import {View} from 'react-native';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {Language, ScreenHeaderTexts, useTranslation} from '@atb/translations';
import {StyleSheet} from '@atb/theme';
import {Battery} from '@atb/assets/svg/mono-icons/vehicles';
import {Button} from '@atb/components/button';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {VehicleStat} from '@atb/mobility/components/VehicleStat';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {formatDecimalNumber} from '@atb/utils/numbers';
import {PricingPlan} from '@atb/mobility/components/PricingPlan';
import {OperatorLogo} from '@atb/mobility/components/OperatorLogo';
import {getRentalAppUri} from '@atb/mobility/utils';
import {useSystem} from '@atb/mobility/use-system';
import {useOperatorApp} from '@atb/mobility/use-operator-app';

type Props = {
  vehicle: VehicleFragment;
  close: () => void;
};
export const ScooterSheet = ({vehicle, close}: Props) => {
  const {t, language} = useTranslation();
  const style = useSheetStyle();
  const {appStoreUri, brandLogoUrl, operatorName} = useSystem(
    vehicle,
    vehicle.system.operator.name,
  );
  const rentalAppUri = getRentalAppUri(vehicle);
  const {openOperatorApp} = useOperatorApp({
    operatorName,
    appStoreUri,
    rentalAppUri,
  });

  return (
    <BottomSheetContainer>
      <ScreenHeaderWithoutNavigation
        leftButton={{
          type: 'close',
          onPress: close,
          text: t(ScreenHeaderTexts.headerButton.close.text),
        }}
        color={'background_1'}
        setFocusOnLoad={false}
      />
      <Section withPadding>
        <GenericSectionItem>
          <OperatorLogo operatorName={operatorName} logoUrl={brandLogoUrl} />
        </GenericSectionItem>
      </Section>

      <View style={style.vehicleInfo}>
        <View style={[style.vehicleInfoItem, style.vehicleInfoItem__first]}>
          <VehicleStat
            svg={Battery}
            primaryStat={vehicle.currentFuelPercent + '%'}
            secondaryStat={getRange(vehicle.currentRangeMeters, language)}
          />
        </View>
        <View style={[style.vehicleInfoItem, style.vehicleInfoItem__last]}>
          <PricingPlan operator={operatorName} plan={vehicle.pricingPlan} />
        </View>
      </View>

      {rentalAppUri && (
        <FullScreenFooter>
          <Button
            style={style.button}
            text={t(MobilityTexts.operatorAppSwitchButton(operatorName))}
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
  return `ca. ${rangeInKm} km`;
};

const useSheetStyle = StyleSheet.createThemeHook((theme) => ({
  button: {
    marginTop: theme.spacings.medium,
  },
  vehicleInfo: {
    flexGrow: 1,
    flexShrink: 0,
    flexDirection: 'row',
    padding: theme.spacings.medium,
  },
  vehicleInfoItem: {
    flex: 1,
    backgroundColor: theme.static.background.background_0.background,
    borderRadius: theme.border.radius.regular,
    padding: theme.spacings.medium,
  },
  // Hack until 'gap' is supported properly.
  // https://github.com/styled-components/styled-components/issues/3628
  vehicleInfoItem__first: {
    marginRight: theme.spacings.medium,
  },
  vehicleInfoItem__last: {
    marginLeft: theme.spacings.medium,
  },
  vehicleStat: {
    marginBottom: theme.spacings.medium,
  },
}));
