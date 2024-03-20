import {FareProductTypeConfig} from '@atb-as/config-specs';
import {UserProfileWithCount} from '@atb/fare-contracts';

export type TravelerOnBehalfOfProps = {
  setIsTravelerOnBehalfOfToggle: (onBehalfOfToggle: boolean) => void;
  isTravelerOnBehalfOfToggle: boolean;
};

export type UserCountState = {
  userProfilesWithCount: UserProfileWithCount[];
  addCount: (userTypeString: string) => void;
  removeCount: (userTypeString: string) => void;
  updateSelectable: (selectableUserProfiles: UserProfileWithCount[]) => void;
};

export type TravellerSelectionBottomSheetType = UserCountState &
  TravelerOnBehalfOfProps & {fareProductTypeConfig: FareProductTypeConfig};
