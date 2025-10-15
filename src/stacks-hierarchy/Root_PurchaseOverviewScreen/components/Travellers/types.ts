import type {
  UserProfileWithCount,
  SupplementaryProduct,
} from '@atb/modules/fare-contracts';

export type UserCountState = {
  userProfilesWithCount: UserProfileWithCount[];
  addCount: (userTypeString: string) => void;
  removeCount: (userTypeString: string) => void;
};

export type SupplementaryProductState = {
  supplementaryProducts: SupplementaryProduct[];
};
