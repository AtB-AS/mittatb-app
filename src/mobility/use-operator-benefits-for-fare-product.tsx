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

export const useOperatorBenefitsForFareProduct = (
  productId: PreassignedFareProductId | undefined,
): {
  status: UseQueryResult['status'];
  benefits?: OperatorBenefitType[];
} => {
  const {data, status} = useFareProductBenefitsQuery(productId);
  const {mobilityOperators} = useOperators();

  const benefits: OperatorBenefitType[] | undefined = data
    ?.map((d) =>
      mobilityOperators
        ?.find((m) => m.id === d.operator)
        ?.benefits.find((b) => d.benefits.includes(b.id)),
    )
    .filter(isDefined);

  return {status, benefits};
};

// function getEnumValue(str: string): FormFactor {
//   // Form factors from config and enum keys have different case.
//   // Makes converting the config strings to enum values a bit more cumbersome
//   const enumKey = Object.keys(FormFactor).find(
//     (key) => key.toLowerCase() === str.toLowerCase(),
//   ) as keyof typeof FormFactor | undefined;
//   return FormFactor[enumKey ?? 'Other'];
// }
