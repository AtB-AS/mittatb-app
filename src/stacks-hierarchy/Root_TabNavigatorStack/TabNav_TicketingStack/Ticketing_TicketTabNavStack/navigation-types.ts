import {CompositeScreenProps} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {TabNavigatorScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack';
import {StackParams} from '@atb/stacks-hierarchy/navigation-types';

export type TicketTabNavStackParams = StackParams<{
  TicketTabNav_PurchaseTabScreen: undefined;
  TicketTabNav_ActiveFareProductsTabScreen: undefined;
  Ticketing_TicketHistoryScreen: TicketingTicketHistoryScreenParams;
}>;

export type TicketingTicketHistoryScreenParams = {
  mode: 'expired' | 'sent';
};

export type TicketingStackRootProps =
  TabNavigatorScreenProps<'TabNav_TicketingStack'>;

export type TicketTabNavScreenProps<T extends keyof TicketTabNavStackParams> =
  CompositeScreenProps<
    StackScreenProps<TicketTabNavStackParams, T>,
    TicketingStackRootProps
  >;
