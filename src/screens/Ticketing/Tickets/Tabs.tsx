import {useAuthState} from '@atb/auth';
import {RootStackParamList} from '@atb/navigation';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useState} from 'react';
import UpgradeSplash from './UpgradeSplash';
import {useAppState} from '@atb/AppContext';
import {RecentTickets} from '@atb/screens/Ticketing/Tickets/RecentTickets/RecentTickets';
import {AvailableTickets} from '@atb/screens/Ticketing/Tickets/AvailableTickets/AvailableTickets';
import {ActiveTickets} from './ActiveTickets/ActiveTickets';

export type TicketingScreenNavigationProp =
  StackNavigationProp<RootStackParamList>;

type Props = {
  navigation: TicketingScreenNavigationProp;
};

export const BuyTickets: React.FC<Props> = ({navigation}) => {
  const {must_upgrade_ticketing} = useRemoteConfig();
  const {authenticationType} = useAuthState();
  const appContext = useAppState();

  if (must_upgrade_ticketing) return <UpgradeSplash />;

  const onBuySingleTicket = () => {
    navigation.navigate('TicketPurchase', {
      screen: 'PurchaseOverview',
      params: {
        selectableProductType: 'single',
      },
    });
  };

  const onBuyPeriodTicket = () => {
    if (authenticationType === 'phone') {
      navigation.navigate('TicketPurchase', {
        screen: 'PurchaseOverview',
        params: {
          selectableProductType: 'period',
        },
      });
    } else {
      navigation.navigate('LoginInApp', {
        screen: 'LoginOnboardingInApp',
        params: {
          afterLogin: {
            routeName: 'TicketPurchase',
            routeParams: {selectableProductType: 'period'},
          },
        },
      });
    }
  };

  return (
    <>
      <RecentTickets />
      <AvailableTickets
        onBuySingleTicket={onBuySingleTicket}
        onBuyPeriodTicket={onBuyPeriodTicket}
      />
    </>
  );
};
