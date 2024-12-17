import {PageIndicator} from '@atb/components/page-indicator';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from '@react-navigation/material-top-tabs';
import React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ExtendedOnboardingStackParams} from './navigation-types';
import {ExtendedOnboarding_GoodToKnowScreen} from './ExtendedOnboarding_GoodToKnowScreen';
import {ExtendedOnboarding_AlsoGoodToKnowScreen} from './ExtendedOnboarding_AlsoGoodToKnowScreen';
import {Theme} from '@atb/theme/colors';

const Tab = createMaterialTopTabNavigator<ExtendedOnboardingStackParams>();
const getThemeColor = (theme: Theme) => theme.color.background.accent[0];

export const Root_ExtendedOnboardingStack = () => {
  const styles = useStyles();
  const {theme} = useThemeContext();
  return (
    <>
      <StatusBar backgroundColor={getThemeColor(theme).background} />
      <SafeAreaView style={styles.container}>
        <Tab.Navigator
          tabBar={(props: MaterialTopTabBarProps) => {
            return <PageIndicator {...props} />;
          }}
          tabBarPosition="bottom"
          initialRouteName="ExtendedOnboarding_GoodToKnowScreen"
        >
          <>
            <Tab.Screen
              name="ExtendedOnboarding_GoodToKnowScreen"
              component={ExtendedOnboarding_GoodToKnowScreen}
            />
            <Tab.Screen
              name="ExtendedOnboarding_AlsoGoodToKnowScreen"
              component={ExtendedOnboarding_AlsoGoodToKnowScreen}
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
