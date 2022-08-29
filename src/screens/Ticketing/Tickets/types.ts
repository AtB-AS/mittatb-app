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

export const BuyTicketsScreenName = 'BuyTickets';
export const ActiveTicketsScreenName = 'ActiveTickets';

export type TicketTabsNavigatorParams = {
  [BuyTicketsScreenName]: undefined;
  [ActiveTicketsScreenName]: undefined;
};

export type TicketsStackRootProps = TabNavigatorScreenProps<'Ticketing'>;

export type TicketsStackRootNavigationProps =
  TabNavigatorNavigationProps<'Ticketing'>;

export type TicketsNavigationProps<T extends keyof TicketTabsNavigatorParams> =
  CompositeNavigationProp<
    NavigationProp<TicketTabsNavigatorParams, T>,
    TicketsStackRootNavigationProps
  >;

export type TicketsScreenProps<T extends keyof TicketTabsNavigatorParams> =
  CompositeScreenProps<
    StackScreenProps<TicketTabsNavigatorParams, T>,
    TicketsStackRootProps
  >;
