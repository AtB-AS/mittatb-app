import {
  Assistant as AssistantIcon,
  Departures,
  Profile,
  Ticketing,
} from '@atb/assets/svg/mono-icons/tab-bar';
import ThemeText from '@atb/components/text';
import {Location} from '@atb/favorites/types';
import {usePreferenceItems} from '@atb/preferences';
import Assistant from '@atb/screens/Assistant';
import Dashboard from '@atb/screens/Dashboard/Dashboard';
import NearbyScreen, {NearbyStackParams} from '@atb/screens/Nearby';
import ProfileScreen, {ProfileStackParams} from '@atb/screens/Profile';
import TicketingScreen from '@atb/screens/Ticketing';
import {useTheme} from '@atb/theme';
import {dictionary, useTranslation} from '@atb/translations/';
import {
  settingToRouteName,
  useBottomNavigationStyles,
} from '@atb/utils/navigation';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {LabelPosition} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import {NavigatorScreenParams, ParamListBase} from '@react-navigation/native';
import React from 'react';
import {SvgProps} from 'react-native-svg';
import ThemeIcon from '@atb/components/theme-icon/theme-icon';
import DeparturesScreen from '@atb/screens/Departures';

type SubNavigator<T extends ParamListBase> = {
  [K in keyof T]: {screen: K; initial?: boolean; params?: T[K]};
}[keyof T];

export type TabNavigatorParams = {
  Assistant: {
    fromLocation: Location;
    toLocation: Location;
  };
  Nearest: NavigatorScreenParams<NearbyStackParams>;
  Ticketing: undefined;
  Profile: SubNavigator<ProfileStackParams>;
};
const Tab = createBottomTabNavigator<TabNavigatorParams>();

const NavigationRoot = () => {
  const {theme} = useTheme();
  const {t} = useTranslation();
  const {startScreen, newDepartures, newFrontPage} = usePreferenceItems();
  const lineHeight = theme.typography.body__secondary.fontSize.valueOf();

  return (
    <Tab.Navigator
      tabBarOptions={{
        labelPosition: 'below-icon',
        activeTintColor: theme.interactive.interactive_2.outline.background,
        inactiveTintColor: theme.text.colors.secondary,
        style: {
          backgroundColor: theme.interactive.interactive_2.default.background,
          ...useBottomNavigationStyles(),
        },
      }}
      initialRouteName={settingToRouteName(startScreen)}
    >
      <Tab.Screen
        name="Assistant"
        component={newFrontPage ? Dashboard : Assistant}
        options={tabSettings(
          t(dictionary.navigation.assistant),
          t(dictionary.navigation.assistant_a11y),
          AssistantIcon,
          lineHeight,
          'assistantTab',
        )}
      />
      <Tab.Screen
        name="Nearest"
        component={newDepartures ? DeparturesScreen : NearbyScreen}
        options={tabSettings(
          t(dictionary.navigation.nearby),
          t(dictionary.navigation.nearby),
          Departures,
          lineHeight,
          'departuresTab',
        )}
      />
      <Tab.Screen
        name="Ticketing"
        component={TicketingScreen}
        options={tabSettings(
          t(dictionary.navigation.ticketing),
          t(dictionary.navigation.ticketing),
          Ticketing,
          lineHeight,
          'ticketsTab',
        )}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={tabSettings(
          t(dictionary.navigation.profile),
          t(dictionary.navigation.profile_a11y),
          Profile,
          lineHeight,
          'profileTab',
        )}
      />
    </Tab.Navigator>
  );
};

export default NavigationRoot;

type TabSettings = {
  tabBarLabel(props: {
    focused: boolean;
    color: string;
    position: LabelPosition;
  }): JSX.Element;
  tabBarIcon(props: {
    focused: boolean;
    color: string;
    size: number;
  }): JSX.Element;
  testID?: string;
};

function tabSettings(
  tabBarLabel: string,
  tabBarA11yLabel: string,
  Icon: (svg: SvgProps) => JSX.Element,
  lineHeight: number,
  testID: string,
): TabSettings {
  return {
    tabBarLabel: ({color}) => (
      <ThemeText
        type="body__secondary"
        style={{color, textAlign: 'center', lineHeight}}
        accessibilityLabel={tabBarA11yLabel}
        testID={testID}
      >
        {tabBarLabel}
      </ThemeText>
    ),
    tabBarIcon: ({color}) => <ThemeIcon svg={Icon} fill={color} />,
  };
}
