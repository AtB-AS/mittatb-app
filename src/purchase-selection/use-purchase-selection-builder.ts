import {useFirestoreConfiguration} from '@atb/configuration';
import {createEmptyBuilder} from './purchase-selection-builder.ts';
import {PurchaseSelectionBuilderInput} from './types.ts';

export const usePurchaseSelectionBuilder = () => {
  const {userProfiles, preassignedFareProducts, tariffZones} =
    useFirestoreConfiguration();
  const builderInput: PurchaseSelectionBuilderInput = {
    userProfiles,
    preassignedFareProducts,
    tariffZones,
  };
  return createEmptyBuilder(builderInput);
};
