import {BonusProgramTexts, useTranslation} from '@atb/translations';
import React from 'react';

import {
  OnboardingCarouselScreenProps,
  OnboardingScreenComponent,
  useOnboardingCarouselNavigation,
} from '@atb/modules/onboarding';
import {ThemedBonusTransaction} from '@atb/theme/ThemedAssets';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {bonusOnboardingId} from './config';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';

export type BuyTicketsScreenProps =
  OnboardingCarouselScreenProps<'BonusOnboarding_BuyTicketsScreen'>;

export const BonusOnboarding_BuyTicketsScreen = ({
  navigation,
}: BuyTicketsScreenProps) => {
  const {t} = useTranslation();
  const focusRef = useFocusOnLoad(navigation);

  const {navigateToNextScreen} = useOnboardingCarouselNavigation(
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
      focusRef={focusRef}
    />
  );
};
