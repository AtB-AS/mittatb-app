import React from 'react';
import {useTranslation} from '@atb/translations';
import {StyleSheet} from '@atb/theme';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {View} from 'react-native';
import {Unlock, PricePerTime} from '@atb/assets/svg/mono-icons/mobility';
import {VehicleCardStat} from './VehicleCardStat';
import {ScooterTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {extractNumber, formatPricePerUnit} from '../utils';
import {PricingPlanFragment} from '@atb/api/types/generated/fragments/mobility-shared';
import {ShmoPricingPlan} from '@atb/api/types/mobility';
import {formatNumberToString} from '@atb-as/utils';
import {PriceAdjustmentType} from '@atb-as/config-specs/lib/mobility';

type Props = {
  pricingPlan: PricingPlanFragment | ShmoPricingPlan;
  priceAdjustments?: PriceAdjustmentType[];
};

export const PriceDetailsCard = ({pricingPlan, priceAdjustments}: Props) => {
  const {t, language} = useTranslation();
  const styles = useStyles();
  const price = formatPricePerUnit(pricingPlan, language);
  const freeUnlock = priceAdjustments?.find(
    (e) => e.description === 'Free unlock',
  );
  const freeMinutes = priceAdjustments?.find(
    (e) => e.description === 'Free minutes',
  );

  const priceValue = extractNumber(price?.price ?? '');

  const unlockStat = freeUnlock
    ? t(ScooterTexts.free)
    : `${formatNumberToString(pricingPlan.price, language)} kr`;

  const minutePriceStat =
    freeMinutes && priceValue !== null
      ? `${formatNumberToString(
          Math.floor(Math.abs(freeMinutes.amount) / priceValue),
          language,
        )} min ${t(ScooterTexts.free).toLocaleLowerCase(language)}`
      : price?.price;

  const minutePriceDescription = freeMinutes
    ? t(
        ScooterTexts.per.discount(
          price?.unit ?? '',
          priceValue?.toString() ?? '',
        ),
      )
    : t(ScooterTexts.per.unit(price?.unit ?? ''));

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
