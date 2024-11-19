import {Root_PurchaseConfirmationScreenParams} from '../Root_PurchaseConfirmationScreen';

export type Root_ChooseTicketRecipientScreenParams = Omit<
  Root_PurchaseConfirmationScreenParams,
  'recipient'
>;
