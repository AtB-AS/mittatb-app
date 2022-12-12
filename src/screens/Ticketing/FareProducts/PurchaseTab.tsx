import {useAuthState} from '@atb/auth';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import AnonymousPurchaseWarning from '@atb/screens/Ticketing/Purchase/AnonymousPurchaseWarning';
import {AvailableFareProducts} from '@atb/screens/Ticketing/FareProducts/AvailableFareProducts/AvailableFareProducts';
import {useTheme} from '@atb/theme';
import React from 'react';
import {ScrollView, View} from 'react-native';
import {RecentFareContracts} from './RecentFareProducts/RecentFareContracts';
import {TicketingScreenProps} from '../types';
import UpgradeSplash from './UpgradeSplash';
import useRecentFareContracts from './use-recent-fare-contracts';
import {PreassignedFareProductType} from '@atb/reference-data/types';

type Props = TicketingScreenProps<'PurchaseTab'>;

export const PurchaseTab: React.FC<Props> = ({navigation}) => {
  const {must_upgrade_ticketing, enable_recent_tickets} = useRemoteConfig();
  const {abtCustomerId, authenticationType} = useAuthState();
  const isSignedInAsAbtCustomer = !!abtCustomerId;
  const {theme} = useTheme();
  const {recentFareContracts} = useRecentFareContracts();
  const hasRecentFareContracts =
    enable_recent_tickets && !!recentFareContracts.length;

  if (must_upgrade_ticketing) return <UpgradeSplash />;

  const navigateToPurchaseOverview = (
    productType: PreassignedFareProductType,
  ) => {
    navigation.navigate('Purchase', {
      screen: 'PurchaseOverview',
      params: {
        selectableProductType: productType,
      },
    });
  };

  const onBuySingleFareProduct = () => navigateToPurchaseOverview('single');

  const onBuyNightFareProduct = () => navigateToPurchaseOverview('night');

  const onBuyPeriodFareProduct = () => {
    if (authenticationType === 'phone') {
      navigateToPurchaseOverview('period');
    } else {
      navigation.navigate('LoginInApp', {
        screen: 'LoginOnboardingInApp',
        params: {
          afterLogin: {
            screen: 'Purchase',
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

  const onBuyHour24FareProduct = () => navigateToPurchaseOverview('hour24');

  return isSignedInAsAbtCustomer ? (
    <ScrollView>
      {hasRecentFareContracts && <RecentFareContracts />}
      <View
        style={{
          backgroundColor: hasRecentFareContracts
            ? theme.static.background.background_2.background
            : undefined,
        }}
      >
        {authenticationType !== 'phone' && <AnonymousPurchaseWarning />}
        <AvailableFareProducts
          onBuySingleFareProduct={onBuySingleFareProduct}
          onBuyPeriodFareProduct={onBuyPeriodFareProduct}
          onBuyHour24FareProduct={onBuyHour24FareProduct}
          onBuyNightFareProduct={onBuyNightFareProduct}
        />
      </View>
    </ScrollView>
  ) : null;
};
