import {useRemoteConfig} from '@atb/RemoteConfigContext';
import React from 'react';
import {AnonymousPurchaseConsequencesScreenComponent} from '@atb/anonymous-purchase-consequences-screen';
import {RootStackParamList, RootStackScreenProps} from './navigation-types';
import {
  filterActiveOrCanBeUsedFareContracts,
  useTicketingState,
} from '@atb/ticketing';
import {useTimeContextState} from '@atb/time';
import {TransitionPresets} from '@react-navigation/stack';
import {useCompleteUserCreationOnboardingAndEnterApp} from '@atb/utils/use-complete-user-creation-onboarding-and-enter-app';

type Props = RootStackScreenProps<'Root_PurchaseAsAnonymousConsequencesScreen'>;

export const Root_PurchaseAsAnonymousConsequencesScreen = ({
  navigation,
  route: {params},
}: Props) => {
  const {enable_vipps_login} = useRemoteConfig();

  const completeUserCreationOnboardingAndEnterApp =
    useCompleteUserCreationOnboardingAndEnterApp();

  const {fareContracts} = useTicketingState();
  const {serverNow} = useTimeContextState();
  const activeFareContracts = filterActiveOrCanBeUsedFareContracts(
    fareContracts,
    serverNow,
  );
  const hasActiveFareContracts = activeFareContracts.length > 0;

  const onPressLogin = () => {
    let screen: keyof RootStackParamList = 'Root_LoginPhoneInputScreen';
    if (hasActiveFareContracts) {
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
