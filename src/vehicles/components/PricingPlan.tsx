import React from 'react';
import {
  PricingPlanFragment,
  PricingSegmentFragment,
} from '@atb/api/types/generated/fragments/mobility-shared';
import {ScooterTexts} from '@atb/translations/screens/subscreens/VehicleTexts';
import {VehicleStat} from '@atb/vehicles/components/VehicleStat';
import {Language, useTranslation} from '@atb/translations';
import {formatDecimalNumber} from '@atb/utils/numbers';
import {StyleSheet} from '@atb/theme';
import {hasMultiplePricingPlans} from '@atb/vehicles/utils';

type PricingPlanProps = {
  operator: string;
  plan: PricingPlanFragment;
};
export const PricingPlan = ({operator, plan}: PricingPlanProps) => {
  const {t} = useTranslation();
  const style = useSheetStyle();
  const seAppForPrices = (
    <VehicleStat
      style={style.vehicleStat}
      primaryStat={t(ScooterTexts.seeAppForPrices(operator))}
    />
  );

  if (hasMultiplePricingPlans(plan)) {
    return seAppForPrices;
  }

  if (plan.perMinPricing?.length) {
    return (
      <PriceInfo
        price={plan.price}
        pricingSegment={plan.perMinPricing[0]}
        unit={'min'}
      />
    );
  }

  if (plan.perKmPricing?.length) {
    return (
      <PriceInfo
        price={plan.price}
        pricingSegment={plan.perKmPricing[0]}
        unit={'km'}
      />
    );
  }

  return seAppForPrices;
};

type PriceInfoProps = {
  price: number;
  pricingSegment: PricingSegmentFragment;
  unit: 'min' | 'km';
};

const PriceInfo = ({price, pricingSegment, unit}: PriceInfoProps) => {
  const {t, language} = useTranslation();
  const style = useSheetStyle();

  const formatPrice = (
    segmentFragment: PricingSegmentFragment,
    language: Language,
  ) => {
    const rate = Number(segmentFragment.rate);
    return Number.isInteger(rate)
      ? rate
      : formatDecimalNumber(rate, language, 2);
  };

  return (
    <VehicleStat
      style={style.vehicleStat}
      primaryStat={`${formatPrice(pricingSegment, language)} kr/${unit}`}
      secondaryStat={t(ScooterTexts.pricingPlan.price(price))}
    />
  );
};

const useSheetStyle = StyleSheet.createThemeHook((theme) => ({
  vehicleStat: {
    marginBottom: theme.spacings.medium,
  },
}));
