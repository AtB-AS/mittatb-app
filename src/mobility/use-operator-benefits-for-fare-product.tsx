import {PreassignedFareProductId} from '@atb/configuration/types';
import {useFareProductBenefitsQuery} from '@atb/mobility/queries/use-fare-product-benefits-query';
import {useOperators} from '@atb/mobility/use-operators';
import {OperatorBenefitType} from '@atb-as/config-specs/lib/mobility-operators';
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
  productId: PreassignedFareProductId | undefined,
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
          mobilityOperator.id === fareProductBenefit.operator,
      );
      const operatorBenefits = operator?.benefits.find((mobilityBenefit) =>
        fareProductBenefit.benefits.includes(mobilityBenefit.id),
      );
      if (!operatorBenefits) return;
      return {
        ...operatorBenefits,
        operatorId: fareProductBenefit.operator,
      };
    })
    .filter(isDefined);

  return {status, benefits};
};
