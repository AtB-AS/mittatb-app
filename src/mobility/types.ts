export enum ShmoRequirementEnum {
  LOCATION = 'LOCATION',
  PAYMENT_CARD = 'PAYMENT_CARD',
  TERMS_AND_CONDITIONS = 'TERMS_AND_CONDITIONS',
}

export type ShmoRequirementType = {
  requirement: ShmoRequirementEnum;
  isLoading: boolean;
  isBlocking: boolean;
};
