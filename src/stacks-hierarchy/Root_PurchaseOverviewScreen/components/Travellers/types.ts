import type {
  SupplementProductWithCount,
  UserProfileWithCount,
} from '@atb/modules/fare-contracts';

export type UserCountState = {
  userProfilesWithCount: UserProfileWithCount[];
  increment: (userTypeString: string) => void;
  decrement: (userTypeString: string) => void;
};

export type SupplementProductState = {
  supplementProductsWithCount: SupplementProductWithCount[];
  increment: (supplementProductId: string) => void;
  decrement: (supplementProductId: string) => void;
};
