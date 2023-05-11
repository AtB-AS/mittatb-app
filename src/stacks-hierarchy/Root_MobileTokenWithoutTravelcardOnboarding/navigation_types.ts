import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {CompositeScreenProps} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';

export type MobileTokenWithoutTravelcardOnboardingParams = {
  MobileTokenWithoutTravelcardOnboarding_FlexibilityInfoScreen: undefined;
  MobileTokenWithoutTravelcardOnboarding_OptionsInfoScreen: undefined;
  MobileTokenWithoutTravelcardOnboarding_TicketSafetyInfoScreen: undefined;
  MobileTokenWithoutTravelcardOnboarding_CurrentTokenScreen: undefined;
  MobileTokenWithoutTravelcardOnboarding_SelectTravelTokenScreen: undefined;
};

export type MobileTokenWithoutTravelcardOnboardingRootProps =
  RootStackScreenProps<'Root_MobileTokenWithoutTravelcardOnboardingStack'>;

export type MobileTokenWithoutTravelcardOnboardingScreenProps<
  T extends keyof MobileTokenWithoutTravelcardOnboardingParams,
> = CompositeScreenProps<
  StackScreenProps<MobileTokenWithoutTravelcardOnboardingParams, T>,
  MobileTokenWithoutTravelcardOnboardingRootProps
>;
