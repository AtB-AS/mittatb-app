import {PageIndicator} from '@atb/components/page-indicator';
import {StyleSheet} from '@atb/theme';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from '@react-navigation/material-top-tabs';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Theme} from '@atb/theme/colors';
import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {
  SmartParkAndRideOnboarding_AutomaticRegistrationScreen,
  SmartParkAndRideOnboarding_InformationScreen,
  SmartParkAndRideOnboardingProvider,
} from '@atb/modules/smart-park-and-ride';
import {Root_SmartParkAndRideAddScreen} from '..';

const Tab = createMaterialTopTabNavigator();

// Wrapper component to pass hideHeader prop
const SmartParkAndRideAddScreenWithoutHeader = (props: any) => {
  return (
    <Root_SmartParkAndRideAddScreen
      {...props}
      route={{...props.route, params: {hideHeader: true}}}
    />
  );
};
const getThemeColor = (theme: Theme) => theme.color.background.accent[0];

type Props = RootStackScreenProps<'Root_SmartParkAndRideOnboardingStack'>;

export const Root_SmartParkAndRideOnboardingStack = ({}: Props) => {
  const styles = useStyles();

  return (
    <SmartParkAndRideOnboardingProvider>
      <SafeAreaView style={styles.container}>
        <Tab.Navigator
          tabBar={(props: MaterialTopTabBarProps) => {
            return <PageIndicator {...props} />;
          }}
          tabBarPosition="bottom"
          initialRouteName="SmartParkAndRideOnboarding_WelcomeScreen"
        >
          <Tab.Screen
            name="SmartParkAndRideOnboarding_InformationScreen"
            component={SmartParkAndRideOnboarding_InformationScreen}
          />
          <Tab.Screen
            name="SmartParkAndRideOnboarding_AutomaticRegistrationScreen"
            component={SmartParkAndRideOnboarding_AutomaticRegistrationScreen}
          />
          <Tab.Screen
            name="Root_SmartParkAndRideAddScreen"
            component={SmartParkAndRideAddScreenWithoutHeader}
          />
        </Tab.Navigator>
      </SafeAreaView>
    </SmartParkAndRideOnboardingProvider>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: getThemeColor(theme).background,
  },
}));
