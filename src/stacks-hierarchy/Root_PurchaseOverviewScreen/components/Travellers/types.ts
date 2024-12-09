import {UserProfileWithCount} from '@atb/fare-contracts';

export type UserCountState = {
  userProfilesWithCount: UserProfileWithCount[];
  addCount: (userTypeString: string) => void;
  removeCount: (userTypeString: string) => void;
};
