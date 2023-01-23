import {
  TabNavigatorNavigationProps,
  TabNavigatorScreenProps,
} from '@atb/stacks-hierarchy/Root_TabNavigatorStack';
import {
  CompositeNavigationProp,
  CompositeScreenProps,
  NavigationProp,
} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';

export type TicketingTabsNavigatorParams = {
  PurchaseTab: undefined;
  ActiveFareProductsAndReservationsTab: undefined;
};

export type TicketingStackRootProps =
  TabNavigatorScreenProps<'TabNav_TicketingStack'>;

export type TicketingStackRootNavigationProps =
  TabNavigatorNavigationProps<'TabNav_TicketingStack'>;

export type TicketingNavigationProps<
  T extends keyof TicketingTabsNavigatorParams,
> = CompositeNavigationProp<
  NavigationProp<TicketingTabsNavigatorParams, T>,
  TicketingStackRootNavigationProps
>;

export type TicketingScreenProps<T extends keyof TicketingTabsNavigatorParams> =
  CompositeScreenProps<
    StackScreenProps<TicketingTabsNavigatorParams, T>,
    TicketingStackRootProps
  >;
