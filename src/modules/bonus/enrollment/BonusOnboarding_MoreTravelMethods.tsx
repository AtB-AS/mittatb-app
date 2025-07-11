import {BonusProgramTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {EnrollmentOnboardingScreenProps} from '../../enrollment-onboarding/navigation-types';
import {OnboardingScreenComponent} from '@atb/modules/onboarding';
import {ThemedBundlingCityBikeActive} from '@atb/theme/ThemedAssets';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {useEnrollmentOnboarding} from '@atb/modules/enrollment-onboarding';

export type MoreTravelMethodsScreenProps =
  EnrollmentOnboardingScreenProps<'BonusOnboarding_MoreTravelMethodsScreen'>;

export const BonusOnboarding_MoreTravelMethodsScreen =
  ({}: MoreTravelMethodsScreenProps) => {
    const {t} = useTranslation();
    const {navigateToNextScreen} = useEnrollmentOnboarding(
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
          onPress: navigateToNextScreen,
          text: t(BonusProgramTexts.onboarding.moreTravelMethods.buttonText),
          expanded: true,
          rightIcon: {svg: ArrowRight},
        }}
        testID="buyTicketBonusOnboarding"
      />
    );
  };
