import {CompositeScreenProps} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {TabNavigatorScreenProps} from '@atb/stacks-hierarchy/Root_TabNavigatorStack';
import {StackParams} from '@atb/stacks-hierarchy/navigation-types';

export type TicketingStackRootProps =
  TabNavigatorScreenProps<'TabNav_TicketingStack'>;

export type TicketTabNavStackParams = StackParams<{
  TicketTabNav_PurchaseTabScreen: undefined;
  TicketTabNav_ActiveFareProductsTabScreen: undefined;
}>;

export type TicketTabNavScreenProps<T extends keyof TicketTabNavStackParams> =
  CompositeScreenProps<
    StackScreenProps<TicketTabNavStackParams, T>,
    TicketingStackRootProps
  >;
