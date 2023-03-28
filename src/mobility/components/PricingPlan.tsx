import React from 'react';
import {
  PricingPlanFragment,
  PricingSegmentFragment,
} from '@atb/api/types/generated/fragments/mobility-shared';
import {ScooterTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {VehicleStat} from '@atb/mobility/components/VehicleStat';
import {Language, useTranslation} from '@atb/translations';
import {formatDecimalNumber} from '@atb/utils/numbers';
import {hasMultiplePricingPlans} from '@atb/mobility/utils';

type PricingPlanProps = {
  operator: string;
  plan: PricingPlanFragment;
};
export const PricingPlan = ({operator, plan}: PricingPlanProps) => {
  const {t} = useTranslation();
  const seAppForPrices = (
    <VehicleStat primaryStat={t(ScooterTexts.seeAppForPrices(operator))} />
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
      primaryStat={`${formatPrice(pricingSegment, language)} kr/${unit}`}
      secondaryStat={t(ScooterTexts.pricingPlan.price(price))}
    />
  );
};
