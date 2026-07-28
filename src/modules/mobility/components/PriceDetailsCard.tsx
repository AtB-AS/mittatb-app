import React from 'react';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {StyleSheet} from '@atb/theme';
import {
  GenericSectionItem,
  LinkSectionItem,
  Section,
} from '@atb/components/sections';
import {View} from 'react-native';
import {Unlock, PricePerTime} from '@atb/assets/svg/mono-icons/mobility';
import {VehicleCardStat} from './VehicleCardStat';
import {ThemeText} from '@atb/components/text';
import {BenefitIllustration} from './BenefitIllustration';
import {
  MobilityTexts,
  ScooterTexts,
} from '@atb/translations/screens/subscreens/MobilityTexts';
import {
  computeFreeMinuteCount,
  formatRatePerUnit,
  getFreeMinutes,
  getFreeUnlock,
} from '../utils';
import {formatNumberToString} from '@atb-as/utils';
import {getCurrencySymbol} from '@atb/translations/currency';
import {ShmoPricingPlan} from '@atb/api/types/mobility';
import SvgChevronRight from '@atb/assets/svg/mono-icons/navigation/ChevronRight';
import type {BenefitType} from '@atb/api/types/benefit';

type Props = {
  pricingPlan: ShmoPricingPlan;
  benefit?: BenefitType;
  onNavigatePricingDetails?: (
    pricingPlan: ShmoPricingPlan,
    benefit: BenefitType | undefined,
  ) => void;
};

export const PriceDetailsCard = ({
  pricingPlan,
  benefit,
  onNavigatePricingDetails,
}: Props) => {
  const {t, language} = useTranslation();
  const styles = useStyles();
  const ratePrUnit = formatRatePerUnit(pricingPlan, language);
  const freeUnlock = getFreeUnlock(benefit);
  const freeMinutes = getFreeMinutes(benefit);

  const currencySymbol = getCurrencySymbol(pricingPlan.currency);
  const zeroAmount = `${formatNumberToString(0, language)} ${currencySymbol}`;

  const unlockStat = freeUnlock
    ? zeroAmount
    : `${formatNumberToString(pricingPlan.price, language)} ${currencySymbol}`;

  const hasFreeMinutes = !!(freeMinutes && pricingPlan.perMinPricing?.length);

  const minutePriceStat = hasFreeMinutes ? zeroAmount : ratePrUnit?.formattedRate;

  const minutePriceDescription = hasFreeMinutes
    ? t(
        ScooterTexts.freeMinutesDescription(
          computeFreeMinuteCount(freeMinutes!, pricingPlan.perMinPricing!),
        ),
      )
    : t(ScooterTexts.per.unit(ratePrUnit?.perUnit ?? ''));

  const benefitTitle = getTextForLanguage(benefit?.title, language);
  const benefitDescription = getTextForLanguage(benefit?.description, language);
  const hasBenefitInfo = !!benefitTitle || !!benefitDescription;

  return (
    <Section>
      <GenericSectionItem style={styles.sectionWrapper}>
        <View style={styles.sectionContent}>
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

          {hasBenefitInfo && (
            <View style={styles.benefitContainer}>
              <BenefitIllustration
                illustrationName={benefit?.illustrationName}
                style={styles.benefitIllustration}
              />
              <View style={styles.benefitContent}>
                {benefitTitle && (
                  <ThemeText typography="body__m__strong">
                    {benefitTitle}
                  </ThemeText>
                )}
                {benefitDescription && (
                  <ThemeText typography="body__s" type="secondary">
                    {benefitDescription}
                  </ThemeText>
                )}
              </View>
            </View>
          )}
        </View>
      </GenericSectionItem>

      {onNavigatePricingDetails && (
        <LinkSectionItem
          rightIcon={{svg: SvgChevronRight}}
          text={t(MobilityTexts.pricingDetails.priceInfo)}
          onPress={() => onNavigatePricingDetails(pricingPlan, benefit)}
        />
      )}
    </Section>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.small,
    },
    sectionWrapper: {
      padding: theme.spacing.small,
    },
    sectionContent: {
      flex: 1,
      gap: theme.spacing.medium,
    },
    benefitContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    benefitIllustration: {
      marginEnd: theme.spacing.medium,
    },
    benefitContent: {
      flex: 1,
      gap: theme.spacing.xSmall,
    },
  };
});
