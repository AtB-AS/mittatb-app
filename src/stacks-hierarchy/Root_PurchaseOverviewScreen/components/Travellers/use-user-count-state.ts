import {
  useSelectableUserProfiles,
  type PurchaseSelectionType,
} from '@atb/modules/purchase-selection';
import {UserProfile} from '@atb/modules/configuration';
import {useUniqueCountState} from '@atb/utils/unique-with-count';

const findUserProfile = (a: UserProfile, b: UserProfile) => a.id === b.id;

export function useUserCountState(selection: PurchaseSelectionType) {
  const selectableUserProfiles = useSelectableUserProfiles(
    selection.preassignedFareProduct,
  );
  const initialUserProfilesWithCount = selectableUserProfiles.map((u) => ({
    ...u,
    count:
      selection.userProfilesWithCount.find(({id}) => id === u.id)?.count ?? 0,
  }));

  return useUniqueCountState<UserProfile>(
    initialUserProfilesWithCount,
    findUserProfile,
  );
}
