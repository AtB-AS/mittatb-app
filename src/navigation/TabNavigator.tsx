import {
  Assistant as AssistantIcon,
  Nearby,
  Profile,
  Tickets,
} from '@atb/assets/svg/icons/tab-bar';
import ThemeText from '@atb/components/text';
import {LocationWithMetadata} from '@atb/favorites/types';
import {usePreferenceItems} from '@atb/preferences';
import Assistant from '@atb/screens/Assistant/';
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

type SubNavigator<T extends ParamListBase> = {
  [K in keyof T]: {screen: K; initial?: boolean; params?: T[K]};
}[keyof T];

export type TabNavigatorParams = {
  Assistant: {
    fromLocation: LocationWithMetadata;
    toLocation: LocationWithMetadata;
  };
  Nearest: NavigatorScreenParams<NearbyStackParams>;
  Ticketing: undefined;
  Profile: SubNavigator<ProfileStackParams>;
};
const Tab = createBottomTabNavigator<TabNavigatorParams>();

const NavigationRoot = () => {
  const {theme} = useTheme();
  const {t} = useTranslation();
  const {startScreen} = usePreferenceItems();
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: theme.colors.primary_2.backgroundColor,
        inactiveTintColor: theme.text.colors.secondary,
        style: {
          backgroundColor: theme.colors.background_0.backgroundColor,
          ...useBottomNavigationStyles(),
        },
        labelStyle: {
          fontSize: theme.typography.body__secondary.fontSize.valueOf(),
          lineHeight: theme.typography.body__secondary.lineHeight.valueOf(),
        },
      }}
      initialRouteName={settingToRouteName(startScreen)}
    >
      <Tab.Screen
        name="Assistant"
        component={Assistant}
        options={tabSettings(t(dictionary.navigation.assistant), AssistantIcon)}
      />
      <Tab.Screen
        name="Nearest"
        component={NearbyScreen}
        options={tabSettings(t(dictionary.navigation.nearby), Nearby)}
      />
      <Tab.Screen
        name="Ticketing"
        component={TicketingScreen}
        options={tabSettings(t(dictionary.navigation.ticketing), Tickets)}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={tabSettings(t(dictionary.navigation.profile), Profile)}
      />
    </Tab.Navigator>
  );
};

export default NavigationRoot;

type TabSettings = {
  tabBarLabel: string;
  tabBarIcon(props: {
    focused: boolean;
    color: string;
    size: number;
  }): JSX.Element;
};

function tabSettings(
  tabBarLabel: string,
  Icon: (svg: SvgProps) => JSX.Element,
): TabSettings {
  return {
    tabBarLabel: tabBarLabel,
    tabBarIcon: ({color}) => <ThemeIcon svg={Icon} fill={color} />,
  };
}
