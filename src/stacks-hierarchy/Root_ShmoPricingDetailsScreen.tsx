import React from 'react';
import {ScrollView, View} from 'react-native';
import {RootStackScreenProps} from './navigation-types';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {useTranslation} from '@atb/translations';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {FullScreenView} from '@atb/components/screen-view';
import {ScreenHeading} from '@atb/components/heading';
import {formatNumberToString} from '@atb-as/utils';
import {getCurrencySymbol} from '@atb/translations/currency';
import {ShmoPricingSegment} from '@atb/api/types/mobility';
import {PriceAdjustmentEnum} from '@atb-as/config-specs/lib/mobility';
import {computeFreeMinuteCount} from '@atb/modules/mobility';

type Props = RootStackScreenProps<'Root_ShmoPricingDetailsScreen'>;
type PricingRow = {label: string; value: string};

export const Root_ShmoPricingDetailsScreen = ({navigation, route}: Props) => {
  const {pricingPlan, priceAdjustments} = route.params;
  const focusRef = useFocusOnLoad(navigation);
  const {t, language} = useTranslation();
  const styles = useStyles();
  const {theme} = useThemeContext();
  const contentColor = theme.color.background.neutral[1];
  const currency = getCurrencySymbol(pricingPlan.currency);
  const rows: PricingRow[] = [];
  const hasMultiplePerMinPricingPlans =
    (pricingPlan.perMinPricing?.length ?? 0) > 1;

  const freeUnlockPriceAdjustment = priceAdjustments?.find(
    (adj) => adj.type === PriceAdjustmentEnum.enum.FREE_UNLOCK,
  );
  const freeMinutesPriceAdjustment = priceAdjustments?.find(
    (adj) => adj.type === PriceAdjustmentEnum.enum.FREE_MINUTES,
  );
  const hasCampaign = !!(
    freeUnlockPriceAdjustment || freeMinutesPriceAdjustment
  );

  const firstPerMinPricingPlanRate = pricingPlan.perMinPricing?.[0]?.rate ?? 0;
  const freeMinCount =
    freeMinutesPriceAdjustment && firstPerMinPricingPlanRate > 0
      ? computeFreeMinuteCount(
          freeMinutesPriceAdjustment,
          firstPerMinPricingPlanRate,
        )
      : 0;

  const getMinuteSegmentLabel = (
    perMinPricingSegment: ShmoPricingSegment,
    effectiveStartMinute: number,
  ): string => {
    if (hasMultiplePerMinPricingPlans) {
      if (perMinPricingSegment.end != null) {
        return t(
          MobilityTexts.pricingDetails.minutePriceRange(
            effectiveStartMinute,
            perMinPricingSegment.end,
          ),
        );
      } else {
        return t(
          MobilityTexts.pricingDetails.minutePriceFrom(effectiveStartMinute),
        );
      }
    }
    return t(MobilityTexts.pricingDetails.minutePrice);
  };

  rows.push({
    label: t(MobilityTexts.pricingDetails.unlock),
    value:
      hasCampaign && freeUnlockPriceAdjustment
        ? `0 ${currency}`
        : `${formatNumberToString(pricingPlan.price, language)} ${currency}`,
  });

  if (hasCampaign && freeMinutesPriceAdjustment && freeMinCount > 0) {
    rows.push({
      label: t(MobilityTexts.pricingDetails.minutePriceRange(0, freeMinCount)),
      value: `0 ${currency}/min`,
    });
  }

  pricingPlan.perMinPricing?.forEach((seg) => {
    rows.push({
      label: getMinuteSegmentLabel(
        seg,
        hasCampaign ? Math.max(freeMinCount, seg.start) : seg.start,
      ),
      value: `${formatNumberToString(seg.rate, language)} ${currency}/min`,
    });
  });

  return (
    <FullScreenView
      focusRef={focusRef}
      headerProps={{
        title: t(MobilityTexts.pricingDetails.priceInfo),
        leftButton: {type: 'back'},
      }}
      headerContent={(ref) => (
        <ScreenHeading
          ref={ref}
          text={t(MobilityTexts.pricingDetails.priceInfo)}
        />
      )}
      contentColor={contentColor}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {hasCampaign && (
          <ThemeText
            typography="body__s"
            color="secondary"
            style={styles.sectionLabel}
          >
            {t(MobilityTexts.pricingDetails.campaignPrice)}
          </ThemeText>
        )}
        <Section style={!hasCampaign ? styles.sectionTopPadding : undefined}>
          {rows.map(({label, value}, index) => (
            <GenericSectionItem key={index}>
              <View style={styles.row}>
                <ThemeText>{label}</ThemeText>
                <ThemeText>{value}</ThemeText>
              </View>
            </GenericSectionItem>
          ))}
        </Section>
      </ScrollView>
    </FullScreenView>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    paddingHorizontal: theme.spacing.medium,
    paddingBottom: theme.spacing.medium,
    gap: theme.spacing.medium,
  },
  sectionTopPadding: {
    paddingTop: theme.spacing.medium,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionLabel: {
    marginLeft: theme.spacing.small,
  },
}));
