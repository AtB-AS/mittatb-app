import {GetAccountByPhoneErrorCode} from '@atb/on-behalf-of';
import {TicketRecipientType} from '@atb/stacks-hierarchy/types.ts';

export type ExistingRecipientType = Required<TicketRecipientType>;

export type OnBehalfOfErrorCode =
  | GetAccountByPhoneErrorCode
  | 'missing_recipient_name'
  | 'name_already_exists'
  | 'phone_already_exists';

export type RecipientSelectionState = {
  settingPhone: boolean;
  settingName: boolean;
  recipients?: ExistingRecipientType[];
  recipient?: ExistingRecipientType;
  phone?: string;
  prefix: string;
  name?: string;
  error?: OnBehalfOfErrorCode;
};
