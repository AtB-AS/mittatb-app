import {StyleSheet} from '@atb/theme';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from '@react-navigation/material-top-tabs';
import React from 'react';

import {PageIndicator} from '@atb/components/page-indicator';
import {StaticColorByType} from '@atb/theme/colors';
import {MobileTokenOnboardingParams} from './navigation_types';
import {MobileTokenOnboarding_CurrentTokenScreen} from './MobileTokenOnboarding_CurrentTokenScreen';
import {MobileTokenOnboarding_FlexibilityInfoScreen} from './MobileTokenOnboarding_FlexibilityInfoScreen';
import {MobileTokenOnboarding_OptionsInfoScreen} from './MobileTokenOnboarding_OptionsInfoScreen';
import {MobileTokenOnboarding_TicketSafetyInfoScreen} from './MobileTokenOnboarding_TicketSafetyInfoScreen';
import {MobileTokenOnboarding_SelectTravelTokenScreen} from './MobileTokenOnboarding_SelectTravelTokenScreen';
import {View} from 'react-native';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

const Tab = createMaterialTopTabNavigator<MobileTokenOnboardingParams>();

export const Root_MobileTokenOnboardingStack = () => {
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <Tab.Navigator
        tabBar={(props: MaterialTopTabBarProps) => {
          return <PageIndicator {...props} />;
        }}
        tabBarPosition="bottom"
        initialRouteName="MobileTokenOnboarding_FlexibilityInfoScreen"
        backBehavior="order"
      >
        <Tab.Screen
          name="MobileTokenOnboarding_FlexibilityInfoScreen"
          key="MobileTokenOnboarding_FlexibilityInfoScreen"
          component={MobileTokenOnboarding_FlexibilityInfoScreen}
        />
        <Tab.Screen
          name="MobileTokenOnboarding_OptionsInfoScreen"
          key="MobileTokenOnboarding_OptionsInfoScreen"
          component={MobileTokenOnboarding_OptionsInfoScreen}
        />
        <Tab.Screen
          name="MobileTokenOnboarding_TicketSafetyInfoScreen"
          key="MobileTokenOnboarding_TicketSafetyInfoScreen"
          component={MobileTokenOnboarding_TicketSafetyInfoScreen}
        />
        <Tab.Screen
          name="MobileTokenOnboarding_CurrentTokenScreen"
          key="MobileTokenOnboarding_CurrentTokenScreen"
          component={MobileTokenOnboarding_CurrentTokenScreen}
        />
        <Tab.Screen
          name="MobileTokenOnboarding_SelectTravelTokenScreen"
          key="MobileTokenOnboarding_SelectTravelTokenScreen"
          component={MobileTokenOnboarding_SelectTravelTokenScreen}
        />
      </Tab.Navigator>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.static.background[themeColor].background,
  },
}));
