import {useAuthState} from '@atb/auth';
import {RootStackParamList} from '@atb/navigation';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {ScrollView} from 'react-native';
import UpgradeSplash from './UpgradeSplash';
import {useAppState} from '@atb/AppContext';
import {AvailableTickets} from '@atb/screens/Ticketing/Tickets/AvailableTickets/AvailableTickets';
import {RecentTickets} from './RecentTickets/RecentTickets';

export type TicketingScreenNavigationProp =
  StackNavigationProp<RootStackParamList>;

type Props = {
  navigation: TicketingScreenNavigationProp;
};

export const BuyTickets: React.FC<Props> = ({navigation}) => {
  const {must_upgrade_ticketing, enable_recent_tickets} = useRemoteConfig();
  const appContext = useAppState();
  const {abtCustomerId, authenticationType} = useAuthState();
  const isSignedInAsAbtCustomer = !!abtCustomerId;

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

  return isSignedInAsAbtCustomer ? (
    <ScrollView contentContainerStyle={{flex: 1}}>
      {enable_recent_tickets && <RecentTickets />}
      <AvailableTickets
        onBuySingleTicket={onBuySingleTicket}
        onBuyPeriodTicket={onBuyPeriodTicket}
      />
    </ScrollView>
  ) : null;
};
