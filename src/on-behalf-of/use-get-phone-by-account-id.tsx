import {useGetPhoneByAccountIdQuery} from './queries/use-get-phone-by-account-id-query';

export const useGetPhoneByAccountId = (accountId: string) => {
  const {
    data: phoneNumber,
    isLoading,
    isError,
  } = useGetPhoneByAccountIdQuery(accountId);

  return {phoneNumber, isLoading, isError};
};
