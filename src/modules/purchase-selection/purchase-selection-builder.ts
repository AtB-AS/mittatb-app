import type {
  PurchaseSelectionBuilder,
  PurchaseSelectionBuilderInput,
  PurchaseSelectionEmptyBuilder,
  PurchaseSelectionType,
} from './types';
import {
  applyProductChange,
  getDefaultProduct,
  getDefaultStopPlaces,
  getDefaultUserProfiles,
  getDefaultZones,
  isSelectableProduct,
  isSelectableProfile,
  isSelectableZone,
  isValidSelection,
} from './utils';
import {isValidDateString} from '@atb/utils/date';
import {isSameDay} from 'date-fns';

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
    fromZone: (from) => {
      if (
        currentSelection.zones &&
        isSelectableZone(currentSelection.preassignedFareProduct, from)
      ) {
        currentSelection = {
          ...currentSelection,
          zones: {...currentSelection.zones, from},
        };
      }
      return builder;
    },
    toZone: (to) => {
      if (
        currentSelection.zones &&
        isSelectableZone(currentSelection.preassignedFareProduct, to)
      ) {
        currentSelection = {
          ...currentSelection,
          zones: {...currentSelection.zones, to},
        };
      }
      return builder;
    },
    fromStopPlace: (from) => {
      if (currentSelection.stopPlaces) {
        currentSelection = {
          ...currentSelection,
          stopPlaces: {...currentSelection.stopPlaces, from},
        };
      }
      return builder;
    },
    toStopPlace: (to) => {
      if (currentSelection.stopPlaces) {
        currentSelection = {
          ...currentSelection,
          stopPlaces: {...currentSelection.stopPlaces, to},
        };
      }
      return builder;
    },
    userProfiles: (userProfilesWithCount) => {
      const onlyWithActualCount = userProfilesWithCount.filter((u) => u.count);
      if (
        onlyWithActualCount.length &&
        onlyWithActualCount.every((p) =>
          isSelectableProfile(currentSelection.preassignedFareProduct, p),
        )
      ) {
        currentSelection = {
          ...currentSelection,
          userProfilesWithCount: onlyWithActualCount,
        };
      }
      return builder;
    },
    date: (travelDate) => {
      if (!travelDate || isValidDateString(travelDate)) {
        currentSelection = {...currentSelection, travelDate};
      }
      return builder;
    },
    legs: (legs) => {
      if (
        currentSelection.travelDate &&
        !legs.find((l) =>
          isSameDay(l.expectedStartTime, currentSelection.travelDate!),
        )
      ) {
        return builder;
      }
      currentSelection = {
        ...currentSelection,
        legs,
      };
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
  const zones = getDefaultZones(
    input,
    fareProductTypeConfig,
    preassignedFareProduct,
  );
  const stopPlaces = getDefaultStopPlaces(fareProductTypeConfig);
  const userProfilesWithCount = getDefaultUserProfiles(
    input,
    preassignedFareProduct,
  );

  return {
    fareProductTypeConfig,
    preassignedFareProduct,
    zones,
    stopPlaces,
    userProfilesWithCount,
    travelDate: undefined,
    legs: [],
  };
};
