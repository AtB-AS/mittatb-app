import type {
  SupplementProductWithCount,
  UserProfileWithCount,
} from '@atb/modules/fare-contracts';

export type UserCountState = {
  userProfilesWithCount: UserProfileWithCount[];
  increment: (userTypeString: string) => void;
  decrement: (userTypeString: string) => void;
};

export type BaggageProductState = {
  baggageProductsWithCount: SupplementProductWithCount[];
  increment: (supplementProductId: string) => void;
  decrement: (supplementProductId: string) => void;
};
