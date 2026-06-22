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
import type {MobilityPriceAdjustmentBenefitType} from '@atb/api/types/benefit';

type Props = {
  pricingPlan: ShmoPricingPlan;
  benefit?: MobilityPriceAdjustmentBenefitType;
  systemId: string;
  onNavigatePricingDetails?: (
    pricingPlan: ShmoPricingPlan,
    benefit: MobilityPriceAdjustmentBenefitType | undefined,
  ) => void;
};

export const PriceDetailsCard = ({
  pricingPlan,
  benefit,
  systemId,
  onNavigatePricingDetails,
}: Props) => {
  const {t, language} = useTranslation();
  const styles = useStyles();
  const ratePrUnit = formatRatePerUnit(pricingPlan, language);
  const freeUnlock = getFreeUnlock(benefit, systemId);
  const freeMinutes = getFreeMinutes(benefit, systemId);

  const unlockStat = freeUnlock
    ? t(ScooterTexts.free)
    : `${formatNumberToString(pricingPlan.price, language)} ${getCurrencySymbol(pricingPlan.currency)}`;

  const minutePriceStat =
    freeMinutes && pricingPlan.perMinPricing?.length
      ? `${formatNumberToString(
          computeFreeMinuteCount(freeMinutes, pricingPlan.perMinPricing),
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

  const benefitTitle = getTextForLanguage(benefit?.title, language);
  const benefitDescription = getTextForLanguage(benefit?.description, language);
  const hasBenefitInfo = !!benefitTitle || !!benefitDescription;

  return (
    <Section>
      {hasBenefitInfo && (
        <GenericSectionItem>
          <View style={styles.benefitContainer}>
            <BenefitIllustration
              illustration={benefit?.illustration}
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
        </GenericSectionItem>
      )}
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
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.small,
    },
    sectionWrapper: {
      padding: theme.spacing.small,
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
    },
  };
});
