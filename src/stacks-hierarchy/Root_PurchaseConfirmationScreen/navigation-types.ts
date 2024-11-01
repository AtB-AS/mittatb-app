import {TicketRecipientType} from '@atb/ticketing';
import {PurchaseSelectionType} from '@atb/stacks-hierarchy/types.ts';

export type Root_PurchaseConfirmationScreenParams = {
  selection: PurchaseSelectionType;
  mode?: 'TravelSearch' | 'Ticket';
  recipient?: TicketRecipientType;
};
