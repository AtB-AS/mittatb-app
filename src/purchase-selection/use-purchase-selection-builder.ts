import {useFirestoreConfiguration} from '@atb/configuration';
import {createEmptyBuilder} from './purchase-selection-builder.ts';
import {PurchaseSelectionBuilderInput} from './types.ts';

export const usePurchaseSelectionBuilder = () => {
  const {userProfiles} = useFirestoreConfiguration();
  const builderInput: PurchaseSelectionBuilderInput = {userProfiles};
  return createEmptyBuilder(builderInput);
};
