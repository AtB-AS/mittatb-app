import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {CompositeScreenProps} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {StackParams} from '@atb/stacks-hierarchy/navigation-types';

export type OnboardingStackParams = StackParams<{
  Onboarding_GoodToKnowScreen: undefined;
  Onboarding_AlsoGoodToKnowScreen: undefined;
}>;

export type OnboardingStackRootProps =
  RootStackScreenProps<'Root_OnboardingStack'>;

export type OnboardingScreenProps<T extends keyof OnboardingStackParams> =
  CompositeScreenProps<
    StackScreenProps<OnboardingStackParams, T>,
    OnboardingStackRootProps
  >;
