import {BonusProgramTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {
  BonusOnboardingNavigationProps,
  BonusOnboardingScreenProps,
} from './navigation-types';
import {OnboardingScreenComponent} from '@atb/modules/onboarding';
import {ThemedBundlingCityBikeActive} from '@atb/theme/ThemedAssets';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {useNavigation} from '@react-navigation/native';

export type MoreTravelMethodsScreenProps =
  BonusOnboardingScreenProps<'BonusOnboarding_MoreTravelMethodsScreen'>;

export const BonusOnboarding_MoreTravelMethodsScreen =
  ({}: MoreTravelMethodsScreenProps) => {
    const {t} = useTranslation();
    const navigation = useNavigation<BonusOnboardingNavigationProps>();

    return (
      <OnboardingScreenComponent
        illustration={<ThemedBundlingCityBikeActive height={170} />}
        title={t(BonusProgramTexts.onBoarding.moreTravelMethods.title)}
        description={t(
          BonusProgramTexts.onBoarding.moreTravelMethods.description,
        )}
        buttonText={t(
          BonusProgramTexts.onBoarding.moreTravelMethods.buttonText,
        )}
        buttonOnPress={() =>
          navigation.navigate('BonusOnboarding_DownloadScreen')
        }
        buttonRightIcon={{svg: ArrowRight}}
        testID="buyTicketBonusOnboarding"
      />
    );
  };
