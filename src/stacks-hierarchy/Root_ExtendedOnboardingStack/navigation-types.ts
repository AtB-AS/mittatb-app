import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {CompositeScreenProps} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {StackParams} from '@atb/stacks-hierarchy/navigation-types';

export type ExtendedOnboardingStackParams = StackParams<{
  ExtendedOnboarding_GoodToKnowScreen: undefined;
  ExtendedOnboarding_AlsoGoodToKnowScreen: undefined;
}>;

export type ExtendedOnboardingStackRootProps =
  RootStackScreenProps<'Root_ExtendedOnboardingStack'>;

export type ExtendedOnboardingScreenProps<
  T extends keyof ExtendedOnboardingStackParams,
> = CompositeScreenProps<
  StackScreenProps<ExtendedOnboardingStackParams, T>,
  ExtendedOnboardingStackRootProps
>;
