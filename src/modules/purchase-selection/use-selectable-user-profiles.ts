import {PreassignedFareProduct, UserProfile} from '@atb-as/config-specs';
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
