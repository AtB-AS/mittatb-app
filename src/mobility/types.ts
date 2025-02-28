export enum ShmoRequirementEnum {
  LOCATION = 'LOCATION',
  PAYMENT_CARD = 'PAYMENT_CARD',
  TERMS_AND_CONDITIONS = 'TERMS_AND_CONDITIONS',
}

export type ShmoRequirementType = {
  requirementCode: ShmoRequirementEnum;
  isLoading: boolean;
  isBlocking: boolean;
};
