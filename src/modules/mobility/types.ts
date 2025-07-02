export enum ShmoRequirementEnum {
  LOCATION = 'LOCATION',
  PAYMENT_CARD = 'PAYMENT_CARD',
  TERMS_AND_CONDITIONS = 'TERMS_AND_CONDITIONS',
  AGE_VERIFICATION = 'AGE_VERIFICATION',
}

export type ShmoRequirementType = {
  requirementCode: ShmoRequirementEnum;
  isLoading: boolean;
  isBlocking: boolean;
};
