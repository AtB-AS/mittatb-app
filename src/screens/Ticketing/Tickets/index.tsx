import {StyleSheet} from '@atb/theme';
import {filterActiveFareContracts, useTicketState} from '@atb/tickets';
import {TicketsTexts, useTranslation} from '@atb/translations';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import {View} from 'react-native';
import TabBar from './TabBar';
import {ActiveTickets, BuyTickets, ExpiredTickets} from './Tabs';
import TicketInformationalOverlay from '@atb/screens/Ticketing/Tickets/TicketInformationalOverlay';
import FullScreenHeader from '@atb/components/screen-header/full-header';

export const BuyTicketsScreenName = 'BuyTickets';
export const ActiveTicketsScreenName = 'ActiveTickets';
export const ExpiredTicketsScreenName = 'ExpiredTickets';

export type TicketTabsNavigatorParams = {
  [BuyTicketsScreenName]: undefined;
  [ActiveTicketsScreenName]: undefined;
  [ExpiredTicketsScreenName]: undefined;
};

const Tab = createMaterialTopTabNavigator<TicketTabsNavigatorParams>();

export default function TicketTabs() {
  const styles = useStyles();
  const {t} = useTranslation();

  const {fareContracts} = useTicketState();
  const activeFareContracts = filterActiveFareContracts(fareContracts);
  const initialRoute = activeFareContracts.length
    ? ActiveTicketsScreenName
    : BuyTicketsScreenName;

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(TicketsTexts.header.title)}
        rightButton={{type: 'chat'}}
        leftButton={{type: 'home'}}
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
          }}
        />
        <Tab.Screen
          name={ExpiredTicketsScreenName}
          component={ExpiredTickets}
          options={{
            tabBarLabel: t(TicketsTexts.expiredTicketsTab.label),
            tabBarAccessibilityLabel: t(
              TicketsTexts.expiredTicketsTab.a11yLabel,
            ),
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
    backgroundColor: theme.colors.background_gray.backgroundColor,
  },
}));
