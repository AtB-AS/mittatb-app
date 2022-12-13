import {
  Assistant as AssistantIcon,
  Departures,
  Profile,
  Ticketing,
} from '@atb/assets/svg/mono-icons/tab-bar';
import {MapPin} from '../assets/svg/mono-icons/map';
import ThemeText from '@atb/components/text';
import ThemeIcon from '@atb/components/theme-icon/theme-icon';
import {usePreferenceItems} from '@atb/preferences';
import Dashboard from '@atb/screens/Dashboard';
import DeparturesStack from '@atb/screens/Departures';
import {useGoToMobileTokenOnboardingWhenNecessary} from '@atb/screens/MobileTokenOnboarding/utils';
import MapStack from '@atb/screens/Map';
import TicketingScreen from '@atb/screens/Ticketing';
import {useTheme} from '@atb/theme';
import {dictionary, useTranslation} from '@atb/translations/';
import {
  settingToRouteName,
  useBottomNavigationStyles,
} from '@atb/utils/navigation';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {LabelPosition} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import React from 'react';
import {SvgProps} from 'react-native-svg';
import {TabNavigatorParams} from './types';
import NearbyScreen from '@atb/screens/Nearby';
import ProfileScreen from '@atb/screens/Profile';
import {useMapPage} from '@atb/components/map/hooks/use-map-page';
import {useDeparturesV2Enabled} from '@atb/screens/Departures/use-new-departures';

const Tab = createBottomTabNavigator<TabNavigatorParams>();

const NavigationRoot = () => {
  const {theme} = useTheme();
  const {t} = useTranslation();
  const {startScreen} = usePreferenceItems();
  const lineHeight = theme.typography.body__secondary.fontSize.valueOf();

  const departuresV2Enabled = useDeparturesV2Enabled();

  const showMapPage = useMapPage();
  useGoToMobileTokenOnboardingWhenNecessary();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabelPosition: 'below-icon',
        tabBarActiveTintColor:
          theme.interactive.interactive_2.outline.background,
        tabBarInactiveTintColor: theme.text.colors.secondary,
        tabBarStyle: {
          backgroundColor: theme.interactive.interactive_2.default.background,
          ...useBottomNavigationStyles(),
        },
      }}
      initialRouteName={settingToRouteName(startScreen)}
    >
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={tabSettings(
          t(dictionary.navigation.assistant),
          t(dictionary.navigation.assistant_a11y),
          AssistantIcon,
          lineHeight,
          'assistantTab',
        )}
      />
      {showMapPage && (
        <Tab.Screen
          name="MapScreen"
          component={MapStack}
          options={tabSettings(
            t(dictionary.navigation.map),
            t(dictionary.navigation.map),
            MapPin,
            lineHeight,
            'mapPage',
          )}
        />
      )}
      <Tab.Screen
        name="Nearest"
        component={departuresV2Enabled ? DeparturesStack : NearbyScreen}
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
