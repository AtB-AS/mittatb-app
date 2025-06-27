import {PageIndicator} from '@atb/components/page-indicator';
import {StyleSheet} from '@atb/theme';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from '@react-navigation/material-top-tabs';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Theme} from '@atb/theme/colors';
import {BonusOnboardingStackParams} from './navigation-types';
import {BonusOnboarding_WelcomeScreen} from './BonusOnboarding_WelcomeScreen';
import {BonusOnboarding_BuyTicketsScreen} from './BonusOnboarding_BuyTickets';
import {BonusOnboarding_MoreTravelMethodsScreen} from './BonusOnboarding_MoreTravelMethods';
import {BonusOnboarding_DownloadScreen} from './BonusOnboarding_Download';

const Tab = createMaterialTopTabNavigator<BonusOnboardingStackParams>();
const getThemeColor = (theme: Theme) => theme.color.background.accent[0];

export const Root_BonusOnboardingStack = () => {
  const styles = useStyles();
  return (
    <>
      <SafeAreaView style={styles.container}>
        <Tab.Navigator
          tabBar={(props: MaterialTopTabBarProps) => {
            return <PageIndicator {...props} />;
          }}
          tabBarPosition="bottom"
          initialRouteName="BonusOnboarding_WelcomeScreen"
        >
          <>
            <Tab.Screen
              name="BonusOnboarding_WelcomeScreen"
              component={BonusOnboarding_WelcomeScreen}
            />
            <Tab.Screen
              name="BonusOnboarding_BuyTicketsScreen"
              component={BonusOnboarding_BuyTicketsScreen}
            />
            <Tab.Screen
              name="BonusOnboarding_MoreTravelMethodsScreen"
              component={BonusOnboarding_MoreTravelMethodsScreen}
            />
            <Tab.Screen
              name="BonusOnboarding_DownloadScreen"
              component={BonusOnboarding_DownloadScreen}
            />
          </>
        </Tab.Navigator>
      </SafeAreaView>
    </>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: getThemeColor(theme).background,
  },
}));
