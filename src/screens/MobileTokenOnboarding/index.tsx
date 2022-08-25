import {StyleSheet} from '@atb/theme';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from '@react-navigation/material-top-tabs';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';

import {StaticColorByType} from '@atb/theme/colors';
import {
  FlexibilityInfoScreen,
  OptionsInfoScreen,
  TicketSafetyInfoScreen,
} from '@atb/screens/MobileTokenOnboarding/OnboardingInfo';
import MobileToken from '@atb/screens/MobileTokenOnboarding/components/MobileToken';
import {PageIndicator} from '@atb/components/page-indicator';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export type MobileTokenTabParams = {
  FlexibilityInfoScreen: undefined;
  OptionsInfoScreen: undefined;
  TicketSafetyInfoScreen: undefined;
  MobileToken: undefined;
  Assistant: undefined;
  Nearest: undefined;
  Ticketing: undefined;
  Profile: undefined;
  SelectTravelToken: undefined;
};

const Tab = createMaterialTopTabNavigator<MobileTokenTabParams>();

export default function Index() {
  const styles = useStyles();
  return (
    <SafeAreaView style={styles.container}>
      <Tab.Navigator
        tabBar={(props: MaterialTopTabBarProps) => {
          return <PageIndicator {...props} />;
        }}
        tabBarPosition="bottom"
        initialRouteName="FlexibilityInfoScreen"
      >
        <Tab.Screen
          name="FlexibilityInfoScreen"
          key="FlexibilityInfoScreen"
          component={FlexibilityInfoScreen}
        />
        <Tab.Screen
          name="OptionsInfoScreen"
          key="OptionsInfoScreen"
          component={OptionsInfoScreen}
        />
        <Tab.Screen
          name="TicketSafetyInfoScreen"
          key="TicketSafetyInfoScreen"
          component={TicketSafetyInfoScreen}
        />
        <Tab.Screen
          name="MobileToken"
          key="MobileToken"
          component={MobileToken}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.static.background[themeColor].background,
  },
}));
