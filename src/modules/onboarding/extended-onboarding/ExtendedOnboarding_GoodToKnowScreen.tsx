import {Onboarding4} from '@atb/assets/svg/color/images';
import {ExtendedOnboardingTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {extendedOnboardingId} from '.';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {OnboardingScreenComponent, useOnboardingCarouselNavigation} from '..';

export const ExtendedOnboarding_GoodToKnowScreen = () => {
  const {t} = useTranslation();

  const {navigateToNextScreen} = useOnboardingCarouselNavigation(
    extendedOnboardingId,
    'ExtendedOnboarding_GoodToKnowScreen',
  );

  return (
    <OnboardingScreenComponent
      illustration={<Onboarding4 height={200} />}
      title={t(ExtendedOnboardingTexts.goodToKnow.title)}
      description={t(ExtendedOnboardingTexts.goodToKnow.description)}
      footerButton={{
        onPress: navigateToNextScreen,
        text: t(ExtendedOnboardingTexts.goodToKnow.mainButton),
        expanded: true,
        rightIcon: {svg: ArrowRight},
        testID: 'nextButtonGoodToKnowOnboarding',
      }}
      testID="goodToKnowExtendedOnboarding"
    />
  );
};
