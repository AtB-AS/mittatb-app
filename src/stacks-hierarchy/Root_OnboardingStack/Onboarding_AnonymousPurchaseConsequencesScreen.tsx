import {useRemoteConfig} from '@atb/RemoteConfigContext';
import React from 'react';
import {AnonymousPurchaseConsequencesScreenComponent} from '@atb/anonymous-purchase-consequences-screen';
import {OnboardingScreenProps} from './navigation-types';
import {useAppState} from '@atb/AppContext';

type Props =
  OnboardingScreenProps<'Onboarding_AnonymousPurchaseConsequencesScreen'>;

export const Onboarding_AnonymousPurchaseConsequencesScreen = ({
  navigation,
}: Props) => {
  const {completeOnboarding} = useAppState();
  const {enable_vipps_login} = useRemoteConfig();

  return (
    <AnonymousPurchaseConsequencesScreenComponent
      onPressLogin={() => {
        navigation.popToTop();
        navigation.navigate(
          enable_vipps_login
            ? 'Root_LoginOptionsScreen'
            : 'Root_LoginPhoneInputScreen',
          {},
        );
      }}
      onPressContinueWithoutLogin={() => {
        completeOnboarding();
        navigation.popToTop();
      }}
      showHeader={false}
    />
  );
};
