import {BonusProgramTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {
  BonusOnboardingNavigationProps,
  BonusOnboardingScreenProps,
} from './navigation-types';
import {OnboardingScreenComponent} from '@atb/modules/onboarding';
import {ThemedBonusTransaction} from '@atb/theme/ThemedAssets';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {useNavigation} from '@react-navigation/native';

export type BuyTicketsScreenProps =
  BonusOnboardingScreenProps<'BonusOnboarding_BuyTicketsScreen'>;

export const BonusOnboarding_BuyTicketsScreen = ({}: BuyTicketsScreenProps) => {
  const {t} = useTranslation();
  const navigation = useNavigation<BonusOnboardingNavigationProps>();

  return (
    <OnboardingScreenComponent
      illustration={<ThemedBonusTransaction height={150} />}
      title={t(BonusProgramTexts.onboarding.buyTickets.title)}
      description={t(BonusProgramTexts.onboarding.buyTickets.description)}
      footerButton={{
        onPress: () =>
          navigation.navigate('BonusOnboarding_MoreTravelMethodsScreen'),
        text: t(BonusProgramTexts.onboarding.buyTickets.buttonText),
        expanded: true,
        rightIcon: {svg: ArrowRight},
      }}
      testID="buyTicketBonusOnboarding"
    />
  );
};
