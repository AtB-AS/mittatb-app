import {Onboarding5} from '@atb/assets/svg/color/images';
import {ExtendedOnboardingTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {
  OnboardingScreenComponent,
  useOnboardingNavigation,
} from '@atb/modules/onboarding';
import {Confirm} from '@atb/assets/svg/mono-icons/actions';

export const ExtendedOnboarding_AlsoGoodToKnowScreen = () => {
  const {t} = useTranslation();

  const {continueFromOnboardingSection} = useOnboardingNavigation();

  return (
    <OnboardingScreenComponent
      illustration={<Onboarding5 width={240} height={240} />}
      title={t(ExtendedOnboardingTexts.alsoGoodToKnow.title)}
      description={t(ExtendedOnboardingTexts.alsoGoodToKnow.description)}
      footerButton={{
        onPress: () => continueFromOnboardingSection('extendedOnboarding'),
        text: t(ExtendedOnboardingTexts.goodToKnow.mainButton),
        expanded: true,
        rightIcon: {svg: Confirm},
        testID: 'nextButtonAlsoGoodToKnowOnboarding',
      }}
      testID="goodToKnowExtendedOnboarding"
    />
  );
};
