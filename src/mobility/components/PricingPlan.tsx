import React from 'react';
import {
  PricingPlanFragment,
  PricingSegmentFragment,
} from '@atb/api/types/generated/fragments/mobility-shared';
import {ScooterTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {MobilityStat} from '@atb/mobility/components/MobilityStat';
import {useTranslation} from '@atb/translations';
import {formatPriceToString} from '@atb/utils/numbers';
import {hasMultiplePricingPlans} from '@atb/mobility/utils';
import {OperatorBenefitIdType} from '@atb/configuration';
import {useIsEligibleForBenefit} from '@atb/mobility/use-is-eligible-for-benefit';
import {OperatorBenefitType} from '@atb-as/config-specs/lib/mobility';

type PricingPlanProps = {
  operator: string;
  plan: PricingPlanFragment;
  benefit?: OperatorBenefitType | undefined;
};
export const PricingPlan = ({operator, plan, benefit}: PricingPlanProps) => {
  const {t} = useTranslation();
  const {isUserEligibleForBenefit} = useIsEligibleForBenefit(benefit);
  const seAppForPrices = (
    <MobilityStat primaryStat={t(ScooterTexts.seeAppForPrices(operator))} />
  );
  if (hasMultiplePricingPlans(plan)) {
    return seAppForPrices;
  }

  if (plan.perMinPricing?.length) {
    return (
      <PriceInfo
        price={plan.price}
        pricingSegment={plan.perMinPricing[0]}
        unit="min"
        eligibleBenefit={isUserEligibleForBenefit ? benefit?.id : undefined}
      />
    );
  }

  if (plan.perKmPricing?.length) {
    return (
      <PriceInfo
        price={plan.price}
        pricingSegment={plan.perKmPricing[0]}
        unit="km"
        eligibleBenefit={isUserEligibleForBenefit ? benefit?.id : undefined}
      />
    );
  }

  return seAppForPrices;
};

type PriceInfoProps = {
  price: number;
  pricingSegment: PricingSegmentFragment;
  unit: 'min' | 'km';
  eligibleBenefit?: OperatorBenefitIdType;
};

const PriceInfo = ({
  price,
  pricingSegment,
  unit,
  eligibleBenefit,
}: PriceInfoProps) => {
  const {t, language} = useTranslation();

  return (
    <MobilityStat
      primaryStat={`${formatPriceToString(
        pricingSegment.rate,
        language,
      )} kr per ${unit}`}
      secondaryStat={t(ScooterTexts.pricingPlan.price(price, language))}
      secondaryStatStyle={
        price > 0 && eligibleBenefit === 'free-unlock'
          ? {textDecorationLine: 'line-through'}
          : undefined
      }
    />
  );
};
