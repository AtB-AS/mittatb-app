import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {CompositeScreenProps} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';

export type OnboardingStackParams = {
  Onboarding_WelcomeScreen: undefined;
  Onboarding_IntercomInfoScreen: undefined;
  Onboarding_AnonymousPurchaseConsequencesScreen: undefined;
  Onboarding_GoodToKnowScreen: undefined;
  Onboarding_AlsoGoodToKnowScreen: undefined;
};

export type OnboardingStackRootProps =
  RootStackScreenProps<'Root_OnboardingStack'>;

export type OnboardingScreenProps<T extends keyof OnboardingStackParams> =
  CompositeScreenProps<
    StackScreenProps<OnboardingStackParams, T>,
    OnboardingStackRootProps
  >;
