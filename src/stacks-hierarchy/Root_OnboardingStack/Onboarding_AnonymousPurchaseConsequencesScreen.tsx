import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {useFinishOnboarding} from '@atb/stacks-hierarchy/Root_OnboardingStack/use-finish-onboarding';
import React from 'react';
import {AnonymousPurchaseConsequencesScreenComponent} from '@atb/anonymous-purchase-consequences-screen';
import {OnboardingScreenProps} from './navigation-types';

type Props =
  OnboardingScreenProps<'Onboarding_AnonymousPurchaseConsequencesScreen'>;

export const Onboarding_AnonymousPurchaseConsequencesScreen = ({
  navigation,
}: Props) => {
  const finishOnboarding = useFinishOnboarding();
  const {enable_vipps_login} = useRemoteConfig();

  return (
    <AnonymousPurchaseConsequencesScreenComponent
      onPressLogin={() =>
        navigation.navigate('LoginInApp', {
          screen: enable_vipps_login ? 'LoginOptionsScreen' : 'PhoneInputInApp',
          params: {
            afterLogin: {
              screen: 'Root_TabNavigatorStack',
              params: {
                screen: 'TabNav_DashboardStack',
                params: {
                  screen: 'Dashboard_RootScreen',
                  params: {},
                },
              },
            },
          },
        })
      }
      onPressContinueWithoutLogin={finishOnboarding}
      showHeader={false}
    />
  );
};
