import {BonusProgramTexts, useTranslation} from '@atb/translations';
import React from 'react';

import {
  OnboardingCarouselScreenProps,
  OnboardingScreenComponent,
  useNavigateToNextOnboardingCarouselScreen,
} from '@atb/modules/onboarding';
import {ThemedBonusTransaction} from '@atb/theme/ThemedAssets';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {bonusOnboardingId} from './config';

export type BuyTicketsScreenProps =
  OnboardingCarouselScreenProps<'BonusOnboarding_BuyTicketsScreen'>;

export const BonusOnboarding_BuyTicketsScreen = ({}: BuyTicketsScreenProps) => {
  const {t} = useTranslation();

  const navigateToNextScreen = useNavigateToNextOnboardingCarouselScreen(
    bonusOnboardingId,
    'BonusOnboarding_BuyTicketsScreen',
  );

  return (
    <OnboardingScreenComponent
      illustration={<ThemedBonusTransaction height={150} />}
      title={t(BonusProgramTexts.onboarding.buyTickets.title)}
      description={t(BonusProgramTexts.onboarding.buyTickets.description)}
      footerButton={{
        onPress: navigateToNextScreen,
        text: t(BonusProgramTexts.onboarding.buyTickets.buttonText),
        expanded: true,
        rightIcon: {svg: ArrowRight},
      }}
      testID="buyTicketBonusOnboarding"
    />
  );
};
