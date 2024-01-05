import {PreassignedFareProductId} from '@atb/configuration/types';
import {useFareProductBenefitsQuery} from '@atb/mobility/queries/use-fare-product-benefits-query';
import {useOperators} from '@atb/mobility/use-operators';
import {MobilityOperatorType} from '@atb-as/config-specs/lib/mobility-operators';
import {FareProductBenefitType} from '@atb/mobility/api/api';
import {LanguageAndTextType} from '@atb-as/config-specs';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';

export type FormFactorTicketDescriptionPair = {
  formFactor: FormFactor;
  ticketDescription: LanguageAndTextType[] | undefined;
};

export const useOperatorBenefitsForFareProduct = (
  productId: PreassignedFareProductId | undefined,
) => {
  const {data, isLoading, isError} = useFareProductBenefitsQuery(productId);
  const {mobilityOperators} = useOperators();

  const benefits = findTicketDescriptionsByFormFactor(mobilityOperators, data);

  return {
    isLoading,
    isError,
    benefits,
  };
};

function findTicketDescriptionsByFormFactor(
  operators: MobilityOperatorType[] | undefined,
  fareBenefits: FareProductBenefitType[] | undefined,
): FormFactorTicketDescriptionPair[] {
  const formFactorTicketDescriptionPairs: FormFactorTicketDescriptionPair[] =
    [];

  if (!operators || !fareBenefits) return formFactorTicketDescriptionPairs;

  operators.forEach((operator) => {
    const matchingBenefit = fareBenefits.find(
      (benefit) => benefit.operator === operator.id,
    );

    if (matchingBenefit) {
      operator.benefits.forEach((benefit) => {
        if (matchingBenefit.benefits.includes(benefit.id)) {
          const ticketDescription = benefit.ticketDescription;
          operator.formFactors.forEach((formFactor) => {
            if (ticketDescription) {
              formFactorTicketDescriptionPairs.push({
                formFactor: getEnumValue(formFactor),
                ticketDescription,
              });
            }
          });
        }
      });
    }
  });

  return formFactorTicketDescriptionPairs;
}

function getEnumValue(str: string): FormFactor {
  // Form factors from config and enum keys have different case.
  // Makes converting the config strings to enum values a bit more cumbersome
  const enumKey = Object.keys(FormFactor).find(
    (key) => key.toLowerCase() === str.toLowerCase(),
  ) as keyof typeof FormFactor | undefined;
  return FormFactor[enumKey ?? 'Other'];
}
