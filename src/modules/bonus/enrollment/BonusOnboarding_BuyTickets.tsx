import {BonusProgramTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {EnrollmentOnboardingScreenProps} from '../../enrollment-onboarding/navigation-types';
import {OnboardingScreenComponent} from '@atb/modules/onboarding';
import {ThemedBonusTransaction} from '@atb/theme/ThemedAssets';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {useNavigateToNextEnrollmentOnboardingScreen} from '@atb/modules/enrollment-onboarding';
import {bonusPilotEnrollmentId} from './config';

export type BuyTicketsScreenProps =
  EnrollmentOnboardingScreenProps<'BonusOnboarding_BuyTicketsScreen'>;

export const BonusOnboarding_BuyTicketsScreen = ({}: BuyTicketsScreenProps) => {
  const {t} = useTranslation();

  const navigateToNextScreen = useNavigateToNextEnrollmentOnboardingScreen(
    bonusPilotEnrollmentId,
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
