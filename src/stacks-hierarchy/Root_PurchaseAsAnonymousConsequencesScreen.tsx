import {useRemoteConfig} from '@atb/RemoteConfigContext';
import React from 'react';
import {AnonymousPurchaseConsequencesScreenComponent} from '@atb/anonymous-purchase-consequences-screen';
import {RootStackParamList, RootStackScreenProps} from './navigation-types';
import {
  filterActiveOrCanBeUsedFareContracts,
  useTicketingState,
} from '@atb/ticketing';
import {useMobileTokenContextState} from '@atb/mobile-token';

type Props = RootStackScreenProps<'Root_PurchaseAsAnonymousConsequencesScreen'>;

export const Root_PurchaseAsAnonymousConsequencesScreen = ({
  navigation,
}: Props) => {
  const {enable_vipps_login} = useRemoteConfig();

  const {fareContracts} = useTicketingState();
  const {now} = useMobileTokenContextState();
  const activeFareContracts = filterActiveOrCanBeUsedFareContracts(
    fareContracts,
    now,
  );
  const hasActiveFareContracts = activeFareContracts.length > 0;

  return (
    <AnonymousPurchaseConsequencesScreenComponent
      onPressLogin={() => {
        let screen: keyof RootStackParamList = 'Root_LoginPhoneInputScreen';
        if (hasActiveFareContracts) {
          screen = 'Root_LoginActiveFareContractWarningScreen';
        } else if (enable_vipps_login) {
          screen = 'Root_LoginOptionsScreen';
        }

        return navigation.navigate(screen, {});
      }}
      onPressContinueWithoutLogin={navigation.goBack}
      showHeader={true}
    />
  );
};
