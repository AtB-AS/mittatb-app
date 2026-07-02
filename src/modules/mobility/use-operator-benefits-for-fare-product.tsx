import type {PreassignedFareProduct} from '@atb/modules/ticketing';
import {useFareProductBenefitsQuery} from './queries/use-fare-product-benefits-query';
import {useOperators} from './use-operators';
import {OperatorBenefitType} from '@atb-as/config-specs/lib/mobility';
import {LanguageAndTextType} from '@atb-as/config-specs';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {UseQueryResult} from '@tanstack/react-query';
import {isDefined} from '@atb/utils/presence';
import type {VoucherBenefitType} from './api/api';

export type FormFactorTicketDescriptionPair = {
  formFactor: FormFactor;
  ticketDescription: LanguageAndTextType[] | undefined;
};

// Operator config supplies the form-factor image and the detail-screen fields
// (callToAction, descriptionWhenActive, ...). The fare-contract card text
// (title/description) now comes from the benefit service instead of config.
export type FareProductBenefitType = {
  operatorId: string;
  title: VoucherBenefitType['title'];
  description: VoucherBenefitType['description'];
  illustrationName: VoucherBenefitType['illustrationName'];
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
          mobilityOperator.id === fareProductBenefit.operatorId,
      );
      const operatorBenefit = operator?.benefits.find((mobilityBenefit) =>
        fareProductBenefit.benefitTypes.includes(mobilityBenefit.id),
      );
      if (!operatorBenefit) return;
      return {
        ...operatorBenefit,
        operatorId: fareProductBenefit.operatorId,
        title: fareProductBenefit.title,
        description: fareProductBenefit.description,
        illustrationName: fareProductBenefit.illustrationName,
      };
    })
    .filter(isDefined);

  return {status, benefits};
};
