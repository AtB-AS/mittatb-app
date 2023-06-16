import {useAuthState} from '@atb/auth';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {AnonymousPurchaseWarning} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/Ticketing_TicketTabNavStack/TicketTabNav_PurchaseTabScreen/Components/AnonymousPurchaseWarning';
import {FareProducts} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/Ticketing_TicketTabNavStack/TicketTabNav_PurchaseTabScreen/Components/FareProducts/FareProducts';
import {StyleSheet, useTheme} from '@atb/theme';
import React from 'react';
import {ScrollView, View} from 'react-native';
import {RecentFareContracts} from './Components/RecentFareContracts/RecentFareContracts';
import {TicketTabNavScreenProps} from '../navigation-types';
import {UpgradeSplash} from './Components/UpgradeSplash';
import {useRecentFareContracts} from './use-recent-fare-contracts';
import {FareProductTypeConfig} from '@atb/configuration';
import {RecentFareContract} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/Ticketing_TicketTabNavStack/TicketTabNav_PurchaseTabScreen/types';
import {useTipsAndInformationEnabled} from '@atb/stacks-hierarchy/Root_TipsAndInformation/use-tips-and-information-enabled';
import {useTicketingAssistantEnabled} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/use-ticketing-assistant-enabled';
import {TipsAndInformationTile} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/Assistant/TipsAndInformationTile';
import {TicketAssistantTile} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/Assistant/TicketAssistantTile';
import {useAnalytics} from '@atb/analytics';

type Props = TicketTabNavScreenProps<'TicketTabNav_PurchaseTabScreen'>;

export const TicketTabNav_PurchaseTabScreen = ({navigation}: Props) => {
  const {must_upgrade_ticketing, enable_recent_tickets} = useRemoteConfig();
  const {abtCustomerId, authenticationType} = useAuthState();
  const isSignedInAsAbtCustomer = !!abtCustomerId;
  const {theme} = useTheme();
  const {recentFareContracts} = useRecentFareContracts();
  const hasRecentFareContracts =
    enable_recent_tickets && !!recentFareContracts.length;
  const styles = useStyles();

  const showTipsAndInformation = useTipsAndInformationEnabled();
  const showTicketAssistant = useTicketingAssistantEnabled();
  const analytics = useAnalytics();

  if (must_upgrade_ticketing) return <UpgradeSplash />;

  const onProductSelect = (fareProductTypeConfig: FareProductTypeConfig) => {
    analytics.logEvent('Ticketing', 'Fare product selected', {
      type: fareProductTypeConfig.type,
    });
    if (
      fareProductTypeConfig.configuration.requiresLogin &&
      authenticationType !== 'phone'
    ) {
      navigation.navigate('Root_LoginRequiredForFareProductScreen', {
        fareProductTypeConfig,
        afterLogin: {
          screen: 'Root_PurchaseOverviewScreen',
          params: {
            fareProductTypeConfig,
            mode: 'Ticket',
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
    analytics.logEvent('Ticketing', 'Recently used fare product selected', {
      type: fareProductTypeConfig.type,
    });
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
        style={[
          styles.container,
          {
            backgroundColor: hasRecentFareContracts
              ? theme.static.background.background_2.background
              : undefined,
          },
        ]}
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
        <FareProducts onProductSelect={onProductSelect} />
        {showTicketAssistant && (
          <TicketAssistantTile
            onPress={() => {
              analytics.logEvent('Ticketing', 'Ticket assistant opened');
              navigation.navigate('Root_TicketAssistantStack');
            }}
            testID="ticketAssistant"
          />
        )}
      </View>
    </ScrollView>
  ) : null;
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    marginTop: theme.spacings.medium,
  },
}));
