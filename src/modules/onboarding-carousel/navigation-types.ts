import {CompositeScreenProps, NavigationProp} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {StackParams} from '@atb/stacks-hierarchy';
import {OnboardingCarouselScreenName} from './types';

export type OnboardingCarouselStackParams = StackParams<{
  [K in OnboardingCarouselScreenName]: undefined;
}>;

export type OnboardingCarouselNavigationProps =
  NavigationProp<OnboardingCarouselStackParams>;

export type OnboardingCarouselStackRootProps =
  RootStackScreenProps<'Root_OnboardingCarouselStack'>;

export type OnboardingCarouselScreenProps<
  T extends keyof OnboardingCarouselStackParams,
> = CompositeScreenProps<
  StackScreenProps<OnboardingCarouselStackParams, T>,
  OnboardingCarouselStackRootProps
>;
