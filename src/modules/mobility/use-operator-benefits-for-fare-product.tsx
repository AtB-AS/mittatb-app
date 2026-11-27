import type {PreassignedFareProduct} from '@atb/modules/ticketing';
import {useFareProductBenefitsQuery} from './queries/use-fare-product-benefits-query';
import {useOperators} from './use-operators';
import {MobilityOperatorType} from '@atb-as/config-specs/lib/mobility';
import {UseQueryResult} from '@tanstack/react-query';
import type {VoucherBenefitType} from './api/api';

// The benefit texts come from the benefit service. Operator config only
// supplies the operator name and logo.
export type FareProductBenefitType = {
  operatorId: string;
  operatorName: string | undefined;
  brandAssets: MobilityOperatorType['brandAssets'];
  title: VoucherBenefitType['title'];
  description: VoucherBenefitType['description'];
};

export const useOperatorBenefitsForFareProduct = (
  productId: PreassignedFareProduct['id'] | undefined,
): {
  status: UseQueryResult['status'];
  benefits?: FareProductBenefitType[];
} => {
  const {data: fareProductBenefits, status} =
    useFareProductBenefitsQuery(productId);
  const {byId} = useOperators();

  const benefits: FareProductBenefitType[] | undefined =
    fareProductBenefits?.map((fareProductBenefit) => {
      const operator = byId(fareProductBenefit.operatorId);
      return {
        operatorId: fareProductBenefit.operatorId,
        operatorName: operator?.name,
        brandAssets: operator?.brandAssets,
        title: fareProductBenefit.title,
        description: fareProductBenefit.description,
      };
    });

  return {status, benefits};
};
