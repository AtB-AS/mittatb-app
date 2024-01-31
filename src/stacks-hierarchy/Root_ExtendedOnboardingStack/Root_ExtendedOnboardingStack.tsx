import {PageIndicator} from '@atb/components/page-indicator';
import {StyleSheet, useTheme} from '@atb/theme';
import {StaticColorByType} from '@atb/theme/colors';
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

const Tab = createMaterialTopTabNavigator<ExtendedOnboardingStackParams>();
const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export const Root_ExtendedOnboardingStack = () => {
  const styles = useStyles();
  const {theme} = useTheme();
  return (
    <>
      <StatusBar
        backgroundColor={theme.static.background[themeColor].background}
      />
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
    backgroundColor: theme.static.background[themeColor].background,
  },
}));
