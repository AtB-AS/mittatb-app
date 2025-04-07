import {
  AssistantFill,
  Assistant,
  Departures,
  DeparturesFill,
  MapPinFill,
  Profile,
  ProfileFill,
  Ticketing,
  TicketingFill,
} from '@atb/assets/svg/mono-icons/tab-bar';
import {MapPin} from '../../assets/svg/mono-icons/tab-bar';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon, ThemeIconProps} from '@atb/components/theme-icon';
import {usePreferencesContext} from '@atb/preferences';
import {TabNav_DashboardStack} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack';
import {TabNav_DeparturesStack} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DeparturesStack';

import {TabNav_MapStack} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_MapStack';
import {TabNav_TicketingStack} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack';
import {useThemeContext} from '@atb/theme';
import {
  settingToRouteName,
  useBottomNavigationStyles,
} from '@atb/utils/navigation';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {LabelPosition} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import React, {useEffect} from 'react';
import {SvgProps} from 'react-native-svg';
import {TabNavigatorStackParams} from './navigation-types';
import {TabNav_ProfileStack} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_ProfileStack';
import {dictionary, useTranslation} from '@atb/translations';
import {useOnPushNotificationOpened} from '@atb/modules/notifications';
import {useNavigation} from '@react-navigation/native';
import {RootNavigationProps} from '../navigation-types';
import {useOnboardingFlow, useOnboardingNavigation} from '@atb/onboarding';
import {useAuthContext} from '@atb/auth';

const Tab = createBottomTabNavigator<TabNavigatorStackParams>();

export const Root_TabNavigatorStack = () => {
  const {theme} = useThemeContext();
  const interactiveColor = theme.color.interactive[2];
  const {t} = useTranslation();
  const {startScreen} = usePreferencesContext().preferences;
  const lineHeight = theme.typography.body__secondary.fontSize.valueOf();

  useOnPushNotificationOpened();

  const navigation = useNavigation<RootNavigationProps>();

  const {nextOnboardingSection} = useOnboardingFlow(true); // assumeUserCreationOnboarded true to ensure outdated userCreationOnboarded value not used
  const {goToScreen} = useOnboardingNavigation();
  const {customerNumber} = useAuthContext();

  useEffect(() => {
    if (!navigation.isFocused()) return; // only show onboarding screens from Root_TabNavigatorStack path

    const nextOnboardingScreen = nextOnboardingSection?.initialScreen;
    nextOnboardingScreen?.name && goToScreen(false, nextOnboardingScreen);
  }, [nextOnboardingSection?.initialScreen, goToScreen, navigation]);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabelPosition: 'below-icon',
        tabBarActiveTintColor: interactiveColor.outline.background,
        tabBarInactiveTintColor: theme.color.foreground.dynamic.secondary,
        tabBarStyle: {
          borderTopWidth: theme.border.width.slim,
          borderTopColor: theme.color.border.primary.background,
          backgroundColor: interactiveColor.default.background,
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
          Assistant,
          AssistantFill,
          lineHeight,
          'assistantTab',
        )}
      />
      <Tab.Screen
        name="TabNav_MapStack"
        component={TabNav_MapStack}
        options={{
          ...tabSettings(
            t(dictionary.navigation.map),
            t(dictionary.navigation.map),
            MapPin,
            MapPinFill,
            lineHeight,
            'mapTab',
          ),
          ...{freezeOnBlur: false}, // needed to update the map to not load tiles from the vector source
        }}
      />
      <Tab.Screen
        name="TabNav_DeparturesStack"
        component={TabNav_DeparturesStack}
        options={tabSettings(
          t(dictionary.navigation.nearby),
          t(dictionary.navigation.nearby),
          Departures,
          DeparturesFill,
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
          TicketingFill,
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
          ProfileFill,
          lineHeight,
          'profileTab',
          customerNumber === undefined
            ? {
                color: theme.color.status.error.primary,
                backgroundColor: interactiveColor.default,
              }
            : undefined,
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
  IconSelected: (svg: SvgProps) => JSX.Element,
  lineHeight: number,
  testID: string,
  notification?: ThemeIconProps['notification'],
): TabSettings {
  return {
    tabBarLabel: ({color}) => (
      <ThemeText
        typography="body__secondary"
        style={{color, textAlign: 'center', lineHeight}}
        accessibilityLabel={tabBarA11yLabel}
        maxFontSizeMultiplier={1.2}
        testID={testID}
      >
        {tabBarLabel}
      </ThemeText>
    ),
    tabBarIcon: ({color, focused}) => (
      <ThemeIcon
        svg={focused ? IconSelected : Icon}
        color={color}
        notification={notification}
      />
    ),
  };
}
