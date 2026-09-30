import type {PreReqType, ShmoPricingPlan} from '@atb/api/types/mobility';
import type {PriceAdjustmentType} from '@atb/api/types/benefit';

export type NavigateToPricingDetails = (
  pricingPlan: ShmoPricingPlan,
  priceAdjustments: PriceAdjustmentType[] | undefined,
) => void;

export type ShmoRequirementType = {
  requirementCode: PreReqType;
  isLoading: boolean;
  isBlocking: boolean;
};

export type FormattedRatePerUnit = {
  formattedRate: string;
  rate: number;
  perUnit: 'min' | 'km';
  interval: number;
};

export type VehicleSortOptions = 'currentRangeMeters' | '-currentRangeMeters';
