import {BonusProgramTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {
  OnboardingCarouselScreenProps,
  OnboardingScreenComponent,
  useOnboardingCarouselNavigation,
} from '@atb/modules/onboarding';
import {ThemedBundlingCityBikeActive} from '@atb/theme/ThemedAssets';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {bonusOnboardingId} from './config';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';

export type MoreTravelMethodsScreenProps =
  OnboardingCarouselScreenProps<'BonusOnboarding_MoreTravelMethodsScreen'>;

export const BonusOnboarding_MoreTravelMethodsScreen = ({
  navigation,
}: MoreTravelMethodsScreenProps) => {
  const focusRef = useFocusOnLoad(navigation);
  const {t} = useTranslation();
  const {navigateToNextScreen} = useOnboardingCarouselNavigation(
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
      focusRef={focusRef}
    />
  );
};
