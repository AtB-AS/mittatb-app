import {GetAccountByPhoneErrorCode} from '@atb/on-behalf-of';
import {OnBehalfOfAccountType} from '@atb/on-behalf-of/types';

export type OnBehalfOfErrorCode =
  | GetAccountByPhoneErrorCode
  | 'no_recipient_selected'
  | 'missing_recipient_name'
  | 'too_long_recipient_name'
  | 'name_already_exists'
  | 'phone_already_exists';

export type RecipientSelectionState = {
  settingPhone: boolean;
  settingName: boolean;
  recipient?: OnBehalfOfAccountType;
  phone?: string;
  prefix: string;
  name?: string;
  error?: OnBehalfOfErrorCode;
};
