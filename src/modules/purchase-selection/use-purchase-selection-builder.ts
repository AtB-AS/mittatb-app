import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {createEmptyBuilder} from './purchase-selection-builder';
import type {PurchaseSelectionBuilderInput} from './types';
import {getCurrentCoordinatesGlobal} from '@atb/modules/geolocation';
import {usePreferencesContext} from '@atb/modules/preferences';
import {useTicketingContext} from '@atb/modules/ticketing';
import {APP_VERSION} from '@env';
import {useGetFareProductsQuery} from '@atb/modules/ticketing';

/**
 * Returns a purchase selection builder for creating or modifying a
 * `PurchaseSelectionType`. Note that no creation or modification should be done
 * without using this builder.
 *
 * The returned builder is not referentially stable, and should not be used in
 * hook dependency lists or passed around between screens. It is the purchase
 * selection that should be passed around and used in hooks.
 *
 * Since the builder should not be in hook dependency lists, it means that it
 * should be invoked by user actions and not as a side effect of state change.
 */
export const usePurchaseSelectionBuilder = () => {
  const {fareProductTypeConfigs, userProfiles, fareZones} =
    useFirestoreConfigurationContext();
  const {
    preferences: {defaultUserTypeString},
  } = usePreferencesContext();
  const {customerProfile} = useTicketingContext();
  const {data: preassignedFareProducts} = useGetFareProductsQuery();

  const builderInput: PurchaseSelectionBuilderInput = {
    fareProductTypeConfigs,
    userProfiles,
    preassignedFareProducts,
    fareZones,
    currentCoordinates: getCurrentCoordinatesGlobal(),
    defaultUserTypeString,
    customerProfile,
    appVersion: APP_VERSION,
  };
  return createEmptyBuilder(builderInput);
};
