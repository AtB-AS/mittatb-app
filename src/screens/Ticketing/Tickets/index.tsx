import FullScreenHeader from '@atb/components/screen-header/full-header';
import {StyleSheet} from '@atb/theme';
import {
  filterActiveOrCanBeUsedFareContracts,
  useTicketState,
} from '@atb/tickets';
import {TicketsTexts, useTranslation} from '@atb/translations';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from '@react-navigation/material-top-tabs';
import React from 'react';
import {View} from 'react-native';
import {ActiveTickets} from './ActiveTickets/ActiveTickets';
import TabBar from './TabBar';
import {BuyTickets} from './Tabs';
import {
  ActiveTicketsScreenName,
  BuyTicketsScreenName,
  TicketTabsNavigatorParams,
} from './types';

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
        globalMessageContext="app-ticketing"
      />
      <Tab.Navigator
        tabBar={(props: MaterialTopTabBarProps) => <TabBar {...props} />}
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

      {
        // Should be added when expected terms and conditions are ready
        /* <TicketInformationalOverlay/> */
      }
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.static.background.background_accent_0.background,
  },
}));
