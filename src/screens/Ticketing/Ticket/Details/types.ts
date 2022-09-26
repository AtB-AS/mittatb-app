import {RootStackScreenProps} from '@atb/navigation/types';
import {CompositeScreenProps} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {CarnetDetailsRouteParams} from './CarnetDetailsScreen';
import {TicketDetailsRouteParams} from './DetailsScreen';
import {ReceiptScreenRouteParams} from './ReceiptScreen';

export type TicketModalStackParams = {
  TicketDetails: TicketDetailsRouteParams;
  TicketReceipt: ReceiptScreenRouteParams;
  CarnetDetailsScreen: CarnetDetailsRouteParams;
};

export type TicketModalStackRootProps = RootStackScreenProps<'TicketModal'>;

export type TicketModalScreenProps<T extends keyof TicketModalStackParams> =
  CompositeScreenProps<
    StackScreenProps<TicketModalStackParams, T>,
    TicketModalStackRootProps
  >;
