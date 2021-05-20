import Header from '@atb/components/screen-header';
import {StyleSheet} from '@atb/theme';
import {filterActiveFareContracts, useTicketState} from '@atb/tickets';
import {TicketsTexts, useTranslation} from '@atb/translations';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React, {useMemo} from 'react';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import TabBar from './TabBar';
import {ActiveTickets, BuyTickets, ExpiredTickets} from './Tabs';

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
  const {top} = useSafeAreaInsets();
  const screenTopStyle = useMemo(
    () => ({
      paddingTop: top,
    }),
    [top],
  );

  const {fareContracts} = useTicketState();
  const activeFareContracts = filterActiveFareContracts(fareContracts);
  const initialRoute = activeFareContracts.length
    ? ActiveTicketsScreenName
    : BuyTicketsScreenName;

  return (
    <View style={[styles.container, screenTopStyle]}>
      <Header
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
          options={{tabBarLabel: t(TicketsTexts.buyTicketsTab.label)}}
        />
        <Tab.Screen
          name={ActiveTicketsScreenName}
          component={ActiveTickets}
          options={{tabBarLabel: t(TicketsTexts.activeTicketsTab.label)}}
        />
        <Tab.Screen
          name={ExpiredTicketsScreenName}
          component={ExpiredTickets}
          options={{tabBarLabel: t(TicketsTexts.expiredTicketsTab.label)}}
        />
      </Tab.Navigator>
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {flex: 1, backgroundColor: theme.colors.primary_2.backgroundColor},
}));
