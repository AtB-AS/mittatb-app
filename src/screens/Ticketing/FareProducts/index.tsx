import FullScreenHeader from '@atb/components/screen-header/full-header';
import {StyleSheet} from '@atb/theme';
import {
  filterActiveOrCanBeUsedFareContracts,
  useTicketingState,
} from '@atb/ticketing';
import {TicketingTexts, useTranslation} from '@atb/translations';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from '@react-navigation/material-top-tabs';
import React from 'react';
import {View} from 'react-native';
import {ActiveFareProductsAndReservationsTab} from '../FareContracts/ActiveFareContracts/ActiveFareProductsAndReservationsTab';
import TabBar from './TabBar';
import {PurchaseTab} from './PurchaseTab';
import {TicketingTabsNavigatorParams} from '../types';

const Tab = createMaterialTopTabNavigator<TicketingTabsNavigatorParams>();

export default function TicketingTabs() {
  const styles = useStyles();
  const {t} = useTranslation();

  const {fareContracts} = useTicketingState();
  const activeFareContracts =
    filterActiveOrCanBeUsedFareContracts(fareContracts);
  const initialRoute: keyof TicketingTabsNavigatorParams =
    activeFareContracts.length
      ? 'ActiveFareProductsAndReservationsTab'
      : 'PurchaseTab';

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(TicketingTexts.header.title)}
        rightButton={{type: 'chat'}}
        globalMessageContext="app-ticketing"
      />
      <Tab.Navigator
        tabBar={(props: MaterialTopTabBarProps) => <TabBar {...props} />}
        initialRouteName={initialRoute}
      >
        <Tab.Screen
          name="PurchaseTab"
          component={PurchaseTab}
          options={{
            tabBarLabel: t(TicketingTexts.purchaseTab.label),
            tabBarAccessibilityLabel: t(TicketingTexts.purchaseTab.a11yLabel),
            tabBarTestID: 'purchaseTab',
          }}
        />
        <Tab.Screen
          name="ActiveFareProductsAndReservationsTab"
          component={ActiveFareProductsAndReservationsTab}
          options={{
            tabBarLabel: t(
              TicketingTexts.activeFareProductsAndReservationsTab.label,
            ),
            tabBarAccessibilityLabel: t(
              TicketingTexts.activeFareProductsAndReservationsTab.a11yLabel,
            ),
            tabBarTestID: 'activeTicketsTab',
          }}
        />
      </Tab.Navigator>
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.static.background.background_accent_0.background,
  },
}));
