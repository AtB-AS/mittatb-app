import {VehicleId} from '@atb/api/types/generated/fragments/vehicles';
import React from 'react';
import {useTranslation} from '@atb/translations';
import {StyleSheet} from '@atb/theme';
import {useVehicle} from '@atb/mobility/use-vehicle';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {OperatorNameAndLogo} from './OperatorNameAndLogo';
import {View} from 'react-native';
import {BatteryHigh} from '@atb/assets/svg/mono-icons/miscellaneous';
import {Unlock, PricePerTime} from '@atb/assets/svg/mono-icons/mobility';
import {VehicleCardStat} from './VehicleCardStat';
import {ScooterTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {
  formatNumberLang,
  formatPrice,
  formatRange,
  getBatteryLevelIcon,
} from '../utils';

type Props = {
  vehicleId: VehicleId;
};

export const VehicleCard = ({vehicleId: id}: Props) => {
  const {t, language} = useTranslation();
  const styles = useSheetStyle();
  const {vehicle, operatorName, brandLogoUrl} = useVehicle(id);

  return (
    <Section style={styles.container}>
      <GenericSectionItem>
        <OperatorNameAndLogo
          operatorName={operatorName}
          logoUrl={brandLogoUrl}
          style={styles.operatorNameAndLogo}
        />
      </GenericSectionItem>
      <GenericSectionItem>
        <View style={styles.content}>
          {vehicle ? (
            <>
              <VehicleCardStat
                icon={
                  vehicle.currentFuelPercent
                    ? getBatteryLevelIcon(vehicle.currentFuelPercent)
                    : BatteryHigh
                }
                stat={formatRange(vehicle.currentRangeMeters, language)}
                description={t(ScooterTexts.range)}
              />
              <VehicleCardStat
                icon={Unlock}
                stat={
                  formatNumberLang(vehicle.pricingPlan.price, language) + ' kr'
                }
                description={t(ScooterTexts.unlock)}
              />
              {vehicle.pricingPlan.perMinPricing &&
              vehicle.pricingPlan.perMinPricing.length > 0 ? (
                <VehicleCardStat
                  icon={PricePerTime}
                  stat={
                    formatPrice(
                      vehicle?.pricingPlan.perMinPricing[0],
                      language,
                    ) + ' kr'
                  }
                  description={t(ScooterTexts.perMin)}
                />
              ) : null}
            </>
          ) : null}
        </View>
      </GenericSectionItem>
    </Section>
  );
};

const useSheetStyle = StyleSheet.createThemeHook((theme) => {
  return {
    container: {
      paddingHorizontal: theme.spacing.medium,
      marginBottom: theme.spacing.medium,
    },
    content: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing.medium,
      paddingTop: theme.spacing.small,
    },
    operatorNameAndLogo: {
      flexDirection: 'row',
    },
  };
});
