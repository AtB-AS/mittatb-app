import React from 'react';
import {useTranslation} from '@atb/translations';
import {StyleSheet} from '@atb/theme';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {View} from 'react-native';
import {Unlock, PricePerTime} from '@atb/assets/svg/mono-icons/mobility';
import {VehicleCardStat} from './VehicleCardStat';
import {ScooterTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {formatRatePerUnit} from '../utils';
import {formatNumberToString} from '@atb-as/utils';
import {
  PriceAdjustmentEnum,
  PriceAdjustmentType,
} from '@atb-as/config-specs/lib/mobility';
import {getCurrencySymbol} from '@atb/translations/currency';
import {ShmoPricingPlan} from '@atb/api/types/mobility';

type Props = {
  pricingPlan: ShmoPricingPlan;
  priceAdjustments?: PriceAdjustmentType[];
  systemId: string;
};

export const PriceDetailsCard = ({
  pricingPlan,
  priceAdjustments,
  systemId,
}: Props) => {
  const {t, language} = useTranslation();
  const styles = useStyles();
  const ratePrUnit = formatRatePerUnit(pricingPlan, language);
  const freeUnlock = priceAdjustments?.find(
    (e) =>
      e.type === PriceAdjustmentEnum.enum.FREE_UNLOCK &&
      e.systemIds.includes(systemId),
  );
  const freeMinutes = priceAdjustments?.find(
    (e) =>
      e.type === PriceAdjustmentEnum.enum.FREE_MINUTES &&
      e.systemIds.includes(systemId),
  );

  const unlockStat = freeUnlock
    ? t(ScooterTexts.free)
    : `${formatNumberToString(pricingPlan.price, language)} ${getCurrencySymbol(pricingPlan.currency)}`;

  const minutePriceStat =
    freeMinutes && ratePrUnit?.rate
      ? `${formatNumberToString(
          Math.floor(Math.abs(freeMinutes.amount) / ratePrUnit.rate),
          language,
        )} min ${t(ScooterTexts.free).toLocaleLowerCase(language)}`
      : ratePrUnit?.formattedRate;

  const minutePriceDescription = freeMinutes
    ? t(
        ScooterTexts.per.discount(
          ratePrUnit?.perUnit ?? '',
          ratePrUnit?.rate.toString() ?? '',
          pricingPlan.currency,
        ),
      )
    : t(ScooterTexts.per.unit(ratePrUnit?.perUnit ?? ''));

  return (
    <Section>
      <GenericSectionItem style={styles.sectionWrapper}>
        <View style={styles.content}>
          <VehicleCardStat
            icon={Unlock}
            stat={unlockStat}
            description={t(ScooterTexts.unlock)}
            hasPriceAdjustment={!!freeUnlock}
          />
          {minutePriceStat && (
            <VehicleCardStat
              icon={PricePerTime}
              stat={minutePriceStat}
              description={minutePriceDescription}
              hasPriceAdjustment={!!freeMinutes}
            />
          )}
        </View>
      </GenericSectionItem>
    </Section>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    content: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.small,
    },
    sectionWrapper: {
      padding: theme.spacing.small,
    },
  };
});
