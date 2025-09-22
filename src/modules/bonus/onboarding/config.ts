import {OnboardingCarouselConfig} from '@atb/modules/onboarding';
import {BonusOnboarding_BuyTicketsScreen} from './BonusOnboarding_BuyTickets';
import {BonusOnboarding_DownloadScreen} from './BonusOnboarding_Download';
import {BonusOnboarding_MoreTravelMethodsScreen} from './BonusOnboarding_MoreTravelMethods';
import {BonusOnboarding_WelcomeScreen} from './BonusOnboarding_WelcomeScreen';

export const bonusPilotEnrollmentId = 'bonus-pilot';

export type BonusPilotEnrollmentScreenNames =
  | 'BonusOnboarding_WelcomeScreen'
  | 'BonusOnboarding_BuyTicketsScreen'
  | 'BonusOnboarding_MoreTravelMethodsScreen'
  | 'BonusOnboarding_DownloadScreen';

export const bonusEnrollmentConfig: OnboardingCarouselConfig = {
  id: bonusPilotEnrollmentId,
  enrollmentIds: ['bonus-pilot-a', 'bonus-pilot-b'],
  onboardingScreens: [
    {
      name: 'BonusOnboarding_WelcomeScreen',
      component: BonusOnboarding_WelcomeScreen,
    },
    {
      name: 'BonusOnboarding_BuyTicketsScreen',
      component: BonusOnboarding_BuyTicketsScreen,
    },
    {
      name: 'BonusOnboarding_MoreTravelMethodsScreen',
      component: BonusOnboarding_MoreTravelMethodsScreen,
    },
    {
      name: 'BonusOnboarding_DownloadScreen',
      component: BonusOnboarding_DownloadScreen,
    },
  ],
};
