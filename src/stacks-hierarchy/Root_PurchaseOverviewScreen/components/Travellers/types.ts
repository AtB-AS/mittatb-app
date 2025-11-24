import type {
  BaggageProductWithCount,
  UserProfileWithCount,
} from '@atb/modules/fare-contracts';

export type UserCountState = {
  userProfilesWithCount: UserProfileWithCount[];
  increment: (userTypeString: string) => void;
  decrement: (userTypeString: string) => void;
};

export type BaggageCountState = {
  baggageProductsWithCount: BaggageProductWithCount[];
  increment: (baggageProductId: string) => void;
  decrement: (baggageProductId: string) => void;
};
