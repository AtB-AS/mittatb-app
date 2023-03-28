import {
  Assistant as AssistantIcon,
  Departures,
  Profile,
  Ticketing,
} from '@atb/assets/svg/mono-icons/tab-bar';
import {MapPin} from '../../assets/svg/mono-icons/map';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {usePreferenceItems} from '@atb/preferences';
import {TabNav_DashboardStack} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack';
import {
  TabNav_DeparturesStack,
  useDeparturesV2Enabled,
} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DeparturesStack';
import {useGoToMobileTokenOnboardingWhenNecessary} from '@atb/stacks-hierarchy/Root_MobileTokenOnboarding/utils';
import {TabNav_MapStack} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_MapStack';
import {TabNav_TicketingStack} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack';
import {useTheme} from '@atb/theme';
import {
  settingToRouteName,
  useBottomNavigationStyles,
} from '@atb/utils/navigation';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {LabelPosition} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import React from 'react';
import {SvgProps} from 'react-native-svg';
import {TabNavigatorStackParams} from './navigation-types';
import {TabNav_NearbyStack} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_NearbyStack';
import {TabNav_ProfileStack} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_ProfileStack';
import {useMapPage} from '@atb/components/map';
import {dictionary, useTranslation} from '@atb/translations';

const Tab = createBottomTabNavigator<TabNavigatorStackParams>();

export const Root_TabNavigatorStack = () => {
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
        name="TabNav_DashboardStack"
        component={TabNav_DashboardStack}
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
          name="TabNav_MapStack"
          component={TabNav_MapStack}
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
        name="TabNav_NearestStack"
        component={
          departuresV2Enabled ? TabNav_DeparturesStack : TabNav_NearbyStack
        }
        options={tabSettings(
          t(dictionary.navigation.nearby),
          t(dictionary.navigation.nearby),
          Departures,
          lineHeight,
          'departuresTab',
        )}
      />
      <Tab.Screen
        name="TabNav_TicketingStack"
        component={TabNav_TicketingStack}
        options={tabSettings(
          t(dictionary.navigation.ticketing),
          t(dictionary.navigation.ticketing),
          Ticketing,
          lineHeight,
          'ticketsTab',
        )}
      />
      <Tab.Screen
        name="TabNav_ProfileStack"
        component={TabNav_ProfileStack}
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
