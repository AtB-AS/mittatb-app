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

type Props = {
  pricingPlan: PricingPlanFragment | undefined;
  currentFuelPercent: number | undefined | null;
  currentRangeMeters: number | undefined | null;
  operatorName: string;
  brandLogoUrl: string | undefined;
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

  const price = pricingPlan
    ? formatPricePerUnit(pricingPlan, language)
    : undefined;

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
          <>
            <VehicleCardStat
              icon={
                currentFuelPercent
                  ? getBatteryLevelIcon(currentFuelPercent)
                  : BatteryHigh
              }
              stat={formatRange(currentRangeMeters ?? 0, language)}
              description={t(ScooterTexts.range)}
            />
            <VehicleCardStat
              icon={Unlock}
              stat={
                formatNumberToString(pricingPlan?.price ?? 0, language) + ' kr'
              }
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
