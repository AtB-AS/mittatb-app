import {
  TabNavigatorNavigationProps,
  TabNavigatorScreenProps,
} from '@atb/navigation/types';
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

export type TicketingStackRootProps = TabNavigatorScreenProps<'Ticketing'>;

export type TicketingStackRootNavigationProps =
  TabNavigatorNavigationProps<'Ticketing'>;

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
