import {useAuthState} from '@atb/auth';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import AnonymousPurchaseWarning from '@atb/screens/Ticketing/Purchase/AnonymousPurchaseWarning';
import {AvailableFareProducts} from '@atb/screens/Ticketing/FareProducts/AvailableFareProducts/AvailableFareProducts';
import {useTheme} from '@atb/theme';
import React from 'react';
import {ScrollView} from 'react-native';
import {RecentFareContracts} from './RecentFareProducts/RecentFareContracts';
import {TicketsScreenProps} from './types';
import UpgradeSplash from './UpgradeSplash';

type Props = TicketsScreenProps<'PurchaseTab'>;

export const PurchaseTab: React.FC<Props> = ({navigation}) => {
  const {must_upgrade_ticketing, enable_recent_tickets} = useRemoteConfig();
  const {abtCustomerId, authenticationType} = useAuthState();
  const isSignedInAsAbtCustomer = !!abtCustomerId;
  const {theme} = useTheme();

  if (must_upgrade_ticketing) return <UpgradeSplash />;

  const onBuySingleFareProduct = () => {
    navigation.navigate('TicketPurchase', {
      screen: 'PurchaseOverview',
      params: {
        selectableProductType: 'single',
      },
    });
  };

  const onBuyPeriodFareProduct = () => {
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
            screen: 'TicketPurchase',
            params: {
              screen: 'PurchaseOverview',
              params: {
                selectableProductType: 'period',
              },
            },
          },
        },
      });
    }
  };

  const onBuyHour24FareProduct = () => {
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
      {enable_recent_tickets && <RecentFareContracts />}
      {authenticationType !== 'phone' && <AnonymousPurchaseWarning />}
      <AvailableFareProducts
        onBuySingleFareProduct={onBuySingleFareProduct}
        onBuyPeriodFareProduct={onBuyPeriodFareProduct}
        onBuyHour24FareProduct={onBuyHour24FareProduct}
      />
    </ScrollView>
  ) : null;
};
