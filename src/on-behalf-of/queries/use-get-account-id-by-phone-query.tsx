import {getCustomerAccountId} from '@atb/api/profile';
import {useMutation} from '@tanstack/react-query';

export const useGetAccountIdByPhoneMutation = () => {
  return useMutation({
    mutationKey: ['getAccountIdByPhone'],
    mutationFn: (phoneNumber: string) => {
      return getCustomerAccountId(phoneNumber);
    },
  });
};
