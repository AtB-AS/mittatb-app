import {BonusProgramTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {
  OnboardingCarouselScreenProps,
  OnboardingScreenComponent,
  useNavigateToNextOnboardingCarouselScreen,
} from '@atb/modules/onboarding';
import {ThemedBundlingCityBikeActive} from '@atb/theme/ThemedAssets';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {bonusOnboardingId} from './config';

export type MoreTravelMethodsScreenProps =
  OnboardingCarouselScreenProps<'BonusOnboarding_MoreTravelMethodsScreen'>;

export const BonusOnboarding_MoreTravelMethodsScreen =
  ({}: MoreTravelMethodsScreenProps) => {
    const {t} = useTranslation();
    const navigateToNextScreen = useNavigateToNextOnboardingCarouselScreen(
      bonusOnboardingId,
      'BonusOnboarding_MoreTravelMethodsScreen',
    );

    return (
      <OnboardingScreenComponent
        illustration={<ThemedBundlingCityBikeActive height={160} />}
        title={t(BonusProgramTexts.onboarding.moreTravelMethods.title)}
        description={t(
          BonusProgramTexts.onboarding.moreTravelMethods.description,
        )}
        footerButton={{
          onPress: navigateToNextScreen,
          text: t(BonusProgramTexts.onboarding.moreTravelMethods.buttonText),
          expanded: true,
          rightIcon: {svg: ArrowRight},
        }}
        testID="buyTicketBonusOnboarding"
      />
    );
  };
