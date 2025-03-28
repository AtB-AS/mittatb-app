import React from 'react';
import {useTranslation} from '@atb/translations';
import {StyleSheet} from '@atb/theme';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {OperatorNameAndLogo} from './OperatorNameAndLogo';
import {View} from 'react-native';
import {BatteryHigh} from '@atb/assets/svg/mono-icons/miscellaneous';
import {Unlock, PricePerTime} from '@atb/assets/svg/mono-icons/mobility';
import {VehicleCardStat} from './VehicleCardStat';
import {ScooterTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {formatPricePerUnit, formatRange, getBatteryLevelIcon} from '../utils';
import {PricingPlanFragment} from '@atb/api/types/generated/fragments/mobility-shared';
import {formatNumberToString} from '@atb/utils/numbers';
import {ShmoPricingPlan} from '@atb/api/types/mobility';

type Props = {
  pricingPlan: PricingPlanFragment | ShmoPricingPlan;
  currentFuelPercent: number | undefined;
  currentRangeMeters: number;
  operatorName: string;
  brandLogoUrl?: string;
};

export const VehicleCard = ({
  pricingPlan,
  currentFuelPercent,
  currentRangeMeters,
  operatorName,
  brandLogoUrl,
}: Props) => {
  const {t, language} = useTranslation();
  const styles = useStyles();

  const price = formatPricePerUnit(pricingPlan, language);

  return (
    <Section
      style={styles.container}
      accessible={true}
      accessibilityLabel={`${operatorName} scooter ${currentFuelPercent}% battery, range ${formatRange(
        currentRangeMeters,
        language,
      )}`}
    >
      <GenericSectionItem>
        <OperatorNameAndLogo
          operatorName={operatorName}
          logoUrl={brandLogoUrl}
          style={styles.operatorNameAndLogo}
        />
      </GenericSectionItem>
      <GenericSectionItem>
        <View style={styles.content}>
          <>
            <VehicleCardStat
              icon={
                currentFuelPercent
                  ? getBatteryLevelIcon(currentFuelPercent)
                  : BatteryHigh
              }
              stat={formatRange(currentRangeMeters, language)}
              description={t(ScooterTexts.range)}
            />
            <VehicleCardStat
              icon={Unlock}
              stat={formatNumberToString(pricingPlan.price, language) + ' kr'}
              description={t(ScooterTexts.unlock)}
            />

            <VehicleCardStat
              icon={PricePerTime}
              stat={price?.price ?? ''}
              description={t(ScooterTexts.per.unit(price?.unit ?? ''))}
            />
          </>
        </View>
      </GenericSectionItem>
    </Section>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
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
