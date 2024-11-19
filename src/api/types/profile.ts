export type EmailAvailableResponse = {available: boolean};

export type CustomerProfileUpdate = Partial<{
  firstName: string;
  surname: string;
  email: string;
  phone: string;
}>;

export type CustomerProfile = {
  email: string;
  firstName: string;
  surname: string;
  phone: string;
};

export type OnBehalfOfAccountsResponse = {
  customerAccountId: string;
  sentToAccountId: string;
  sentToAlias: string;
  sentToPhoneNumber: string;
}[];
