import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {LabelPosition} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import {ParamListBase} from '@react-navigation/native';
import React from 'react';
import {SvgProps} from 'react-native-svg';
import {
  Assistant as AssistantIcon,
  Nearby,
  Profile,
  Tickets,
} from '../assets/svg/icons/tab-bar';
import ThemeText from '../components/text';
import {LocationWithMetadata} from '../favorites/types';
import {
  Preference_ScreenAlternatives,
  usePreferenceItems,
} from '../preferences';
import Assistant from '../screens/Assistant';
import NearbyScreen from '../screens/Nearby';
import ProfileScreen, {ProfileStackParams} from '../screens/Profile';
import TicketingScreen from '../screens/Ticketing';
import {useTheme} from '../theme';

type SubNavigator<T extends ParamListBase> = {
  [K in keyof T]: {screen: K; initial?: boolean; params?: T[K]};
}[keyof T];

export type TabNavigatorParams = {
  Assistant: {
    fromLocation: LocationWithMetadata;
    toLocation: LocationWithMetadata;
  };
  Nearest: {
    location: LocationWithMetadata;
  };
  Ticketing: undefined;
  Profile: SubNavigator<ProfileStackParams>;
};

const Tab = createBottomTabNavigator<TabNavigatorParams>();

const NavigationRoot = () => {
  const {theme} = useTheme();
  const {startScreen} = usePreferenceItems();
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: theme.text.colors.focus,
        style: {
          backgroundColor: theme.background.level0,
        },
        labelStyle: {
          color: theme.text.colors.faded,
        },
      }}
      initialRouteName={settingToRouteName(startScreen)}
    >
      <Tab.Screen
        name="Assistant"
        component={Assistant}
        options={tabSettings('Reisesøk', AssistantIcon)}
      />
      <Tab.Screen
        name="Nearest"
        component={NearbyScreen}
        options={tabSettings('Avganger', Nearby)}
      />
      <Tab.Screen
        name="Ticketing"
        component={TicketingScreen}
        options={tabSettings('Billetter', Tickets)}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={tabSettings('Mitt AtB', Profile)}
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
};

function tabSettings(
  tabBarLabel: string,
  Icon: (svg: SvgProps) => JSX.Element,
): TabSettings {
  return {
    tabBarLabel: ({color}) => (
      <ThemeText type="lead" style={{color, lineHeight: 14}}>
        {tabBarLabel}
      </ThemeText>
    ),
    tabBarIcon: ({color}) => <Icon fill={color} />,
  };
}

function settingToRouteName(
  setting?: Preference_ScreenAlternatives,
): keyof TabNavigatorParams {
  switch (setting) {
    case 'assistant':
      return 'Assistant';
    case 'departures':
      return 'Nearest';
    case 'ticketing':
      return 'Ticketing';
    default:
      return 'Assistant';
  }
}
