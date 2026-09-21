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
import {ThemeIconProps} from '@atb/components/theme-icon';
import {usePreferencesContext} from '@atb/modules/preferences';
import {TabNav_DashboardStack} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack';
import {TabNav_DeparturesStack} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DeparturesStack';

import {TabNav_MapStack} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_MapStack';
import {TabNav_TicketingStack} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack';
import {useThemeContext} from '@atb/theme';
import {settingToRouteName} from '@atb/utils/navigation';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {useCallback, useEffect} from 'react';
import {BottomTabBar, BottomTabBarItem} from './BottomTabBar';
import {TabNavigatorStackParams} from './navigation-types';
import {TabNav_ProfileStack} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_ProfileStack';
import {dictionary, useTranslation} from '@atb/translations';
import {useOnPushNotificationOpened} from '@atb/modules/notifications';
import {useNavigation} from '@react-navigation/native';
import {RootNavigationProps} from '../navigation-types';
import {
  useOnboardingContext,
  useOnboardingFlow,
  useOnboardingNavigation,
} from '@atb/modules/onboarding';
import {useAuthContext} from '@atb/modules/auth';
import {isDefined} from '@atb/utils/presence';
import {useChatUnreadCount} from '@atb/modules/chat';
import {useDebugServerOverrides} from '@atb/modules/debug';

const Tab = createBottomTabNavigator<TabNavigatorStackParams>();

export const Root_TabNavigatorStack = () => {
  const {theme} = useThemeContext();
  const interactiveColor = theme.color.interactive[2];
  const {t} = useTranslation();
  const {startScreen} = usePreferencesContext().preferences;

  const navigation = useNavigation<RootNavigationProps>();

  const navigateToAvailableFareContracts = useCallback(() => {
    if (!navigation.isFocused()) return; // avoid navigating away from e.g. login or permission screens

    navigation.navigate('Root_TabNavigatorStack', {
      screen: 'TabNav_TicketingStack',
      params: {
        screen: 'Ticketing_RootScreen',
        params: {
          screen: 'TicketTabNav_AvailableFareContractsTabScreen',
          params: {},
        },
      },
    });
  }, [navigation]);

  useOnPushNotificationOpened(navigateToAvailableFareContracts);

  const {currentRouteName} = useOnboardingContext();
  const {nextOnboardingSection} = useOnboardingFlow(true); // assumeUserCreationOnboarded true to ensure outdated userCreationOnboarded value not used
  const {goToScreen} = useOnboardingNavigation();
  const {customerNumber} = useAuthContext();
  const unreadCount = useChatUnreadCount();
  const serverOverrides = useDebugServerOverrides();

  useEffect(() => {
    if (
      isDefined(nextOnboardingSection?.customEntryPointRouteName)
        ? currentRouteName === nextOnboardingSection?.customEntryPointRouteName
        : navigation.isFocused()
    ) {
      goToScreen(false, nextOnboardingSection?.initialScreen);
    }
  }, [
    nextOnboardingSection?.initialScreen,
    nextOnboardingSection?.customEntryPointRouteName,
    goToScreen,
    navigation,
    currentRouteName,
  ]);

  const getProfileNotification = (): ThemeIconProps['notification'] => {
    if (
      customerNumber === undefined ||
      unreadCount ||
      serverOverrides.length > 0
    ) {
      return {
        color: theme.color.status.error.primary,
        backgroundColor: interactiveColor.default,
      };
    }
  };

  const tabBarConfig: Record<string, BottomTabBarItem> = {
    TabNav_DashboardStack: {
      label: t(dictionary.navigation.assistant),
      Icon: Assistant,
      IconSelected: AssistantFill,
      testID: 'assistantTab',
    },
    TabNav_MapStack: {
      label: t(dictionary.navigation.map),
      Icon: MapPin,
      IconSelected: MapPinFill,
      testID: 'mapTab',
    },
    TabNav_DeparturesStack: {
      label: t(dictionary.navigation.nearby),
      Icon: Departures,
      IconSelected: DeparturesFill,
      testID: 'departuresTab',
    },
    TabNav_TicketingStack: {
      label: t(dictionary.navigation.ticketing),
      Icon: Ticketing,
      IconSelected: TicketingFill,
      testID: 'ticketsTab',
    },
    TabNav_ProfileStack: {
      label: t(dictionary.navigation.profile),
      Icon: Profile,
      IconSelected: ProfileFill,
      testID: 'profileTab',
      notification: getProfileNotification(),
    },
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={settingToRouteName(startScreen)}
      tabBar={(props) => <BottomTabBar {...props} config={tabBarConfig} />}
    >
      <Tab.Screen
        name="TabNav_DashboardStack"
        component={TabNav_DashboardStack}
      />
      <Tab.Screen
        name="TabNav_MapStack"
        component={TabNav_MapStack}
        // freezeOnBlur false is needed to update the map to not load tiles from the vector source
        options={{freezeOnBlur: false}}
      />
      <Tab.Screen
        name="TabNav_DeparturesStack"
        component={TabNav_DeparturesStack}
      />
      <Tab.Screen
        name="TabNav_TicketingStack"
        component={TabNav_TicketingStack}
      />
      <Tab.Screen name="TabNav_ProfileStack" component={TabNav_ProfileStack} />
    </Tab.Navigator>
  );
};
