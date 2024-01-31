import {
  RootStackParamList,
  StackParams,
} from '@atb/stacks-hierarchy/navigation-types';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {
  TicketTabNavStackParams,
  TicketingTicketHistoryScreenParams,
} from './Ticketing_TicketTabNavStack/navigation-types';
import {TabNavigatorScreenProps} from '../navigation-types';
import {StackScreenProps} from '@react-navigation/stack';

export type TicketingStackParams = StackParams<{
  Ticketing_NotEnabledScreen: undefined;
  Ticketing_RootScreen: NavigatorScreenParams<TicketTabNavStackParams>;
  Ticketing_TicketHistoryScreen: TicketingTicketHistoryScreenParams;
}>;

export type TicketingStackRootProps =
  TabNavigatorScreenProps<'TabNav_TicketingStack'>;

export type TicketingScreenProps<T extends keyof TicketingStackParams> =
  CompositeScreenProps<
    CompositeScreenProps<
      StackScreenProps<TicketingStackParams, T>,
      TicketingStackRootProps
    >,
    StackScreenProps<RootStackParamList>
  >;
