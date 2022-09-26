import {RootStackScreenProps} from '@atb/navigation/types';
import {CompositeScreenProps} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';

export type MobileTokenTabParams = {
  FlexibilityInfoScreen: undefined;
  OptionsInfoScreen: undefined;
  TicketSafetyInfoScreen: undefined;
  MobileToken: undefined;
  Assistant: undefined;
  Nearest: undefined;
  Ticketing: undefined;
  Profile: undefined;
  SelectTravelToken: undefined;
};
// Can be used several places. Each place should be a condition.
export type MobileTokenOnboardingRootProps =
  RootStackScreenProps<'MobileTokenOnboarding'>;

export type MobileTokenOnboardingScreenProps<
  T extends keyof MobileTokenTabParams,
> = CompositeScreenProps<
  StackScreenProps<MobileTokenTabParams, T>,
  MobileTokenOnboardingRootProps
>;
