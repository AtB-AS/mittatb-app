import {PreassignedFareProduct} from '@atb/modules/configuration';
import {useFareProductBenefitsQuery} from './queries/use-fare-product-benefits-query';
import {useOperators} from './use-operators';
import {OperatorBenefitType} from '@atb-as/config-specs/lib/mobility';
import {LanguageAndTextType} from '@atb-as/config-specs';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {UseQueryResult} from '@tanstack/react-query';
import {isDefined} from '@atb/utils/presence';

export type FormFactorTicketDescriptionPair = {
  formFactor: FormFactor;
  ticketDescription: LanguageAndTextType[] | undefined;
};

export type FareProductBenefitType = {
  operatorId: string;
} & OperatorBenefitType;

export const useOperatorBenefitsForFareProduct = (
  productId: PreassignedFareProduct['id'] | undefined,
): {
  status: UseQueryResult['status'];
  benefits?: FareProductBenefitType[];
} => {
  const {data: fareProductBenefits, status} =
    useFareProductBenefitsQuery(productId);
  const {mobilityOperators} = useOperators();

  const benefits: FareProductBenefitType[] | undefined = fareProductBenefits
    ?.map((fareProductBenefit) => {
      const operator = mobilityOperators?.find(
        (mobilityOperator) =>
          mobilityOperator.id === fareProductBenefit.operator_id,
      );
      const operatorBenefits = operator?.benefits.find((mobilityBenefit) =>
        fareProductBenefit.benefit_types.includes(mobilityBenefit.id),
      );
      if (!operatorBenefits) return;
      return {
        ...operatorBenefits,
        operatorId: fareProductBenefit.operator_id,
      };
    })
    .filter(isDefined);

  return {status, benefits};
};
