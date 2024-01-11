import {
  CompositeNavigationProp,
  CompositeScreenProps,
  NavigationProp,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {DashboardStackParams} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/navigation-types';
import {ProfileStackParams} from './TabNav_ProfileStack/navigation-types';
import {MapStackParams} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_MapStack';
import {
  BottomTabNavigationProp,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import {RootStackParamList, RootStackScreenProps} from '@atb/stacks-hierarchy';
import {TicketingStackParams} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/TabNav_TicketingStack';
import {DeparturesStackParams} from './TabNav_DeparturesStack';
import {StackParams} from '@atb/stacks-hierarchy/navigation-types';

export type TabNavigatorStackParams = StackParams<{
  TabNav_DashboardStack: NavigatorScreenParams<DashboardStackParams>;
  TabNav_DeparturesStack: NavigatorScreenParams<DeparturesStackParams>;
  TabNav_TicketingStack: NavigatorScreenParams<TicketingStackParams>;
  TabNav_ProfileStack: NavigatorScreenParams<ProfileStackParams>;
  TabNav_MapStack: NavigatorScreenParams<MapStackParams>;
}>;

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
