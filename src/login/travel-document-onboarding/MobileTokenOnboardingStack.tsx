import {StyleSheet} from '@atb/theme';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import {View} from 'react-native';
import TicketInformationalOverlay from '@atb/screens/Ticketing/Tickets/TicketInformationalOverlay';

import {StaticColorByType} from '@atb/theme/colors';
import {
  FlexibilityInfo,
  OptionsInfo,
  TicketSafetyInfo,
} from '@atb/login/travel-document-onboarding/OnboardingInfo';
import {PageIndicator} from '@atb/login/travel-document-onboarding/PageIndicator';
import MobileToken from '@atb/login/travel-document-onboarding/MobileToken';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export type TicketTabsNavigatorParams = {
  FlexibilityInfo: undefined;
  OptionsInfo: undefined;
  TicketSafetyInfo: undefined;
  MobileToken: undefined;
};

const Tab = createMaterialTopTabNavigator<TicketTabsNavigatorParams>();

export default function MobileTokenOnboardingStack() {
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <Tab.Navigator
        tabBar={(props) => <PageIndicator {...props} />}
        tabBarPosition="bottom"
        initialRouteName="FlexibilityInfo"
      >
        <Tab.Screen
          name="FlexibilityInfo"
          key="FlexibilityInfo"
          component={FlexibilityInfo}
        />
        <Tab.Screen
          name="OptionsInfo"
          key="OptionsInfo"
          component={OptionsInfo}
        />
        <Tab.Screen
          name="TicketSafetyInfo"
          key="TicketSafetyInfo"
          component={TicketSafetyInfo}
        />
        <Tab.Screen
          name="MobileToken"
          key="MobileToken"
          component={MobileToken}
        />
      </Tab.Navigator>

      <TicketInformationalOverlay />
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.static.background[themeColor].background,
  },
}));
