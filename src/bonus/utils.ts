import {FormFactor as FormFactorType} from '@atb/api/types/generated/mobility-types_v2';
import {
  BonusProductType,
  FormFactor as FormFactorSchema,
  MobilityOperatorType,
} from '@atb-as/config-specs/lib/mobility';

/**
 * Checks if a bonus product is active and should be displayed
 * @param bonusProduct - The bonus product to check
 * @returns {boolean} True if the bonus product is active, false otherwise
 */
export const isActive = (bonusProduct: BonusProductType) =>
  bonusProduct.isActive;

/**
 * Finds an active bonus product based on form factor and operator ID if it exists
 * @param bonusProducts - Array of bonus products to search through
 * @param operatorId - The ID of the mobility operator
 * @param formFactor - The form factor to match
 * @returns {BonusProductType | undefined} The matching bonus product if it exists, otherwise undefined
 *
 */
export const findRelevantBonusProduct = (
  bonusProducts: BonusProductType[] | undefined,
  operatorId: MobilityOperatorType['id'] | undefined,
  formFactor: FormFactorType,
) => {
  return bonusProducts?.find(
    (bonusProduct) =>
      bonusProduct.formFactors.includes(FormFactorSchema.parse(formFactor)) &&
      bonusProduct.operatorId == operatorId &&
      bonusProduct.isActive,
  );
};
