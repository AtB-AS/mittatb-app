import {StyleSheet} from '@atb/theme';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from '@react-navigation/material-top-tabs';
import React from 'react';
import {PageIndicator} from '@atb/components/page-indicator';
import {StaticColorByType} from '@atb/theme/colors';
import {MobileTokenWithoutTravelcardOnboardingParams} from './navigation_types';
import {MobileTokenWithoutTravelcardOnboarding_CurrentTokenScreen} from './MobileTokenWithoutTravelcardOnboarding_CurrentTokenScreen';
import {MobileTokenWithoutTravelcardOnboarding_FlexibilityInfoScreen} from './MobileTokenWithoutTravelcardOnboarding_FlexibilityInfoScreen';
import {MobileTokenWithoutTravelcardOnboarding_OptionsInfoScreen} from './MobileTokenWithoutTravelcardOnboarding_OptionsInfoScreen';
import {MobileTokenWithoutTravelcardOnboarding_TicketSafetyInfoScreen} from './MobileTokenWithoutTravelcardOnboarding_TicketSafetyInfoScreen';
import {MobileTokenWithoutTravelcardOnboarding_SelectTravelTokenScreen} from './MobileTokenWithoutTravelcardOnboarding_SelectTravelTokenScreen';
import {View} from 'react-native';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

const Tab =
  createMaterialTopTabNavigator<MobileTokenWithoutTravelcardOnboardingParams>();

export const Root_MobileTokenWithoutTravelcardOnboardingStack = () => {
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <Tab.Navigator
        tabBar={(props: MaterialTopTabBarProps) => {
          return <PageIndicator {...props} />;
        }}
        tabBarPosition="bottom"
        initialRouteName="MobileTokenWithoutTravelcardOnboarding_FlexibilityInfoScreen"
        backBehavior="order"
      >
        <Tab.Screen
          name="MobileTokenWithoutTravelcardOnboarding_FlexibilityInfoScreen"
          key="MobileTokenWithoutTravelcardOnboarding_FlexibilityInfoScreen"
          component={
            MobileTokenWithoutTravelcardOnboarding_FlexibilityInfoScreen
          }
        />
        <Tab.Screen
          name="MobileTokenWithoutTravelcardOnboarding_OptionsInfoScreen"
          key="MobileTokenWithoutTravelcardOnboarding_OptionsInfoScreen"
          component={MobileTokenWithoutTravelcardOnboarding_OptionsInfoScreen}
        />
        <Tab.Screen
          name="MobileTokenWithoutTravelcardOnboarding_TicketSafetyInfoScreen"
          key="MobileTokenWithoutTravelcardOnboarding_TicketSafetyInfoScreen"
          component={
            MobileTokenWithoutTravelcardOnboarding_TicketSafetyInfoScreen
          }
        />
        <Tab.Screen
          name="MobileTokenWithoutTravelcardOnboarding_CurrentTokenScreen"
          key="MobileTokenWithoutTravelcardOnboarding_CurrentTokenScreen"
          component={MobileTokenWithoutTravelcardOnboarding_CurrentTokenScreen}
        />
        <Tab.Screen
          name="MobileTokenWithoutTravelcardOnboarding_SelectTravelTokenScreen"
          key="MobileTokenWithoutTravelcardOnboarding_SelectTravelTokenScreen"
          component={
            MobileTokenWithoutTravelcardOnboarding_SelectTravelTokenScreen
          }
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
