export type {GetAccountByPhoneErrorCode, OnBehalfOfAccountType} from './types';
export {
  useFetchOnBehalfOfAccountsQuery,
  FETCH_ON_BEHALF_OF_ACCOUNTS_QUERY_KEY,
} from './queries/use-fetch-on-behalf-of-accounts-query';
export {useGetAccountIdByPhoneMutation} from './queries/use-get-account-id-by-phone-query';
export {useGetPhoneByAccountIdQuery} from './queries/use-get-phone-by-account-id-query';
