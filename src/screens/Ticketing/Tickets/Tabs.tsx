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
import {useTheme} from '@atb/theme';

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
  const {theme} = useTheme();

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

  const onBuyHour24Ticket = () => {
    navigation.navigate('TicketPurchase', {
      screen: 'PurchaseOverview',
      params: {
        selectableProductType: 'hour24',
      },
    });
  };

  return isSignedInAsAbtCustomer ? (
    <ScrollView
      style={{backgroundColor: theme.static.background.background_2.background}}
    >
      {enable_recent_tickets && <RecentTickets />}
      <AvailableTickets
        onBuySingleTicket={onBuySingleTicket}
        onBuyPeriodTicket={onBuyPeriodTicket}
        onBuyHour24Ticket={onBuyHour24Ticket}
      />
    </ScrollView>
  ) : null;
};
