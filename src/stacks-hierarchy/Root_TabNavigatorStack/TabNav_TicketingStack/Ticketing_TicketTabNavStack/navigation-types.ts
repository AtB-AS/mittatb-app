import {CompositeScreenProps} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {StackParams} from '@atb/stacks-hierarchy/navigation-types';
import {TicketingScreenProps} from '../navigation-types';
import type {PurchaseSelectionType} from '@atb/modules/purchase-selection';
import type {TripPattern} from '@atb/api/types/trips';
import type {PreReservation} from '@atb/modules/ticketing';

export type TicketTabNavStackParams = StackParams<{
  TicketTabNav_PurchaseTabScreen: undefined;
  TicketTabNav_AvailableFareContractsTabScreen: {
    refreshTickets?: boolean;
    showTransferCodeSuccess?: boolean;
    savedTripPattern?: TripPattern;
    preReservation?: Omit<PreReservation, 'created'>;
  };
  TicketTabNav_TripSelectionScreen: {
    selection: PurchaseSelectionType;
  };
}>;

export type TicketTabNavStackRootProps =
  TicketingScreenProps<'Ticketing_RootScreen'>;

export type TicketTabNavScreenProps<T extends keyof TicketTabNavStackParams> =
  CompositeScreenProps<
    StackScreenProps<TicketTabNavStackParams, T>,
    TicketTabNavStackRootProps
  >;
