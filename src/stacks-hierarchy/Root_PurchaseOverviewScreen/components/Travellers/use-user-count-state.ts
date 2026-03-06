import {
  useSelectableUserProfiles,
  type PurchaseSelectionType,
} from '@atb/modules/purchase-selection';
import {UserProfile} from '@atb/modules/configuration';
import {useUniqueCountState} from '@atb/utils/unique-with-count';
import {useAuthContext} from '@atb/modules/auth';

const findUserProfile = (a: UserProfile, b: UserProfile) => a.id === b.id;

export function useUserCountState(selection: PurchaseSelectionType) {
  const selectableUserProfiles = useSelectableUserProfiles(
    selection.preassignedFareProduct,
  );

  const {authenticationType} = useAuthContext();
  const upls = selection.preassignedFareProduct.limitations.userProfiles;

  const initialUserProfilesWithCount = selectableUserProfiles.map((u) => {
    //const upLimitation = upls.find((upl) => upl.targetRef === u.id);
    return {
      ...u,
      count:
        selection.userProfilesWithCount.find(({id}) => id === u.id)?.count ?? 0,
      limit: 5,
      /*authenticationType === 'phone'
          ? upLimitation?.limitPerOrderLoggedIn
          : upLimitation?.limitPerOrderLoggedOut*/
    };
  });

  return useUniqueCountState<UserProfile>(
    initialUserProfilesWithCount,
    findUserProfile,
  );
}
