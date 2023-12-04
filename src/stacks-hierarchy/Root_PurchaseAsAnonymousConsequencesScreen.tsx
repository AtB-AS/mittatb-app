import {useRemoteConfig} from '@atb/RemoteConfigContext';
import React from 'react';
import {AnonymousPurchaseConsequencesScreen} from '@atb/anonymous-purchase-consequences-screen';
import {RootStackParamList, RootStackScreenProps} from './navigation-types';
import {
  filterActiveOrCanBeUsedFareContracts,
  useTicketingState,
} from '@atb/ticketing';
import {useTimeContextState} from '@atb/time';
import {useAppState} from '@atb/AppContext';

type Props = RootStackScreenProps<'Root_PurchaseAsAnonymousConsequencesScreen'>;

export const Root_PurchaseAsAnonymousConsequencesScreen = ({
  navigation,
  route: {params},
}: Props) => {
  const {onboarded, completeOnboarding} = useAppState();
  const {enable_vipps_login} = useRemoteConfig();

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
    <AnonymousPurchaseConsequencesScreen
      onPressLogin={params.showLoginButton ? onPressLogin : undefined}
      onPressContinueWithoutLogin={() => {
        !onboarded && completeOnboarding();
        navigation.popToTop();
      }}
    />
  );
};
