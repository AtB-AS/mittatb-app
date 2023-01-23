import {useRemoteConfig} from '@atb/RemoteConfigContext';
import React from 'react';
import {AnonymousPurchaseConsequencesScreenComponent} from '@atb/anonymous-purchase-consequences-screen';
import {PurchaseScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/Purchase/types';

type Props =
  PurchaseScreenProps<'Purchase_AnonymousPurchaseConsequencesScreen'>;

export const Purchase_AnonymousPurchaseConsequencesScreen = ({
  navigation,
}: Props) => {
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
                screen: 'TabNav_TicketingStack',
                params: {
                  screen: 'PurchaseTab',
                },
              },
            },
          },
        })
      }
      onPressContinueWithoutLogin={navigation.goBack}
      showHeader={true}
    />
  );
};
