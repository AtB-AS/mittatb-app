import {useRemoteConfigContext} from '@atb/RemoteConfigContext';
import React from 'react';
import {AnonymousPurchaseConsequencesScreenComponent} from '@atb/anonymous-purchase-consequences-screen';
import {RootStackParamList, RootStackScreenProps} from './navigation-types';
import {useCompleteUserCreationOnboardingAndEnterApp} from '@atb/utils/use-complete-user-creation-onboarding-and-enter-app';
import {useHasReservationOrAvailableFareContract} from '@atb/ticketing';

type Props = RootStackScreenProps<'Root_PurchaseAsAnonymousConsequencesScreen'>;

export const Root_PurchaseAsAnonymousConsequencesScreen = ({
  navigation,
  route: {params},
}: Props) => {
  const {enable_vipps_login} = useRemoteConfigContext();
  const hasReservationOrAvailableFareContract =
    useHasReservationOrAvailableFareContract();
  const completeUserCreationOnboardingAndEnterApp =
    useCompleteUserCreationOnboardingAndEnterApp();

  const onPressLogin = () => {
    let screen: keyof RootStackParamList = 'Root_LoginPhoneInputScreen';
    if (hasReservationOrAvailableFareContract) {
      screen = 'Root_LoginAvailableFareContractWarningScreen';
    } else if (enable_vipps_login) {
      screen = 'Root_LoginOptionsScreen';
      return navigation.navigate(screen, {showGoBack: true});
    }
    return navigation.navigate(screen, {});
  };

  return (
    <AnonymousPurchaseConsequencesScreenComponent
      onPressLogin={params.showLoginButton ? onPressLogin : undefined}
      onPressContinueWithoutLogin={completeUserCreationOnboardingAndEnterApp}
      leftButton={{
        type:
          params?.transitionOverride === 'slide-from-bottom' ? 'close' : 'back',
      }}
    />
  );
};
