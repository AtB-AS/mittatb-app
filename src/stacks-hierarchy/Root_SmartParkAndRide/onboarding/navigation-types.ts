import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {StackParams} from '@atb/stacks-hierarchy/navigation-types';

export type SmartParkAndRideOnboardingStackParams = StackParams<{
  SmartParkAndRideOnboarding_WelcomeScreen: undefined;
  SmartParkAndRideOnboarding_BenefitsScreen: undefined;
}>;

export type SmartParkAndRideOnboardingStackRootProps =
  RootStackScreenProps<'Root_SmartParkAndRideOnboardingStack'>;
