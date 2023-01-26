import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {CompositeScreenProps} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';

export type MobileTokenOnboardingParams = {
  MobileTokenOnboarding_FlexibilityInfoScreen: undefined;
  MobileTokenOnboarding_OptionsInfoScreen: undefined;
  MobileTokenOnboarding_TicketSafetyInfoScreen: undefined;
  MobileTokenOnboarding_CurrentTokenScreen: undefined;
  MobileTokenOnboarding_SelectTravelTokenScreen: undefined;
};

export type MobileTokenOnboardingRootProps =
  RootStackScreenProps<'Root_MobileTokenOnboardingStack'>;

export type MobileTokenOnboardingScreenProps<
  T extends keyof MobileTokenOnboardingParams,
> = CompositeScreenProps<
  StackScreenProps<MobileTokenOnboardingParams, T>,
  MobileTokenOnboardingRootProps
>;
