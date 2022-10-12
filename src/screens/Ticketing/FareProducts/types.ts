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

export type TicketsStackRootProps = TabNavigatorScreenProps<'Ticketing'>;

export type TicketsStackRootNavigationProps =
  TabNavigatorNavigationProps<'Ticketing'>;

export type TicketsNavigationProps<
  T extends keyof TicketingTabsNavigatorParams,
> = CompositeNavigationProp<
  NavigationProp<TicketingTabsNavigatorParams, T>,
  TicketsStackRootNavigationProps
>;

export type TicketsScreenProps<T extends keyof TicketingTabsNavigatorParams> =
  CompositeScreenProps<
    StackScreenProps<TicketingTabsNavigatorParams, T>,
    TicketsStackRootProps
  >;
