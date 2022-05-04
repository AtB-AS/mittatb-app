import {StyleSheet} from '@atb/theme';
import {
  filterActiveOrCanBeUsedFareContracts,
  useTicketState,
} from '@atb/tickets';
import {TicketsTexts, useTranslation} from '@atb/translations';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import {View} from 'react-native';
import TabBar from './TabBar';
import {BuyTickets} from './Tabs';
import {ActiveTickets} from './ActiveTickets/ActiveTickets';
import TicketInformationalOverlay from '@atb/screens/Ticketing/Tickets/TicketInformationalOverlay';
import FullScreenHeader from '@atb/components/screen-header/full-header';

export const BuyTicketsScreenName = 'BuyTickets';
export const ActiveTicketsScreenName = 'ActiveTickets';

export type TicketTabsNavigatorParams = {
  [BuyTicketsScreenName]: undefined;
  [ActiveTicketsScreenName]: undefined;
};

const Tab = createMaterialTopTabNavigator<TicketTabsNavigatorParams>();

export default function TicketTabs() {
  const styles = useStyles();
  const {t} = useTranslation();

  const {fareContracts} = useTicketState();
  const activeFareContracts =
    filterActiveOrCanBeUsedFareContracts(fareContracts);
  const initialRoute = activeFareContracts.length
    ? ActiveTicketsScreenName
    : BuyTicketsScreenName;

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(TicketsTexts.header.title)}
        rightButton={{type: 'chat'}}
        alertContext="ticketing"
      />
      <Tab.Navigator
        tabBar={(props) => <TabBar {...props} />}
        initialRouteName={initialRoute}
      >
        <Tab.Screen
          name={BuyTicketsScreenName}
          component={BuyTickets}
          options={{
            tabBarLabel: t(TicketsTexts.buyTicketsTab.label),
            tabBarAccessibilityLabel: t(TicketsTexts.buyTicketsTab.a11yLabel),
            tabBarTestID: 'buyTicketsTab',
          }}
        />
        <Tab.Screen
          name={ActiveTicketsScreenName}
          component={ActiveTickets}
          options={{
            tabBarLabel: t(TicketsTexts.activeTicketsTab.label),
            tabBarAccessibilityLabel: t(
              TicketsTexts.activeTicketsTab.a11yLabel,
            ),
            tabBarTestID: 'validTicketsTab',
          }}
        />
      </Tab.Navigator>

      <TicketInformationalOverlay />
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.static.background.background_accent_0.background,
  },
}));
