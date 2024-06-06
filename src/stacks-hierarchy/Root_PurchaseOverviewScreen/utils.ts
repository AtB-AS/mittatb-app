import {TravellerSelectionMode} from '@atb-as/config-specs';
import {UserProfile} from '@atb/configuration';

export const isUserProfileSelectable = (
  travellerSelectionMode: TravellerSelectionMode,
  selectableTravellers: UserProfile[],
) =>
  !(
    travellerSelectionMode === `none` ||
    (travellerSelectionMode === `single` && selectableTravellers.length <= 1)
  );
