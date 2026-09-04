import React from 'react';
import {ScrollView, View} from 'react-native';
import {RootStackScreenProps} from './navigation-types';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {useTranslation} from '@atb/translations';
import {
  MobilityTexts,
  ScooterTexts,
} from '@atb/translations/screens/subscreens/MobilityTexts';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {FullScreenView} from '@atb/components/screen-view';
import {ScreenHeading} from '@atb/components/heading';
import {formatNumberToString} from '@atb-as/utils';
import {getCurrencySymbol} from '@atb/translations/currency';
import {ShmoPricingSegment} from '@atb/api/types/mobility';
import {PriceAdjustmentEnum} from '@atb-as/config-specs/lib/mobility';
import type {PriceAdjustmentType} from '@atb/api/types/benefit';
import {
  computeFreeMinuteCount,
  formatMinuteBoundary,
} from '@atb/modules/mobility';

type Props = RootStackScreenProps<'Root_ShmoPricingDetailsScreen'>;
type PricingRow = {label: string; value: string};

export const Root_ShmoPricingDetailsScreen = ({navigation, route}: Props) => {
  const {pricingPlan, benefit} = route.params;
  const focusRef = useFocusOnLoad(navigation);
  const {t, language} = useTranslation();
  const styles = useStyles();
  const {theme} = useThemeContext();
  const contentColor = theme.color.background.neutral[1];
  const currency = getCurrencySymbol(pricingPlan.currency);
  const rows: PricingRow[] = [];
  const hasMultiplePerMinPricingPlans =
    (pricingPlan.perMinPricing?.length ?? 0) > 1;
  const hasMultiplePerKmPricingPlans =
    (pricingPlan.perKmPricing?.length ?? 0) > 1;

  const freeUnlockPriceAdjustment = benefit?.priceAdjustments.find(
    (adj: PriceAdjustmentType) =>
      adj.type === PriceAdjustmentEnum.enum.FREE_UNLOCK,
  );
  const freeMinutesPriceAdjustment = benefit?.priceAdjustments.find(
    (adj: PriceAdjustmentType) =>
      adj.type === PriceAdjustmentEnum.enum.FREE_MINUTES,
  );
  const hasCampaign = !!(
    freeUnlockPriceAdjustment || freeMinutesPriceAdjustment
  );

  const freeMinCount =
    freeMinutesPriceAdjustment && pricingPlan.perMinPricing?.length
      ? computeFreeMinuteCount(
          freeMinutesPriceAdjustment,
          pricingPlan.perMinPricing,
        )
      : 0;

  const getSegmentLabel = (
    segment: ShmoPricingSegment,
    effectiveStart: number,
    unit: 'min' | 'km',
    hasMultipleSegments: boolean,
  ): string => {
    const intervalPhrase = t(
      unit === 'min'
        ? ScooterTexts.per.intervalMin(segment.interval)
        : ScooterTexts.per.intervalKm(segment.interval),
    );
    if (hasMultipleSegments || effectiveStart > 0) {
      if (segment.end != null) {
        const rangeText =
          unit === 'min'
            ? `${formatMinuteBoundary(effectiveStart, t)}-${formatMinuteBoundary(segment.end, t)}${segment.end < 60 ? ' min' : ''}`
            : `${effectiveStart}-${segment.end} km`;
        return t(
          MobilityTexts.pricingDetails.pricePerIntervalRange(
            intervalPhrase,
            rangeText,
          ),
        );
      } else {
        const fromText =
          unit === 'min'
            ? `${formatMinuteBoundary(effectiveStart, t)}${effectiveStart < 60 ? ' min' : ''}`
            : `${effectiveStart} km`;
        return t(
          MobilityTexts.pricingDetails.pricePerIntervalFrom(
            intervalPhrase,
            fromText,
          ),
        );
      }
    }
    return t(MobilityTexts.pricingDetails.pricePerInterval(intervalPhrase));
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
      label: getSegmentLabel(
        {start: 0, end: freeMinCount, interval: 1, rate: 0},
        0,
        'min',
        true,
      ),
      value: `0 ${currency}`,
    });
  }

  pricingPlan.perMinPricing
    // Segments entirely inside the free window are paid for by the campaign, so
    // showing them would render an inverted range like "30-20 min".
    ?.filter((seg) => !hasCampaign || seg.end == null || seg.end > freeMinCount)
    .forEach((seg) => {
      rows.push({
        label: getSegmentLabel(
          seg,
          hasCampaign ? Math.max(freeMinCount, seg.start) : seg.start,
          'min',
          hasMultiplePerMinPricingPlans,
        ),
        value: `${formatNumberToString(seg.rate, language)} ${currency}`,
      });
    });

  pricingPlan.perKmPricing?.forEach((seg) => {
    rows.push({
      label: getSegmentLabel(
        seg,
        seg.start,
        'km',
        hasMultiplePerKmPricingPlans,
      ),
      value: `${formatNumberToString(seg.rate, language)} ${currency}`,
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
            type="secondary"
            style={styles.sectionLabel}
          >
            {t(MobilityTexts.pricingDetails.campaignPrice)}
          </ThemeText>
        )}
        <Section style={!hasCampaign ? styles.sectionTopPadding : undefined}>
          {rows.map(({label, value}, index) => (
            <GenericSectionItem key={index}>
              <View style={styles.row}>
                <ThemeText style={styles.label}>{label}</ThemeText>
                <ThemeText style={styles.value}>{value}</ThemeText>
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
    gap: theme.spacing.small,
  },
  label: {
    flexShrink: 1,
  },
  value: {
    flexShrink: 1,
    textAlign: 'right',
  },
  sectionLabel: {
    marginLeft: theme.spacing.small,
  },
}));
