import {StackParams} from '@atb/stacks-hierarchy/navigation-types';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {TicketTabNavStackParams} from './Ticketing_TicketTabNavStack/navigation-types';
import {TabNavigatorScreenProps} from '../navigation-types';
import {StackScreenProps} from '@react-navigation/stack';
import {TicketHistoryScreenParams} from '@atb/screen-components/ticket-history';

export type TicketingStackParams = StackParams<{
  Ticketing_NotEnabledScreen: undefined;
  Ticketing_RootScreen: NavigatorScreenParams<TicketTabNavStackParams>;
  Ticketing_TicketHistoryScreen: TicketHistoryScreenParams;
}>;

export type TicketingStackRootProps =
  TabNavigatorScreenProps<'TabNav_TicketingStack'>;

export type TicketingScreenProps<T extends keyof TicketingStackParams> =
  CompositeScreenProps<
    StackScreenProps<TicketingStackParams, T>,
    TicketingStackRootProps
  >;
