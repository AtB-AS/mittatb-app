import {CompositeScreenProps, NavigationProp} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {StackParams} from '@atb/stacks-hierarchy';
import {EnrollmentOnboardingScreenName} from './types';

export type EnrollmentOnboardingStackParams = StackParams<{
  [K in EnrollmentOnboardingScreenName]: undefined;
}>;

export type EnrollmentOnboardingNavigationProps =
  NavigationProp<EnrollmentOnboardingStackParams>;

export type EnrollmentOnboardingStackRootProps =
  RootStackScreenProps<'Root_EnrollmentOnboardingStack'>;

export type EnrollmentOnboardingScreenProps<
  T extends keyof EnrollmentOnboardingStackParams,
> = CompositeScreenProps<
  StackScreenProps<EnrollmentOnboardingStackParams, T>,
  EnrollmentOnboardingStackRootProps
>;
