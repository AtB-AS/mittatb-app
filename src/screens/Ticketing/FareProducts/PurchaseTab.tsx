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
import {FareProductTypeConfig} from '@atb/screens/Ticketing/FareContracts/utils';

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

  const onProductSelect = (fareProductTypeConfig: FareProductTypeConfig) => {
    if (
      fareProductTypeConfig.type === 'period' &&
      authenticationType !== 'phone'
    ) {
      navigation.navigate('LoginInApp', {
        screen: 'LoginOnboardingInApp',
        params: {
          afterLogin: {
            screen: 'Purchase',
            params: {
              screen: 'PurchaseOverview',
              params: {
                fareProductTypeConfig,
              },
            },
          },
        },
      });
    } else {
      navigation.navigate('Purchase', {
        screen: 'PurchaseOverview',
        params: {
          fareProductTypeConfig: fareProductTypeConfig,
        },
      });
    }
  };

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
        <AvailableFareProducts onProductSelect={onProductSelect} />
      </View>
    </ScrollView>
  ) : null;
};
