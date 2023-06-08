import {useRemoteConfig} from '@atb/RemoteConfigContext';
import React from 'react';
import {AnonymousPurchaseConsequencesScreenComponent} from '@atb/anonymous-purchase-consequences-screen';
import {RootStackScreenProps} from './navigation-types';

type Props = RootStackScreenProps<'Root_PurchaseAsAnonymousConsequencesScreen'>;

export const Root_PurchaseAsAnonymousConsequencesScreen = ({
  navigation,
}: Props) => {
  const {enable_vipps_login} = useRemoteConfig();

  return (
    <AnonymousPurchaseConsequencesScreenComponent
      onPressLogin={() =>
        navigation.navigate(
          enable_vipps_login
            ? 'Root_LoginOptionsScreen'
            : 'Root_LoginPhoneInputScreen',
          {
            afterLogin: {
              screen: 'Root_TabNavigatorStack',
              params: {
                screen: 'TabNav_TicketingStack',
                params: {
                  screen: 'Ticketing_RootScreen',
                  params: {
                    screen: 'TicketTabNav_PurchaseTabScreen',
                  },
                },
              },
            },
          },
        )
      }
      onPressContinueWithoutLogin={navigation.goBack}
      showHeader={true}
    />
  );
};
