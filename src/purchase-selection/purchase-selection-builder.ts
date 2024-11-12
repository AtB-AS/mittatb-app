import type {
  PurchaseSelectionBuilder,
  PurchaseSelectionBuilderInput,
  PurchaseSelectionEmptyBuilder,
  PurchaseSelectionType,
} from './types';
import {
  applyProductChange,
  getDefaultProduct,
  getDefaultUserProfiles,
  getDefaultZone,
  isSelectableProduct,
  isSelectableProfile,
  isSelectableZone,
  isValidSelection,
} from './utils';
import {isValidDateString} from '@atb/utils/date';

export const createEmptyBuilder = (
  input: PurchaseSelectionBuilderInput,
): PurchaseSelectionEmptyBuilder => {
  return {
    forType: (t) => {
      const selection = createSelectionForType(input, t);
      return createBuilder(input, selection);
    },
    fromSelection: (selection) => {
      const isValid = isValidSelection(input, selection);
      return createBuilder(
        input,
        isValid
          ? selection
          : createSelectionForType(input, selection.fareProductTypeConfig.type),
      );
    },
  };
};

const createBuilder = (
  input: PurchaseSelectionBuilderInput,
  selection: PurchaseSelectionType,
): PurchaseSelectionBuilder => {
  let currentSelection = selection;
  const builder: PurchaseSelectionBuilder = {
    product: (preassignedFareProduct) => {
      if (
        isSelectableProduct(input, currentSelection, preassignedFareProduct)
      ) {
        currentSelection = applyProductChange(
          input,
          currentSelection,
          preassignedFareProduct,
        );
      }

      return builder;
    },
    from: (fromPlace) => {
      const isZone = 'geometry' in fromPlace;
      if (
        isZone &&
        isSelectableZone(currentSelection.preassignedFareProduct, fromPlace)
      ) {
        currentSelection = {...currentSelection, fromPlace};
      } else if (!isZone) {
        currentSelection = {...currentSelection, fromPlace};
      }
      return builder;
    },
    to: (toPlace) => {
      const isZone = 'geometry' in toPlace;
      if (
        isZone &&
        isSelectableZone(currentSelection.preassignedFareProduct, toPlace)
      ) {
        currentSelection = {...currentSelection, toPlace};
      } else if (!isZone) {
        currentSelection = {...currentSelection, toPlace};
      }
      return builder;
    },
    userProfiles: (userProfilesWithCount) => {
      if (
        userProfilesWithCount.every((up) =>
          isSelectableProfile(currentSelection.preassignedFareProduct, up),
        )
      ) {
        currentSelection = {...currentSelection, userProfilesWithCount};
      }
      return builder;
    },
    date: (travelDate) => {
      if (!travelDate || isValidDateString(travelDate)) {
        currentSelection = {...currentSelection, travelDate};
      }
      return builder;
    },
    build: () => currentSelection,
  };

  return builder;
};

const createSelectionForType = (
  input: PurchaseSelectionBuilderInput,
  configType: string,
): PurchaseSelectionType => {
  const fareProductTypeConfig = input.fareProductTypeConfigs.find(
    (c) => c.type === configType,
  );
  if (!fareProductTypeConfig) throw Error();

  const preassignedFareProduct = getDefaultProduct(
    input,
    fareProductTypeConfig.type,
  );
  const tariffZone = getDefaultZone(input, preassignedFareProduct);
  const userProfilesWithCount = getDefaultUserProfiles(
    input,
    preassignedFareProduct,
  );

  return {
    fareProductTypeConfig,
    preassignedFareProduct,
    fromPlace: tariffZone,
    toPlace: tariffZone,
    userProfilesWithCount,
    travelDate: undefined,
  };
};
