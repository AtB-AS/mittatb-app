import type {UserProfile} from '@atb-as/config-specs';
import type {PreassignedFareProduct} from '@atb/modules/ticketing';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {isSelectableProfile} from './utils';

export function useSelectableUserProfiles(
  product: PreassignedFareProduct,
): UserProfile[] {
  const {userProfiles} = useFirestoreConfigurationContext();
  return userProfiles.filter((profile) =>
    isSelectableProfile(product, profile),
  );
}
