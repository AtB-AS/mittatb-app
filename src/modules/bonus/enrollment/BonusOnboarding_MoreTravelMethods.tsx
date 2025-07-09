import {BonusProgramTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {EnrollmentOnboardingScreenProps} from '../../enrollment-onboarding/navigation-types';
import {OnboardingScreenComponent} from '@atb/modules/onboarding';
import {ThemedBundlingCityBikeActive} from '@atb/theme/ThemedAssets';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {useNavigateToNextEnrollmentOnboardingScreen} from '../../enrollment-onboarding/use-navigate-to-next-onboarding-screen';
import {bonusPilotEnrollmentId} from './config';

export type MoreTravelMethodsScreenProps =
  EnrollmentOnboardingScreenProps<'BonusOnboarding_MoreTravelMethodsScreen'>;

export const BonusOnboarding_MoreTravelMethodsScreen =
  ({}: MoreTravelMethodsScreenProps) => {
    const {t} = useTranslation();

    const navigateToNext = useNavigateToNextEnrollmentOnboardingScreen(
      bonusPilotEnrollmentId,
      BonusOnboarding_MoreTravelMethodsScreen.name,
    );

    return (
      <OnboardingScreenComponent
        illustration={<ThemedBundlingCityBikeActive height={160} />}
        title={t(BonusProgramTexts.onboarding.moreTravelMethods.title)}
        description={t(
          BonusProgramTexts.onboarding.moreTravelMethods.description,
        )}
        footerButton={{
          onPress: navigateToNext,
          text: t(BonusProgramTexts.onboarding.moreTravelMethods.buttonText),
          expanded: true,
          rightIcon: {svg: ArrowRight},
        }}
        testID="buyTicketBonusOnboarding"
      />
    );
  };
