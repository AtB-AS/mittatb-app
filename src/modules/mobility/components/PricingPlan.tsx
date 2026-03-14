import React from 'react';
import {
  PricingPlanFragment,
  PricingSegmentFragment,
} from '@atb/api/types/generated/fragments/mobility-shared';
import {ScooterTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {MobilityStat} from './MobilityStat';
import {useTranslation} from '@atb/translations';
import {hasMultiplePricingPlans} from '../utils';
import {OperatorBenefitIdType} from '@atb/modules/configuration';
import {useIsEligibleForBenefit} from '../use-is-eligible-for-benefit';
import {OperatorBenefitType} from '@atb-as/config-specs/lib/mobility';
import {formatNumberToString} from '@atb-as/utils';
import {getCurrencySymbol} from '@atb/translations/currency';

type PricingPlanProps = {
  operator: string;
  plan: PricingPlanFragment;
  benefit?: OperatorBenefitType | undefined;
};
export const PricingPlan = ({operator, plan, benefit}: PricingPlanProps) => {
  const {t} = useTranslation();
  const {isUserEligibleForBenefit} = useIsEligibleForBenefit(benefit);

  const seeAppForPrices = (
    <MobilityStat text={t(ScooterTexts.seeAppForPrices(operator))} />
  );
  if (hasMultiplePricingPlans(plan)) {
    return seeAppForPrices;
  }

  if (plan.perMinPricing?.length) {
    return (
      <PriceInfo
        price={plan.price}
        pricingSegment={plan.perMinPricing[0]}
        unit="min"
        currency={plan.currency}
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
        currency={plan.currency}
        eligibleBenefit={isUserEligibleForBenefit ? benefit?.id : undefined}
      />
    );
  }

  return seeAppForPrices;
};

type PriceInfoProps = {
  price: number;
  pricingSegment: PricingSegmentFragment;
  unit: 'min' | 'km';
  currency?: string;
  eligibleBenefit?: OperatorBenefitIdType;
};

const PriceInfo = ({
  price,
  pricingSegment,
  unit,
  currency,
  eligibleBenefit,
}: PriceInfoProps) => {
  const {t, language} = useTranslation();
  const primaryText = `${formatNumberToString(
    pricingSegment.rate,
    language,
  )} ${getCurrencySymbol(currency)} per ${unit}`;
  const secondaryText = t(ScooterTexts.pricingPlan.price(price, language));
  const hasStrikethrough = price > 0 && eligibleBenefit === 'free-unlock';

  return (
    <MobilityStat
      text={`**${primaryText}** ${hasStrikethrough ? `~~${secondaryText}~~` : secondaryText}`}
    />
  );
};
