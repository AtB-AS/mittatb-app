import {ConfirmCodeInOnboardingRouteParams} from '@atb/login/in-onboarding/ConfirmCodeInOnboarding';
import {LoginInAppStackParams} from '@atb/login/types';
import {RootStackScreenProps} from '@atb/navigation/types';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';

export type OnboardingStackParams = {
  WelcomeScreenLogin: undefined;
  WelcomeScreenWithoutLogin: undefined;
  IntercomInfo: undefined;
  PhoneInputInOnboarding: undefined;
  ConfirmCodeInOnboarding: ConfirmCodeInOnboardingRouteParams;
  SkipLoginWarning: undefined;
  ConsequencesFromOnboarding: undefined;
  LoginInApp: NavigatorScreenParams<LoginInAppStackParams>;
};

export type OnboardingStackRootProps = RootStackScreenProps<'Onboarding'>;

export type OnboardingScreenProps<T extends keyof OnboardingStackParams> =
  CompositeScreenProps<
    StackScreenProps<OnboardingStackParams, T>,
    OnboardingStackRootProps
  >;
