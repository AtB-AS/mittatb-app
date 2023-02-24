import {GeoJsonProperties} from 'geojson';
import {VehicleFragment} from '@atb/api/types/generated/fragments/vehicles';
import {PricingPlanFragment} from '@atb/api/types/generated/fragments/mobility-shared';

export const isVehicle = (
  properties: GeoJsonProperties | undefined,
): properties is VehicleFragment => properties?.__typename === 'Vehicle';

export const hasMultiplePricingPlans = (plan: PricingPlanFragment) =>
  (plan.perKmPricing && plan.perMinPricing) ||
  (plan.perKmPricing && plan.perKmPricing.length > 1) ||
  (plan.perMinPricing && plan.perMinPricing.length > 1);
