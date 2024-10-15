import {
  PurchaseSelectionType,
  PurchaseSelectionBuilder,
  PurchaseSelectionBuilderInput,
  PurchaseSelectionEmptyBuilder,
} from './types';

export const createEmptyBuilder = (
  input: PurchaseSelectionBuilderInput,
): PurchaseSelectionEmptyBuilder => {
  return {
    forType: (t) => {
      const selection = createSelectionForType(input, t);
      return createBuilder(input, selection);
    },
  };
};

const createBuilder = (
  _input: PurchaseSelectionBuilderInput,
  _selection: PurchaseSelectionType,
): PurchaseSelectionBuilder => {
  return {
    product: () => {},
    from: () => {},
    to: () => {},
    userProfiles: () => {},
    date: () => {},
    build: () => {},
  } as PurchaseSelectionBuilder;
};

const createSelectionForType = (
  _input: PurchaseSelectionBuilderInput,
  _configType: string,
): PurchaseSelectionType => {
  // Here we add defaults logic which previously was in use-offer-defaults
  return {} as PurchaseSelectionType;
};
