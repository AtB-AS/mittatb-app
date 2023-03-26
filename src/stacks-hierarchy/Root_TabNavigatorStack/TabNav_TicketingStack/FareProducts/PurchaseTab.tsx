import {useAuthState} from '@atb/auth';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import AnonymousPurchaseWarning from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/FareProducts/AnonymousPurchaseWarning';
import {AvailableFareProducts} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/FareProducts/AvailableFareProducts/AvailableFareProducts';
import {useTheme} from '@atb/theme';
import React from 'react';
import {ScrollView, View} from 'react-native';
import {RecentFareContracts} from './RecentFareProducts/RecentFareContracts';
import {TicketingScreenProps} from '../types';
import UpgradeSplash from './UpgradeSplash';
import useRecentFareContracts from './use-recent-fare-contracts';
import {FareProductTypeConfig} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/FareContracts/utils';
import {TicketAssistantTile} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/Assistant/TicketAssistantTile';
import {useTipsAndInformation} from '@atb/stacks-hierarchy/Root_TipsAndInformation/use-tips-and-information';
import {useTicketingAssistant} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/use-ticketing-assistant';
import {TipsAndInformationTile} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/Assistant/TipsAndInformationTile';

type Props = TicketingScreenProps<'PurchaseTab'>;

export const PurchaseTab: React.FC<Props> = ({navigation}) => {
  const {must_upgrade_ticketing, enable_recent_tickets} = useRemoteConfig();
  const {abtCustomerId, authenticationType} = useAuthState();
  const isSignedInAsAbtCustomer = !!abtCustomerId;
  const {theme} = useTheme();
  const {recentFareContracts} = useRecentFareContracts();
  const hasRecentFareContracts =
    enable_recent_tickets && !!recentFareContracts.length;

  const showTipsAndInformation = useTipsAndInformation();
  const showTicketAssistant = useTicketingAssistant();

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
        {authenticationType !== 'phone' && (
          <AnonymousPurchaseWarning
            onPress={() =>
              navigation.navigate('Root_PurchaseAsAnonymousConsequencesScreen')
            }
          />
        )}

        {showTipsAndInformation && (
          <TipsAndInformationTile
            onPress={() => {
              navigation.navigate('Root_TipsAndInformation');
            }}
            testID="tipsAndInformation"
          />
        )}
        <AvailableFareProducts onProductSelect={onProductSelect} />
        {showTicketAssistant && (
          <TicketAssistantTile
            onPress={() => {
              navigation.navigate('Root_TicketAssistantStack');
            }}
            testID="ticketAssistant"
          />
        )}
      </View>
    </ScrollView>
  ) : null;
};
