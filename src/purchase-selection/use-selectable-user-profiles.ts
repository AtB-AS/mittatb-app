import {PreassignedFareProduct, UserProfile} from '@atb-as/config-specs';
import {useFirestoreConfiguration} from '@atb/configuration';
import {isSelectableProfile} from './utils';

export function useSelectableUserProfiles(
  product: PreassignedFareProduct,
): UserProfile[] {
  const {userProfiles} = useFirestoreConfiguration();
  return userProfiles.filter((profile) =>
    isSelectableProfile(product, profile),
  );
}
