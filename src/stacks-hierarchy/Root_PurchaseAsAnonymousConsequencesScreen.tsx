import {useRemoteConfigContext} from '@atb/RemoteConfigContext';
import React from 'react';
import {AnonymousPurchaseConsequencesScreenComponent} from '@atb/anonymous-purchase-consequences-screen';
import {RootStackParamList, RootStackScreenProps} from './navigation-types';
import {TransitionPresets} from '@react-navigation/stack';
import {useCompleteUserCreationOnboardingAndEnterApp} from '@atb/utils/use-complete-user-creation-onboarding-and-enter-app';
import {useHasReservationOrActiveFareContract} from '@atb/ticketing';

type Props = RootStackScreenProps<'Root_PurchaseAsAnonymousConsequencesScreen'>;

export const Root_PurchaseAsAnonymousConsequencesScreen = ({
  navigation,
  route: {params},
}: Props) => {
  const {enable_vipps_login} = useRemoteConfigContext();
  const hasReservationOrActiveFareContract =
    useHasReservationOrActiveFareContract();
  const completeUserCreationOnboardingAndEnterApp =
    useCompleteUserCreationOnboardingAndEnterApp();

  const onPressLogin = () => {
    let screen: keyof RootStackParamList = 'Root_LoginPhoneInputScreen';
    if (hasReservationOrActiveFareContract) {
      screen = 'Root_LoginActiveFareContractWarningScreen';
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
          params?.transitionPreset === TransitionPresets.ModalSlideFromBottomIOS
            ? 'close'
            : 'back',
      }}
    />
  );
};
