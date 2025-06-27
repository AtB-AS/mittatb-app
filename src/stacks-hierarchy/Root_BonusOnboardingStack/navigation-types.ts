import {CompositeScreenProps, NavigationProp} from '@react-navigation/native';
import {StackParams} from '@atb/stacks-hierarchy/navigation-types';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackScreenProps} from '@atb/stacks-hierarchy';

export type BonusOnboardingStackParams = StackParams<{
  BonusOnboarding_WelcomeScreen: undefined;
  BonusOnboarding_BuyTicketsScreen: undefined;
  BonusOnboarding_MoreTravelMethodsScreen: undefined;
  BonusOnboarding_DownloadScreen: undefined;
}>;

export type BonusOnboardingNavigationProps =
  NavigationProp<BonusOnboardingStackParams>;

export type BonusOnboardingStackRootProps =
  RootStackScreenProps<'Root_BonusOnboardingStack'>;

export type BonusOnboardingScreenProps<
  T extends keyof BonusOnboardingStackParams,
> = CompositeScreenProps<
  StackScreenProps<BonusOnboardingStackParams, T>,
  BonusOnboardingStackRootProps
>;
