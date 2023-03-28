import {useAuthState} from '@atb/auth';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import AnonymousPurchaseWarning from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/Ticketing_TicketTabNavStack/TicketTabNav_PurchaseTabScreen/Components/AnonymousPurchaseWarning';
import {FareProducts} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/Ticketing_TicketTabNavStack/TicketTabNav_PurchaseTabScreen/Components/FareProducts/FareProducts';
import {useTheme} from '@atb/theme';
import React from 'react';
import {ScrollView, View} from 'react-native';
import {RecentFareContracts} from './Components/RecentFareContracts/RecentFareContracts';
import {TicketTabNavScreenProps} from '../navigation-types';
import {UpgradeSplash} from './Components/UpgradeSplash';
import {useRecentFareContracts} from './use-recent-fare-contracts';
import {FareProductTypeConfig} from '@atb/configuration';
import {RecentFareContract} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/Ticketing_TicketTabNavStack/TicketTabNav_PurchaseTabScreen/types';

type Props = TicketTabNavScreenProps<'TicketTabNav_PurchaseTabScreen'>;

export const TicketTabNav_PurchaseTabScreen = ({navigation}: Props) => {
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
      fareProductTypeConfig.configuration.requiresLogin &&
      authenticationType !== 'phone'
    ) {
      navigation.navigate('LoginInApp', {
        screen: 'LoginOnboardingInApp',
        params: {
          fareProductTypeConfig,
          afterLogin: {
            screen: 'Root_PurchaseOverviewScreen',
            params: {
              fareProductTypeConfig,
              mode: 'Ticket',
            },
          },
        },
      });
    } else {
      navigation.navigate('Root_PurchaseOverviewScreen', {
        fareProductTypeConfig: fareProductTypeConfig,
        mode: 'Ticket',
      });
    }
  };

  const onFareContractSelect = (
    rfc: RecentFareContract,
    fareProductTypeConfig: FareProductTypeConfig,
  ) => {
    navigation.navigate('Root_PurchaseOverviewScreen', {
      fareProductTypeConfig,
      preassignedFareProduct: rfc.preassignedFareProduct,
      userProfilesWithCount: rfc.userProfilesWithCount,
      fromTariffZone: rfc.fromTariffZone && {
        ...rfc.fromTariffZone,
        resultType: 'zone',
      },
      toTariffZone: rfc.toTariffZone && {
        ...rfc.toTariffZone,
        resultType: 'zone',
      },
      mode: 'Ticket',
    });
  };

  return isSignedInAsAbtCustomer ? (
    <ScrollView>
      {hasRecentFareContracts && (
        <RecentFareContracts onSelect={onFareContractSelect} />
      )}
      <View
        style={{
          backgroundColor: hasRecentFareContracts
            ? theme.static.background.background_2.background
            : undefined,
        }}
      >
        {authenticationType !== 'phone' && (
          <AnonymousPurchaseWarning
            onPress={() =>
              navigation.navigate('Root_PurchaseAsAnonymousConsequencesScreen')
            }
          />
        )}
        <FareProducts onProductSelect={onProductSelect} />
      </View>
    </ScrollView>
  ) : null;
};
