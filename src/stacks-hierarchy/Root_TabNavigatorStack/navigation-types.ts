import {
  CompositeNavigationProp,
  CompositeScreenProps,
  NavigationProp,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {DashboardStackParams} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/navigation-types';
import {NearbyStackParams} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_NearbyStack';
import {TicketingTabsNavigatorParams} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/types';
import {ProfileStackParams} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_ProfileStack/types';
import {MapStackParams} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_MapStack';
import {
  BottomTabNavigationProp,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import {RootStackParamList, RootStackScreenProps} from '@atb/stacks-hierarchy';

export type TabNavigatorStackParams = {
  TabNav_DashboardStack: NavigatorScreenParams<DashboardStackParams>;
  TabNav_NearestStack: NavigatorScreenParams<NearbyStackParams>;
  TabNav_TicketingStack: NavigatorScreenParams<TicketingTabsNavigatorParams>;
  TabNav_ProfileStack: NavigatorScreenParams<ProfileStackParams>;
  TabNav_MapStack: NavigatorScreenParams<MapStackParams>;
};

export type TabNavigatorScreenProps<T extends keyof TabNavigatorStackParams> =
  CompositeScreenProps<
    BottomTabScreenProps<TabNavigatorStackParams, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type TabNavigatorNavigationProps<
  T extends keyof TabNavigatorStackParams,
> = CompositeNavigationProp<
  BottomTabNavigationProp<TabNavigatorStackParams, T>,
  NavigationProp<RootStackParamList>
>;
