import type {
  SupplementProductsWithCount,
  UserProfileWithCount,
} from '@atb/modules/fare-contracts';

export type UserCountState = {
  userProfilesWithCount: UserProfileWithCount[];
  increment: (userTypeString: string) => void;
  decrement: (userTypeString: string) => void;
};

export type SupplementProductState = {
  supplementProductsWithCount: SupplementProductsWithCount;
  increment: (supplementProductId: string) => void;
  decrement: (supplementProductId: string) => void;
};
