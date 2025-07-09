import {bonusPilotEnrollmentId} from '../bonus';

export type EnrollmentOnboardingScreenName =
  | 'BonusOnboarding_WelcomeScreen'
  | 'BonusOnboarding_BuyTicketsScreen'
  | 'BonusOnboarding_MoreTravelMethodsScreen'
  | 'BonusOnboarding_DownloadScreen';

export type EnrollmentOnboardingConfigId = typeof bonusPilotEnrollmentId;

export type EnrollmentOnboardingConfig = {
  id: EnrollmentOnboardingConfigId;
  enrollmentIds: string[];
  onboardingScreens: {
    name: EnrollmentOnboardingScreenName;
    component: React.ComponentType<any>;
  }[];
};
