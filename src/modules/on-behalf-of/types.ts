export type GetAccountByPhoneErrorCode =
  | 'invalid_phone'
  | 'no_associated_account'
  | 'unknown_error';

export type OnBehalfOfAccountType = {
  accountId: string;
  phoneNumber: string;
  name: string;
};
